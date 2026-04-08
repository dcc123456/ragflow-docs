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
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration from environment variables
const config = {
  provider: process.env.AI_PROVIDER || 'anthropic',
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL || 'claude-sonnet-4-20250514',
  endpoint: process.env.AI_ENDPOINT || null,
  targetLang: process.env.TARGET_LANG || 'zh-Hans',
  forceRetranslate: process.env.FORCE_RETRANSLATE === 'true',
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
 * Split text into chunks that fit within token limits
 */
function splitIntoChunks(text, maxChars = 4000) {
  const chunks = [];
  const lines = text.split('\n');
  let currentChunk = '';
  let currentSize = 0;

  for (const line of lines) {
    const lineSize = line.length + 1;
    if (currentSize + lineSize > maxChars && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
      currentSize = 0;
    }
    currentChunk += line + '\n';
    currentSize += lineSize;
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Translate a single file
 */
async function translateFile(inputPath, outputPath, relativePath) {
  const content = fs.readFileSync(inputPath, 'utf-8');

  // Check if file already exists and skip if not forcing
  if (fs.existsSync(outputPath) && !config.forceRetranslate) {
    console.log(`  Skipping (already exists): ${relativePath}`);
    return { status: 'skipped', path: relativePath };
  }

  console.log(`  Translating: ${relativePath}`);

  const provider = providers[config.provider];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${config.provider}. Supported: ${Object.keys(providers).join(', ')}`);
  }

  try {
    const chunks = splitIntoChunks(content, 4000);
    const translatedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      console.log(`    Chunk ${i + 1}/${chunks.length}...`);
      const translated = await provider.translate(chunks[i]);
      translatedChunks.push(translated);
    }

    const result = translatedChunks.join('\n\n');

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result, 'utf-8');

    console.log(`    → Translated: ${outputPath}`);
    return { status: 'success', path: relativePath };
  } catch (error) {
    console.error(`    → Error: ${error.message}`);
    return { status: 'failed', path: relativePath, error: error.message };
  }
}

/**
 * Main translation process
 */
async function main() {
  console.log(`\n========================================`);
  console.log(`  AI Documentation Translator`);
  console.log(`========================================`);
  console.log(`  Provider: ${config.provider}`);
  console.log(`  Model: ${config.model}`);
  console.log(`  Target: ${config.targetLang} (${targetLangName})`);
  console.log(`  Force: ${config.forceRetranslate}`);
  console.log(`========================================\n`);

  const websiteRoot = path.join(__dirname, '..');
  const docsDir = path.join(websiteRoot, 'docs');
  const blogDir = path.join(websiteRoot, 'blog');
  const versionedDir = path.join(websiteRoot, 'versioned_docs');

  // Target directories
  const targetBase = path.join(websiteRoot, `i18n/${config.targetLang}`);
  const docsTarget = path.join(targetBase, 'docusaurus-plugin-content-docs');
  const blogTarget = path.join(targetBase, 'docusaurus-plugin-content-blog');

  // Ensure target directories exist
  fs.mkdirSync(docsTarget, { recursive: true });
  fs.mkdirSync(blogTarget, { recursive: true });

  const stats = {
    total: 0,
    success: 0,
    skipped: 0,
    failed: 0,
    failedFiles: [],
  };

  // Translate docs/
  console.log(`\n📚 Translating documentation (docs/)...`);
  const docFiles = findMarkdownFiles(docsDir);
  stats.total += docFiles.length;

  for (const { fullPath, relativePath } of docFiles) {
    const outputPath = path.join(docsTarget, relativePath);
    const result = await translateFile(fullPath, outputPath, `docs/${relativePath}`);
    if (result.status === 'success') stats.success++;
    else if (result.status === 'skipped') stats.skipped++;
    else {
      stats.failed++;
      stats.failedFiles.push(result.path);
    }
  }

  // Translate blog/
  console.log(`\n📝 Translating blog (blog/)...`);
  const blogFiles = findMarkdownFiles(blogDir);
  stats.total += blogFiles.length;

  for (const { fullPath, relativePath } of blogFiles) {
    const outputPath = path.join(blogTarget, relativePath);
    const result = await translateFile(fullPath, outputPath, `blog/${relativePath}`);
    if (result.status === 'success') stats.success++;
    else if (result.status === 'skipped') stats.skipped++;
    else {
      stats.failed++;
      stats.failedFiles.push(result.path);
    }
  }

  // Translate versioned_docs/
  if (fs.existsSync(versionedDir)) {
    console.log(`\n📚 Translating versioned documentation...`);
    const versionedEntries = fs.readdirSync(versionedDir, { withFileTypes: true });

    for (const entry of versionedEntries) {
      if (entry.isDirectory()) {
        const versionDir = path.join(versionedDir, entry.name);
        const versionTarget = path.join(docsTarget, entry.name);
        fs.mkdirSync(versionTarget, { recursive: true });

        const files = findMarkdownFiles(versionDir);
        stats.total += files.length;

        console.log(`  Version: ${entry.name}`);
        for (const { fullPath, relativePath } of files) {
          const outputPath = path.join(versionTarget, relativePath);
          const result = await translateFile(fullPath, outputPath, `versioned_docs/${entry.name}/${relativePath}`);
          if (result.status === 'success') stats.success++;
          else if (result.status === 'skipped') stats.skipped++;
          else {
            stats.failed++;
            stats.failedFiles.push(result.path);
          }
        }
      }
    }
  }

  // Print summary
  console.log(`\n========================================`);
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
