#!/usr/bin/env node

/**
 * AI-powered Documentation Translator
 *
 * Translates Markdown documentation to target language using AI APIs.
 * Supports multiple providers: Anthropic Claude, OpenAI, DeepL, Azure OpenAI.
 *
 * Usage:
 *   AI_PROVIDER=anthropic AI_API_KEY=xxx AI_MODEL=claude-sonnet-4-20250514 node translate.mjs
 *
 * Environment Variables:
 *   AI_PROVIDER   - Provider name (anthropic, openai, deepL, azure)
 *   AI_API_KEY    - API key for the provider
 *   AI_MODEL      - Model name (e.g., claude-sonnet-4-20250514, gpt-4o)
 *   AI_ENDPOINT   - Custom API endpoint (optional, for proxies or Azure)
 *   TARGET_LANG   - Target language code (default: zh-Hans)
 *   FORCE_RETRANSLATE - Force retranslate existing files (default: false)
 *   CONCURRENCY   - Max parallel file translations (default: 3)
 *   CHUNK_CONCURRENCY - Max parallel chunks per file (default: 5)
 *   TEST_FILE     - Single file test mode (path relative to website/)
 *   TRANSLATE_FILES - Comma-separated list of files to translate (for CI incremental translate)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple semaphore for concurrency control
class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.current < this.max) {
      this.current++;
      return null;
    }
    return new Promise(resolve => this.queue.push(resolve));
  }

  release() {
    this.current--;
    if (this.queue.length > 0) {
      this.current++;
      const next = this.queue.shift();
      next();
    }
  }
}

// Configuration from environment variables
const config = {
  provider: process.env.AI_PROVIDER || 'anthropic',
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL || 'claude-sonnet-4-20250514',
  endpoint: process.env.AI_ENDPOINT || null,
  targetLang: process.env.TARGET_LANG || 'zh-Hans',
  forceRetranslate: process.env.FORCE_RETRANSLATE === 'true',
  concurrency: parseInt(process.env.CONCURRENCY) || 3,
  chunkConcurrency: parseInt(process.env.CHUNK_CONCURRENCY) || 5,
  testFile: process.env.TEST_FILE || null,  // Single file test mode
  translateFiles: process.env.TRANSLATE_FILES || null,  // Comma-separated file list
};

// Validate required config
if (!config.apiKey) {
  console.error('Error: AI_API_KEY environment variable is required');
  process.exit(1);
}

const langNames = {
  'zh-Hans': 'Simplified Chinese',
  'zh-Hant': 'Traditional Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
};

const targetLangName = langNames[config.targetLang] || config.targetLang;

// Translation prompts for each provider
const translatePrompt = `Translate the following Markdown documentation to ${targetLangName}.

IMPORTANT RULES:
- Preserve ALL Markdown formatting (headers with #, code blocks with \`\`\`, links, images, tables, etc.)
- Keep technical terms in English if no standard translation exists in ${targetLangName}
- Maintain the exact same structure and line breaks as the original
- For code blocks, only translate comments and strings, NOT the code itself
- Output ONLY the translated text, NO explanations or quotes

Text to translate:`;

// AI Provider implementations
const providers = {
  anthropic: {
    translate: async (text) => {
      const { Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic({
        apiKey: config.apiKey,
        baseURL: config.endpoint || undefined,
      });

      const response = await client.messages.create({
        model: config.model,
        max_tokens: 8192,
        messages: [
          {
            role: 'user',
            content: `${translatePrompt}\n\n${text}`,
          },
        ],
      });

      return response.content[0].text;
    },
  },

  openai: {
    translate: async (text) => {
      const { OpenAI } = await import('openai');
      const client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.endpoint || undefined,
      });

      const response = await client.chat.completions.create({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: `You are a professional technical documentation translator. Translate Markdown documentation to ${targetLangName}. Preserve all Markdown formatting. Keep technical terms in English if no standard translation exists. Only output the translation.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      });

      // Debug: log response structure if choices is empty
      if (!response.choices || response.choices.length === 0) {
        console.error('    [DEBUG] Empty response:', JSON.stringify(response));
        throw new Error('API returned empty choices');
      }

      return response.choices[0].message.content;
    },
  },

  deepL: {
    translate: async (text) => {
      const langMap = {
        'zh-Hans': 'ZH',
        'zh-Hant': 'ZH',
        'ja': 'JA',
        'ko': 'KO',
        'fr': 'FR',
        'de': 'DE',
        'es': 'ES',
        'pt': 'PT',
        'it': 'IT',
        'ru': 'RU',
      };
      const target = langMap[config.targetLang] || 'ZH';

      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: [text],
          target_lang: target,
          preserve_formatting: true,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepL API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.translations[0].translated_text;
    },
  },

  azure: {
    translate: async (text) => {
      const { OpenAI } = await import('openai');
      const client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.endpoint,
        defaultQuery: { 'api-version': '2024-02-1' },
      });

      const response = await client.chat.completions.create({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: `You are a professional technical documentation translator. Translate Markdown documentation to ${targetLangName}. Preserve all Markdown formatting. Keep technical terms in English if no standard translation exists. Only output the translation.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      });

      return response.choices[0].message.content;
    },
  },
};

/**
 * Find all Markdown files in a directory
 */
function findMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({ fullPath, relativePath });
    }
  }
  return files;
}

/**
 * Parse Markdown into structured blocks
 * Keeps code blocks, tables, lists, and headings as atomic units
 * Special handling for mdx-code-block wrapping JSX components
 */
function parseMarkdownBlocks(text) {
  const blocks = [];
  let currentBlock = { type: 'content', lines: [] };
  const lines = text.split('\n');
  let inCodeBlock = false;
  let inTable = false;
  let tableHeaderProcessed = false;
  let inList = false;
  let inBlockquote = false;
  let inMdxCodeBlock = false;
  let listIndent = -1;

  const flushBlock = () => {
    if (currentBlock.lines.length > 0) {
      blocks.push(currentBlock);
      currentBlock = { type: 'content', lines: [] };
    }
  };

  const getIndent = (line) => {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Code block delimiters
    if (trimmedLine === '```' || trimmedLine.startsWith('```')) {
      if (!inCodeBlock) {
        flushBlock();
        inCodeBlock = true;
        inMdxCodeBlock = trimmedLine.includes('mdx-code-block');
        currentBlock = { type: 'code', lines: [line] };
      } else {
        currentBlock.lines.push(line);
        blocks.push(currentBlock);
        currentBlock = { type: 'content', lines: [] };
        inCodeBlock = false;
        inMdxCodeBlock = false;
        continue;
      }
      continue;
    }

    if (inCodeBlock) {
      currentBlock.lines.push(line);

      // Special: mdx-code-block - keep following JSX tag in same block
      if (inMdxCodeBlock && trimmedLine.startsWith('<') && trimmedLine.includes('>')) {
        // Look ahead to find the closing tag and closing code block
        const jsxOpenMatch = trimmedLine.match(/^<([A-Z][a-zA-Z0-9]*)[^>]*>$/);
        if (jsxOpenMatch) {
          const tagName = jsxOpenMatch[1];
          // Continue collecting lines until we find the closing tag and closing ```
          let j = i + 1;
          let foundClose = false;
          while (j < lines.length) {
            const nextLine = lines[j];
            const nextTrimmed = nextLine.trim();
            currentBlock.lines.push(nextLine);

            // Check for closing tag of the same JSX component
            if (nextTrimmed === `</${tagName}>`) {
              foundClose = true;
              j++;
              break;
            }
            // Check for closing code block marker
            if (nextTrimmed === '```') {
              j++;
              break;
            }
            j++;
          }

          // Add the closing code block line if we stopped at it
          if (j < lines.length && lines[j].trim() === '```') {
            currentBlock.lines.push(lines[j]);
            j++;
          }

          // Skip the lines we already consumed
          i = j - 1;
          blocks.push(currentBlock);
          currentBlock = { type: 'content', lines: [] };
          inCodeBlock = false;
          inMdxCodeBlock = false;
          continue;
        }
      }
      continue;
    }

    // Table detection
    if (!inTable && line.includes('|') && line.trim().startsWith('|')) {
      flushBlock();
      inTable = true;
      tableHeaderProcessed = false;
      currentBlock = { type: 'table', lines: [line] };
      continue;
    }

    if (inTable) {
      currentBlock.lines.push(line);
      // Check if we've passed the header separator (|---|)
      if (line.match(/^\|[\s-|]+\|/)) {
        tableHeaderProcessed = true;
      }
      // Table ends when we hit a non-table line
      if (tableHeaderProcessed && !line.includes('|') && line.trim() !== '') {
        blocks.push(currentBlock);
        currentBlock = { type: 'content', lines: [] };
        inTable = false;
        tableHeaderProcessed = false;
      } else if (tableHeaderProcessed && i === lines.length - 1) {
        blocks.push(currentBlock);
        currentBlock = { type: 'content', lines: [] };
        inTable = false;
      }
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      if (!inBlockquote) {
        flushBlock();
        inBlockquote = true;
        currentBlock = { type: 'blockquote', lines: [line] };
      } else {
        currentBlock.lines.push(line);
      }
      continue;
    } else if (inBlockquote) {
      blocks.push(currentBlock);
      currentBlock = { type: 'content', lines: [] };
      inBlockquote = false;
    }

    // Headings
    if (line.match(/^#{1,6}\s/)) {
      flushBlock();
      blocks.push({ type: 'heading', lines: [line] });
      continue;
    }

    // List items
    if (line.match(/^(\s*)[-*+]\s/) || line.match(/^(\s*)\d+\.\s/)) {
      const indent = getIndent(line);
      if (!inList || indent !== listIndent) {
        if (!inList) {
          flushBlock();
        }
        inList = true;
        listIndent = indent;
        currentBlock = { type: 'list', lines: [line] };
      } else {
        currentBlock.lines.push(line);
      }
      continue;
    } else if (inList) {
      blocks.push(currentBlock);
      currentBlock = { type: 'content', lines: [] };
      inList = false;
      listIndent = -1;
    }

    // Horizontal rule
    if (line.match(/^[-*_]{3,}\s*$/)) {
      flushBlock();
      blocks.push({ type: 'hr', lines: [line] });
      continue;
    }

    // Regular content
    currentBlock.lines.push(line);
  }

  // Flush remaining content
  if (currentBlock.lines.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
}

/**
 * Split blocks into chunks that fit within token limits
 * PRESERVES exact line formatting (indentation, newlines)
 */
function splitIntoChunks(blocks, maxChars = 4000) {
  const chunks = [];
  let currentLines = [];  // Array of lines, not joined strings
  let currentSize = 0;

  const flushChunk = () => {
    if (currentLines.length > 0) {
      chunks.push(currentLines.join('\n'));
      currentLines = [];
      currentSize = 0;
    }
  };

  for (const block of blocks) {
    const blockLines = block.lines;
    const blockSize = blockLines.reduce((sum, l) => sum + l.length + 1, 0);

    // Atomic blocks (code, table, heading, hr) - never split within
    if (['code', 'heading', 'hr', 'table', 'blockquote'].includes(block.type)) {
      if (currentSize + blockSize > maxChars && currentLines.length > 0) {
        flushChunk();
      }
      // Add newline before block if current chunk has content
      if (currentLines.length > 0 && blockLines[0] !== '') {
        currentLines.push('');  // blank line separator
        currentSize += 1;
      }
      currentLines.push(...blockLines);
      currentSize += blockSize;
      continue;
    }

    // List - try to keep together as lines
    if (block.type === 'list') {
      // If adding this list would exceed limit and we have content, flush first
      if (currentSize + blockSize > maxChars && currentLines.length > 0) {
        flushChunk();
      }

      // Add separator if needed
      if (currentLines.length > 0 && blockLines[0] !== '') {
        currentLines.push('');
        currentSize += 1;
      }

      currentLines.push(...blockLines);
      currentSize += blockSize;
      continue;
    }

    // Regular content blocks - add lines with proper paragraph separation
    for (const line of blockLines) {
      const lineSize = line.length + 1;

      if (line === '') {
        // Blank line = paragraph separator
        if (currentLines.length > 0 && currentLines[currentLines.length - 1] !== '') {
          currentLines.push(line);  // Keep the blank line
          currentSize += 1;
        }
        continue;
      }

      if (currentSize + lineSize > maxChars && currentLines.length > 0) {
        flushChunk();
      }
      currentLines.push(line);
      currentSize += lineSize;
    }
  }

  if (currentLines.length > 0) {
    flushChunk();
  }

  return chunks.length > 0 ? chunks : [''];
}

/**
 * Protect MDX/JSX components from being translated
 * Replaces JSX tags with placeholders that will be restored after translation
 */
function protectMdxComponents(text) {
  const components = [];
  let componentIndex = 0;

  // Match common Docusaurus MDX components
  const knownComponents = [
    'APITable', 'Details', 'details', 'summary',
    'BrowserWindow', 'Tag', 'blockquote', 'Blockquote'
  ];

  // Pattern to match JSX components: <TagName>...</TagName> or <TagName />
  // Only matches components starting with uppercase (custom Docusaurus components)
  const jsxPattern = /<([A-Z][a-zA-Z0-9]*)\b[^>]*(?:>[\s\S]*?<\/\1>|\/>)/g;

  text = text.replace(jsxPattern, (match) => {
    // Only protect known custom components
    const tagMatch = match.match(/^<([A-Z][a-zA-Z0-9]*)/);
    if (tagMatch && knownComponents.includes(tagMatch[1])) {
      const placeholder = `__MDX_COMPONENT_${componentIndex}__`;
      components.push(match);
      componentIndex++;
      return placeholder;
    }
    return match; // Don't protect unknown components
  });

  return { text, components };
}

/**
 * Restore MDX components after translation
 */
function restoreMdxComponents(text, components) {
  for (let i = 0; i < components.length; i++) {
    text = text.replace(`__MDX_COMPONENT_${i}__`, components[i]);
  }
  return text;
}

/**
 * Translate a single file with parallel chunk processing
 */
async function translateFile(inputPath, outputPath, relativePath, chunkSem) {
  const content = fs.readFileSync(inputPath, 'utf-8');
  const fileSize = Buffer.byteLength(content, 'utf-8');

  // Check if file already exists and skip if not forcing
  if (fs.existsSync(outputPath) && !config.forceRetranslate) {
    return { status: 'skipped', path: relativePath };
  }

  const provider = providers[config.provider];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${config.provider}. Supported: ${Object.keys(providers).join(', ')}`);
  }

  try {
    // Parse markdown into blocks and split into chunks
    const blocks = parseMarkdownBlocks(content);
    const chunks = splitIntoChunks(blocks, 4000);

    console.log(`\n  📄 ${relativePath}`);
    console.log(`     Size: ${(fileSize / 1024).toFixed(1)} KB | Blocks: ${blocks.length} | Chunks: ${chunks.length}`);

    // Translate chunks in parallel with semaphore
    const translateChunk = async (chunk, idx) => {
      await chunkSem.acquire();
      const chunkSize = Buffer.byteLength(chunk, 'utf-8');
      const startTime = Date.now();
      try {
        console.log(`     [${idx + 1}/${chunks.length}] ${(chunkSize / 1024).toFixed(1)} KB translating...`);

        // Protect MDX components before translation
        const { text: protectedChunk, components } = protectMdxComponents(chunk);

        let result = await provider.translate(protectedChunk);

        // Strip thinking tags and restore MDX components
        result = stripThinkingContent(result);
        result = restoreMdxComponents(result, components);

        const elapsed = Date.now() - startTime;
        console.log(`     [${idx + 1}/${chunks.length}] ✅ done (${elapsed}ms)`);

        return result;
      } finally {
        chunkSem.release();
      }
    };

    // Process all chunks in parallel (limited by semaphore)
    const translatedChunks = await Promise.all(
      chunks.map((chunk, idx) => translateChunk(chunk, idx))
    );

    let result = translatedChunks.join('\n\n');

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result, 'utf-8');

    console.log(`     → Saved to ${relativePath}`);
    return { status: 'success', path: relativePath };
  } catch (error) {
    console.error(`  → Error: ${error.message}`);
    return { status: 'failed', path: relativePath, error: error.message };
  }
}

/**
 * Strip thinking/reasoning content from AI response
 */
function stripThinkingContent(text) {
  if (!text) return text;

  // Remove <thinking>...</thinking> tags
  text = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');

  // Remove <think>...</think> tags
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

  // Remove AI reasoning tags like <reasoning>...</reasoning>
  text = text.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '');

  // Remove any remaining XML-style thinking tags
  text = text.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/gi, (match) => {
    const tagName = match.match(/^<([^>]+)>/)?.[1]?.toLowerCase();
    if (['thinking', 'reasoning', 'reflection'].includes(tagName)) {
      return '';
    }
    return match;
  });

  // Clean up multiple blank lines and trim
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}

/**
 * Test mode: translate a single file
 */
async function testSingleFile() {
  const websiteRoot = path.join(__dirname, '..');
  const docsDir = path.join(websiteRoot, 'docs');
  const blogDir = path.join(websiteRoot, 'blog');
  const basicsDir = path.join(websiteRoot, 'basics');
  const versionedDir = path.join(websiteRoot, 'versioned_docs');

  // TEST_FILE can be absolute or relative to website root
  let inputPath = config.testFile;
  if (!path.isAbsolute(inputPath)) {
    inputPath = path.join(websiteRoot, inputPath);
  }

  // Determine the output path preserving directory structure
  // Docusaurus i18n structure:
  // - Non-versioned docs: i18n/{locale}/docusaurus-plugin-content-docs/current/{path}
  // - Versioned docs: i18n/{locale}/docusaurus-plugin-content-docs/{version}/{path}
  // - Blog: i18n/{locale}/docusaurus-plugin-content-blog/current/{path}
  let outputPath;
  let relativePath;

  if (inputPath.startsWith(docsDir)) {
    relativePath = path.relative(docsDir, inputPath);
    outputPath = path.join(
      websiteRoot,
      `i18n/${config.targetLang}/docusaurus-plugin-content-docs/current`,
      relativePath
    );
  } else if (inputPath.startsWith(basicsDir)) {
    // basics is under docs in docusaurus, so goes under current/
    relativePath = path.relative(basicsDir, inputPath);
    outputPath = path.join(
      websiteRoot,
      `i18n/${config.targetLang}/docusaurus-plugin-content-docs/current/basics`,
      relativePath
    );
  } else if (inputPath.startsWith(blogDir)) {
    relativePath = path.relative(blogDir, inputPath);
    outputPath = path.join(
      websiteRoot,
      `i18n/${config.targetLang}/docusaurus-plugin-content-blog/current`,
      relativePath
    );
  } else if (inputPath.startsWith(versionedDir)) {
    // versioned_docs: versioned_docs/version-X.Y.Z/subdir/file.md
    // Output: i18n/{locale}/docusaurus-plugin-content-docs/{version}/{subdir}/file.md
    const versionedRelative = path.relative(versionedDir, inputPath);
    relativePath = `versioned_docs/${versionedRelative}`;
    outputPath = path.join(
      websiteRoot,
      `i18n/${config.targetLang}/docusaurus-plugin-content-docs`,
      versionedRelative
    );
  } else {
    // Fallback: use basename only
    relativePath = path.basename(inputPath);
    outputPath = path.join(
      websiteRoot,
      `i18n/${config.targetLang}/docusaurus-plugin-content-docs/current`,
      relativePath
    );
  }

  console.log(`\n========================================`);
  console.log(`  Test Mode: Single File`);
  console.log(`========================================`);
  console.log(`  Provider: ${config.provider}`);
  console.log(`  Model: ${config.model}`);
  console.log(`  Target: ${config.targetLang}`);
  console.log(`  Input: ${inputPath}`);
  console.log(`  Output: ${outputPath}`);
  console.log(`========================================\n`);

  const chunkSem = new Semaphore(config.chunkConcurrency);
  const result = await translateFile(inputPath, outputPath, relativePath, chunkSem);

  console.log(`\n========================================`);
  console.log(`  Result: ${result.status}`);
  if (result.error) {
    console.log(`  Error: ${result.error}`);
  }
  console.log(`========================================\n`);

  return result;
}

/**
 * Main translation process with parallel file processing
 */
async function main() {
  // Test mode: single file
  if (config.testFile) {
    const result = await testSingleFile();
    if (result.status === 'failed') {
      process.exit(1);
    }
    return;
  }

  console.log(`\n========================================`);
  console.log(`  AI Documentation Translator`);
  console.log(`========================================`);
  console.log(`  Provider: ${config.provider}`);
  console.log(`  Model: ${config.model}`);
  console.log(`  Target: ${config.targetLang} (${targetLangName})`);
  console.log(`  Force: ${config.forceRetranslate}`);
  console.log(`  Concurrency: ${config.concurrency} files, ${config.chunkConcurrency} chunks`);
  console.log(`========================================\n`);

  const websiteRoot = path.join(__dirname, '..');
  const docsDir = path.join(websiteRoot, 'docs');
  const blogDir = path.join(websiteRoot, 'blog');

  // Target directories - non-versioned docs need 'current' subdirectory
  const targetBase = path.join(websiteRoot, `i18n/${config.targetLang}`);
  const docsTarget = path.join(targetBase, 'docusaurus-plugin-content-docs/current');
  const blogTarget = path.join(targetBase, 'docusaurus-plugin-content-blog/current');

  // Ensure target directories exist
  fs.mkdirSync(docsTarget, { recursive: true });
  fs.mkdirSync(blogTarget, { recursive: true });

  // Semaphores for concurrency control
  const fileSem = new Semaphore(config.concurrency);
  const chunkSem = new Semaphore(config.chunkConcurrency);

  const stats = {
    total: 0,
    success: 0,
    skipped: 0,
    failed: 0,
    failedFiles: [],
    completed: 0,
  };

  const logProgress = () => {
    process.stdout.write(`\r  Progress: ${stats.completed}/${stats.total} (✅${stats.success} ⏭️${stats.skipped} ❌${stats.failed})    `);
  };

  // Parse TRANSLATE_FILES if provided (comma-separated file list)
  let filesToTranslate = null;
  if (config.translateFiles) {
    filesToTranslate = new Set(
      config.translateFiles.split(',').map(f => f.trim()).filter(f => f)
    );
  }

  // Collect all files first
  console.log(`\n📚 Collecting files...`);

  // Filter function based on filesToTranslate
  const filterFiles = (files) => {
    if (!filesToTranslate) return files;
    return files.filter(({ relativePath }) => filesToTranslate.has(relativePath));
  };

  const docFiles = filterFiles(findMarkdownFiles(docsDir));
  const blogFiles = filterFiles(findMarkdownFiles(blogDir));

  stats.total = docFiles.length + blogFiles.length;

  // Versioned docs - SKIP translation (not needed per user request)
  // if (fs.existsSync(versionedDir)) {
  //   const versionedEntries = fs.readdirSync(versionedDir, { withFileTypes: true });
  //   for (const entry of versionedEntries) {
  //     if (entry.isDirectory()) {
  //       const versionDir = path.join(versionedDir, entry.name);
  //       const versionTarget = path.join(targetBase, 'docusaurus-plugin-content-docs', entry.name);
  //       fs.mkdirSync(versionTarget, { recursive: true });
  //       const files = filterFiles(findMarkdownFiles(versionDir));
  //       stats.total += files.length;
  //       if (files.length > 0) {
  //         versionedTasks.push({ entry, files, versionTarget });
  //       }
  //     }
  //   }
  // }

  console.log(`  Found ${docFiles.length} doc files, ${blogFiles.length} blog files`);
  console.log(`  Total: ${stats.total} files\n`);
  console.log(`⏳ Starting translation...\n`);

  // Process docs in parallel
  console.log(`📚 Translating documentation (docs/)...`);
  const docPromises = docFiles.map(({ fullPath, relativePath }) => {
    const outputPath = path.join(docsTarget, relativePath);
    return fileSem.acquire().then(() =>
      translateFile(fullPath, outputPath, `docs/${relativePath}`, chunkSem)
        .finally(() => fileSem.release())
    );
  });

  // Process blog in parallel
  console.log(`📝 Translating blog (blog/)...`);
  const blogPromises = blogFiles.map(({ fullPath, relativePath }) => {
    const outputPath = path.join(blogTarget, relativePath);
    return fileSem.acquire().then(() =>
      translateFile(fullPath, outputPath, `blog/${relativePath}`, chunkSem)
        .finally(() => fileSem.release())
    );
  });

  // Helper to track progress
  const trackProgress = (promise) => {
    return promise.then((result) => {
      stats.completed++;
      if (result.status === 'success') {
        stats.success++;
        console.log(`  ✅ ${result.path}`);
      } else if (result.status === 'skipped') {
        stats.skipped++;
        console.log(`  ⏭️  ${result.path} (skipped)`);
      } else {
        stats.failed++;
        stats.failedFiles.push(result.path);
        console.log(`  ❌ ${result.path} (${result.error})`);
      }
      logProgress();
      return result;
    });
  };

  // Wait for all to complete with progress tracking
  console.log(`📚 Translating docs/ (${docFiles.length} files)...`);
  await Promise.all(docPromises.map(trackProgress));
  await Promise.all(blogPromises.map(trackProgress));

  // Print summary
  console.log(`\n\n========================================`);
  console.log(`  Translation Summary`);
  console.log(`========================================`);
  console.log(`  Total files: ${stats.total}`);
  console.log(`  ✅ Success:  ${stats.success}`);
  console.log(`  ⏭️  Skipped:  ${stats.skipped}`);
  console.log(`  ❌ Failed:   ${stats.failed}`);

  if (stats.failedFiles.length > 0) {
    console.log(`\n  Failed files:`);
    for (const file of stats.failedFiles) {
      console.log(`    - ${file}`);
    }
  }

  console.log(`\n  Output directory: ${targetBase}`);
  console.log(`========================================\n`);

  // Exit with error code if any files failed
  if (stats.failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
