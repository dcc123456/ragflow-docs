---
sidebar_position: 1
slug: /release_notes
sidebar_custom_props: {
  sidebarIcon: LucideClipboardPenLine
}

---

# 发布说明

最新版本的主要功能、改进和错误修复。

## v0.24.0

发布于2026年2月10日。

### 新功能

- 新增新模型的连接测试功能。

### MySQL替代方案

- 支持OceanBase作为MySQL的替代方案。

### 模型支持

- Kimi 2.5
- Stepfun 3
- doubao-embedding-vision
- PaddleOCR-VL

### 数据源

- Zendesk
- Bitbucket

### API变更

#### HTTP API

[内存管理API](./references/http_api_reference.md#memory-management)

#### Python API

[内存管理API](./references/python_api_reference.md#memory-management)

## v0.23.1

发布于2025年12月31日。

### 改进

- 内存：当所有内存类型都被选中时，增强了内存提取的稳定性。
- RAG：优化了图像和表格的上下文窗口提取策略。

### 已修复问题

- RAG：MDX文件解析之前不受支持。

### 数据源

- GitHub
- Gitlab
- Asana
- IMAP

## v0.23.0

发布于2025年12月27日。

### 新功能

- 聊天：支持语音输入。

### 改进

- RAG：显著加速了GraphRAG生成。
- 升级了RAGFlow的文档引擎 [Infinity](https://github.com/infiniflow/infinity) 至v0.6.15版本（向后兼容）。

### 数据源

- Google Cloud Storage
- Gmail
- Dropbox
- WebDAV
- Airtable

### 模型支持

- GPT-5.2
- GPT-5.2 Pro
- GPT-5.1
- GPT-5.1 Instant
- Claude Opus 4.5
- MiniMax M2
- GLM-4.7
- MinerU配置界面
- AI Badgr（模型提供商）

### API变更

#### HTTP API

- [与Agent对话](./references/http_api_reference.md#converse-with-agent) 返回完整的执行跟踪日志。
- [创建聊天补全](./references/http_api_reference.md#create-chat-completion) 支持基于元数据的过滤。
- [与聊天助手对话](./references/http_api_reference.md#converse-with-chat-assistant) 支持基于元数据的过滤。

## v0.22.1

发布于2025年11月19日。

### 改进

- 继续重新设计**个人资料**页面布局。
- 将FlaskWeb框架从同步升级为异步，提高了并发性，并防止了请求上游LLM服务时造成的阻塞问题。

### 已修复问题

- v0.22.0问题：用户无法解析已上传文件或在使用来自`-full`版RAGFlow的内置模型的数据集中切换嵌入模型。
- Word文档中连接的图像。 [#11310](https://github.com/infiniflow/ragflow/pull/11310)
- 混合图像和文本在聊天历史中无法正确显示。

### 新支持模型

- Gemini 3 Pro Preview

## v0.22.0

发布于2025年11月12日。

### 重大变更

:::danger 重要提示
从本版本起，我们仅提供精简版（不含嵌入模型）的Docker镜像，不再在镜像标签后添加`-slim`后缀。
:::

### 新功能

- 支持结构化输出。
- **检索**组件支持元数据过滤。
- 引入了**变量聚合器**组件，具有数据操作和会话变量定义功能。

### 改进

- Agent：在**等待响应**组件中支持可视化之前组件的输出。
- 重新设计了模型提供商页面。
- 升级RAGFlow的文档引擎Infinity至v0.6.5版本。

### 新增模型

- Kimi-K2-Thinking

### 新代理模板

- 交互式代理，整合实时用户反馈以动态优化代理输出。

## v0.21.1

发布于2025年10月23日。

### 新功能

- 实验性功能：新增使用MinerU解析PDF文档的支持。参见[此处](./faq.mdx#how-to-use-mineru-to-parse-pdf-documents)。

### 改进

- 增强数据集和个人中心页面的 UI/UX。
- 将 RAGFlow 的文档引擎 [Infinity](https://github.com/infiniflow/infinity) 升级到 v0.6.1。

### 修复的问题

- 视频解析问题。

## v0.21.0

发布时间：2025 年 10 月 15 日。

### 新增功能

- 可编排的 ingestion 管道：支持自定义数据 ingestion 和清洗工作流，允许用户灵活设计数据流，或直接在画布上应用官方数据流模板。
- GraphRAG 和 RAPTOR 写入流程优化：用手动批量构建替代自动增量构建，显著降低构建开销。
- 长上下文 RAG：自动生成文档级目录（TOC）结构，以减轻因分块不准确或过度分块导致的上下文丢失，大幅提升检索质量。此功能现可通过 TOC 提取模板获取。参见[此处](./guides/dataset/advanced/extract_table_of_contents.md)。
- 视频文件解析：通过支持视频文件解析，扩展系统的多模态数据处理能力。
- Admin CLI：引入新的命令行工具用于系统管理，允许用户通过命令行管理和监控 RAGFlow 的服务状态。

### 改进

- 重新设计 RAGFlow 的登录和注册页面。
- 将 RAGFlow 的文档引擎 Infinity 升级到 v0.6.0。

### 新增支持的模型

- 通义千问 3 系列
- Claude Sonnet 4.5
- 美团 LongCat-Flash-Thinking

### 新增 Agent 模板

- 公司研究报告深度分析 Agent：为金融机构设计，帮助分析师快速整理信息、生成研究报告并做出投资决策。
- 可编排的 Ingestion 管道模板：允许用户在画布上应用此模板，快速建立标准化的数据 ingestion 和清洗流程。

## v0.20.5

发布时间：2025 年 9 月 10 日。

### 改进

- 聊天：重新启用 **推理** 和 **跨语言搜索**。

### 新增支持的模型

- 美团 LongCat
- Kimi：kimi-k2-turbo-preview 和 kimi-k2-0905-preview
- Qwen：qwen3-max-preview
- SiliconFlow：DeepSeek V3.1

### 修复的问题

- **引用**开关失败问题。
- Agent 在任务模式下仍需对话触发的问题。
- 多轮对话中重复回答的问题。
- 并行执行结果重复总结的问题。

### API 变更

#### HTTP API

- 向[检索切片](./references/http_api_reference.md#retrieve-chunks)方法添加 body 参数 `"metadata_condition"`，支持在检索时基于元数据进行切片过滤。[#9877](https://github.com/infiniflow/ragflow/pull/9877)

#### Python API

- 向[检索切片](./references/python_api_reference.md#retrieve-chunks)方法添加参数 `metadata_condition`，支持在检索时基于元数据进行切片过滤。[#9877](https://github.com/infiniflow/ragflow/pull/9877)

## v0.20.4

发布时间：2025 年 8 月 27 日。

### 改进

- 改进 Markdown 文件解析，支持 AST 以避免意外分块。
- 增强 HTML 解析，支持基于 bs4 的 HTML 标签遍历。

### 新增支持的模型

- 智谱 GLM-4.5

### 新增 Agent 模板

电商客服工作流：用于处理产品功能咨询和多产品比较的模板，同时管理安装预约预订。

### 修复的问题

- OAuth2 认证失败问题。
- 数据集中多条件元数据搜索的逻辑错误问题。
- 多轮对话中引用无限增加的问题。

## v0.20.3

发布时间：2025 年 8 月 20 日。

### 改进

- 文档：修正 API 参考中的不准确之处。

### 新增 Agent 模板

- Report Agent：用于在内部问答场景中生成总结报告的模板，支持展示表格和公式。[#9427](https://github.com/infiniflow/ragflow/pull/9427)

### 修复问题

- v0.20.0 中引入的超时机制导致 GraphRAG 等任务停止运行。
- **Agent** 组件在对话中缺少预定义的开场白。
- 提示词编辑器中的自动换行问题。
- PyPDF 导致的内存泄漏问题。[#9469](https://github.com/infiniflow/ragflow/pull/9469)

### API 变更

#### 已废弃

[创建 Agent 会话](./references/http_api_reference.md#create-session-with-agent)

## v0.20.1

发布日期：2025年8月8日。

### 新功能

- **检索** 组件现在支持使用变量动态指定数据集名称。
- 用户界面新增法语语言选项。

### 新增支持的模型

- GPT-5
- Claude 4.1

### 新增 Agent 模板（工作流和 Agent 类型）

- 文本转SQL数据专家工作流：赋能非技术团队（如运营、产品）独立查询业务数据。
- 选择知识库工作流：允许用户在对话中选择要查询的数据集。[#9325](https://github.com/infiniflow/ragflow/pull/9325)
- 选择知识库 Agent：通过延长推理时间提供更高质量的回复，适用于复杂问题。[#9325](https://github.com/infiniflow/ragflow/pull/9325)

### 修复问题

- **Agent** 组件无法调用通过 vLLM 安装的模型。
- Agent 无法与团队成员共享。
- 将 Agent 嵌入网页功能无法正常工作。

## v0.20.0

发布日期：2025年8月4日。

### 兼容性变更

从 v0.20.0 起，Agent 与早期版本不再兼容，升级后所有来自之前版本的 Agent 必须重建。

### 新功能

- 统一编排 Agent 和工作流。
- 对 Agent 进行全面重构，极大增强了其功能和可用性，支持多 Agent 配置、规划与反思，以及可视化功能。
- 全面实现 MCP 功能，支持 MCP 服务器导入、Agent 作为 MCP 客户端运行，以及 RAGFlow 本身作为 MCP 服务器运行。
- 支持查看 Agent 的运行时日志。
- 通过管理面板查看与 Agent 的对话历史。
- 集成新版更强壮的 Infinity，支持以 Infinity 为底层文档引擎的自动标注功能。
- OpenAI 兼容 API 支持文件引用信息。
- 支持新模型，包括 Kimi K2、Grok 4 和 Voyage 嵌入。
- RAGFlow 代码库现已在 Gitee 镜像。
- 引入新模型提供商 Gitee AI。

### 新增 Agent 模板

- 基于多 Agent 的深度研究：由领导 Agent 带领多个子 Agent 进行协作式 Agent 团队工作，区别于传统工作流编排。
- 智能问答机器人：利用内部数据集进行智能问答，适用于客服和培训场景。
- 简历分析模板：RAGFlow 团队用于筛选、分析和记录候选人信息的模板。
- 博客生成工作流：将原始想法转化为符合 SEO 要求的博客内容。
- 智能客服工作流。
- 用户反馈分析模板：通过语义分析将用户反馈定向到相应团队。
- 行程规划器：使用网页搜索和地图 MCP 服务器协助规划行程。
- 图片文字翻译：翻译上传图片中的内容。
- 信息搜索助手：从内部数据集和网络中检索答案。

- 高并发请求期间的内存泄漏问题。
- 启用GraphRAG实体解析时，大文件解析会冻结。[#8223](https://github.com/infiniflow/ragflow/pull/8223)
- 在独立模式下使用Sandbox时出现上下文错误。[#8340](https://github.com/infiniflow/ragflow/pull/8340)
- Ollama导致的CPU使用率过高问题。[#8216](https://github.com/infiniflow/ragflow/pull/8216)
- Code组件中的一个缺陷。[#7949](https://github.com/infiniflow/ragflow/pull/7949)
- 新增支持通过Ollama或VLLM安装的模型，可在通过API创建数据集时使用。[#8069](https://github.com/infiniflow/ragflow/pull/8069)
- 启用基于角色的S3存储桶访问认证。[#8149](https://github.com/infiniflow/ragflow/pull/8149)

### 新增支持模型

- Qwen 3 Embedding。[#8184](https://github.com/infiniflow/ragflow/pull/8184)
- Voyage Multimodal 3。[#7987](https://github.com/infiniflow/ragflow/pull/7987)

## v0.19.0

发布于2025年5月26日。

### 新功能

- [跨语言搜索](./references/glossary.mdx#cross-language-search)现已在知识库和聊天模块中得到支持，提升了多语言环境（如中英文数据集）中的搜索精度和用户体验。
- Agent组件：新型代码组件支持Python和JavaScript脚本，使开发者能够处理更复杂的任务，如动态数据处理。
- 增强的图片显示：聊天和搜索中的图片现在可以直接在响应中渲染，无需作为外部引用。知识检索测试可直接获取图片，而非从图片中提取的文本。
- Claude 4和ChatGPT o3：开发者现在可以使用最新发布的最先进Claude模型和OpenAI最新的ChatGPT o3推理模型。

> 以下功能由社区贡献：

- Agent组件：支持在生成组件中调用工具。感谢[notsyncing](https://github.com/notsyncing)。
- Markdown渲染：markdown文件中的图片引用在分块后可以显示。感谢[Woody-Hu](https://github.com/Woody-Hu)。
- 文档引擎支持：OpenSearch现在可用作RAGFlow的文档引擎。感谢[pyyuhao](https://github.com/pyyuhao)。

### 文档

#### 新增文档

- [选择PDF解析器](./guides/dataset/select_pdf_parser.md)
- [启用Excel2HTML](./guides/dataset/enable_excel2html.md)
- [Code组件](./guides/agent/agent_component_reference/code.mdx)

## v0.18.0

发布于2025年4月23日。

### 兼容性变更

从此版本开始，内置重排序模型已被移除，因为它们对检索率的影响微乎其微，但会显著增加检索时间。

### 新功能

- MCP服务器：支持通过MCP访问RAGFlow的数据集。
- DeepDoc支持在文档布局识别期间采用VLM模型作为处理流程，实现对PDF和DOCX文件中图片的深度分析。
- OpenAI兼容API：代理可通过OpenAI兼容API调用。
- 用户注册控制：管理员可通过环境变量启用或禁用用户注册。
- 团队协作：代理可与团队成员共享。
- 代理版本控制：所有更新都会被持续记录，并可通过导出回滚到之前的版本。

![export_agent](https://raw.githubusercontent.com/infiniflow/ragflow-docs/main/images/export_agent_as_json.jpg)

### 改进

- 增强的答案引用：提高生成的响应中引用的准确性。
- 增强的问答体验：用户现在可以在对话中手动停止流式输出。

### 文档

#### 新增文档

- [设置页面排名](./guides/dataset/set_page_rank.md)
- [启用 RAPTOR](./guides/dataset/advanced/enable_raptor.md)
- [设置聊天助手变量](./guides/chat/set_chat_variables.md)
- [启动 RAGFlow MCP 服务器](./develop/mcp/launch_mcp_server.md)

## v0.17.2

发布于 2025 年 3 月 13 日。

### 兼容性变更

- 移除**聊天配置**中的 **Max_tokens** 设置。
- 移除**生成**、**重写**、**分类**、**关键词**代理组件中的 **Max_tokens** 设置。

自此版本起，如果您仍发现 RAGFlow 的响应被截断，请检查模型提供商的 **Max_tokens** 设置。

### 改进

- 添加 OpenAI 兼容 API。
- 引入德语用户界面。
- 加速知识图谱提取。
- 在**检索**代理组件中启用基于 Tavily 的网络搜索。
- 添加通义千问 QwQ 模型（OpenAI 兼容）。
- 在**通用**分块方法中支持 CSV 文件。

### 修复问题

- 无法通过 Ollama/Xinference 添加模型，这是 v0.17.1 中引入的问题。

### API 变更

#### HTTP API

- [创建聊天补全](./references/http_api_reference.md#openai-compatible-api)

#### Python API

- [创建聊天补全](./references/python_api_reference.md#openai-compatible-api)

## v0.17.1

发布于 2025 年 3 月 11 日。

### 改进

- 提高英语分词质量。
- 改进 Markdown 文档解析中的表格提取逻辑。
- 更新 SiliconFlow 的模型列表。
- 支持解析 XLS 文件（Excel 97-2003），并改进相应的错误处理。
- 支持 Huggingface 重排序模型。
- 在聊天助手和**重写**代理组件中启用相对时间表达式（"now"、"yesterday"、"last week"、"next year" 等）。

### 修复问题

- 知识图谱提取重复问题。
- API 调用问题。
- **PDF 解析器**（也称为**文档解析器**）下拉菜单中的选项缺失。
- Tavily 网络搜索问题。
- 无法在 AI 聊天中预览图表或图片。

### 文档

#### 新增文档

- [使用标签集](./guides/dataset/use_tag_sets.md)

## v0.17.0

发布于 2025 年 3 月 3 日。

### 新功能

- AI 聊天：实现 Deep research（深度研究）以支持代理推理。激活方法：在聊天助手对话框的**提示引擎**选项卡下启用**推理**开关。
- AI 聊天：利用基于 Tavily 的网络搜索增强代理推理的上下文。激活方法：在聊天助手对话框的**助手设置**选项卡下输入正确的 Tavily API 密钥。
- AI 聊天：支持在未指定知识库的情况下开始聊天。
- AI 聊天：除了 PDF 文件外，HTML 文件也可以预览和引用。
- 数据集：添加**PDF 解析器**（也称为**文档解析器**）下拉菜单到数据集配置中。其中包含 DeepDoc 模型选项（耗时较长）、一个快得多的**naive** 选项（纯文本，跳过 DLA（文档布局分析）、OCR（光学字符识别）和 TSR（表格结构识别）任务），以及几个目前处于*实验阶段*的大模型选项。请参阅[此处](./guides/dataset/select_pdf_parser.md)。
- 代理组件：**(x)** 或正斜杠 `/` 可用于在**生成**或**模板**组件的系统提示字段中插入可用密钥（变量）。
- 对象存储：支持使用阿里云 OSS（对象存储服务）作为文件存储选项。
- 模型：更新通义千问（Qwen）的支持模型列表，添加 DeepSeek 特定模型；添加 ModelScope 作为模型提供商。
- API：可通过 API 更新文档元数据。

下图展示了 RAGFlow Deep research 的工作流程：

![图片](https://github.com/user-attachments/assets/f65d4759-4f09-4d9d-9549-c0e1fe907525)

以下是集成 Deep research 的对话截图：

![图片](https://github.com/user-attachments/assets/165b88ff-1f5d-4fb8-90e2-c836b25e32e9)

### API 变更

#### HTTP API

在 [更新文档](./references/http_api_reference.md#update-document) 方法中添加了 `"meta_fields"` body 参数。

#### Python API

在 [更新文档](./references/python_api_reference.md#update-document) 方法中添加了 `"meta_fields"` key 选项。

### 文档

#### 新增文档

- [运行检索测试](./guides/dataset/run_retrieval_test.md)

## v0.16.0

发布于 2025 年 2 月 6 日。

### 新功能

- 支持 DeepSeek R1 和 DeepSeek V3。
- GraphRAG 重构：知识图谱基于整个数据集动态构建，而非基于单个文件，并在新上传的文件开始解析时自动更新。参见[此处](./guides/dataset/advanced/construct_knowledge_graph.md)。
- 新增 **Iteration** 代理组件和 **Research report generator** 代理模板。参见[此处](./guides/agent/agent_component_reference/iteration.mdx)。
- 新增 UI 语言：葡萄牙语。
- 允许为数据集中的特定文件设置元数据，以增强 AI 聊天功能。参见[此处](./guides/dataset/set_metadata.md)。
- 将 RAGFlow 的文档引擎 [Infinity](https://github.com/infiniflow/infinity) 升级至 v0.6.0.dev3。
- 支持 DeepDoc 的 GPU 加速（参见 [docker-compose-gpu.yml](https://github.com/infiniflow/ragflow/blob/main/docker/docker-compose-gpu.yml)）。
- 支持创建和引用 **Tag** 数据集，作为弥合查询与响应之间语义差距的关键里程碑。

:::danger 重要提示
**Tag 数据集**功能在 [Infinity](https://github.com/infiniflow/infinity) 文档引擎上*不可用*。
:::

### 文档

#### 新增文档

- [构建知识图谱](./guides/dataset/advanced/construct_knowledge_graph.md)
- [设置元数据](./guides/dataset/set_metadata.md)
- [Begin 组件](./guides/agent/agent_component_reference/begin.mdx)
- [Generate 组件](./guides/agent/agent_component_reference/generate.mdx)
- [Interact 组件](./guides/agent/agent_component_reference/interact.mdx)
- [Retrieval 组件](./guides/agent/agent_component_reference/retrieval.mdx)
- [Categorize 组件](./guides/agent/agent_component_reference/categorize.mdx)
- [Keyword 组件](./guides/agent/agent_component_reference/keyword.mdx)
- [Message 组件](./guides/agent/agent_component_reference/message.mdx)
- [Rewrite 组件](./guides/agent/agent_component_reference/rewrite.mdx)
- [Switch 组件](./guides/agent/agent_component_reference/switch.mdx)
- [Concentrator 组件](./guides/agent/agent_component_reference/concentrator.mdx)
- [Template 组件](./guides/agent/agent_component_reference/template.mdx)
- [Iteration 组件](./guides/agent/agent_component_reference/iteration.mdx)
- [Note 组件](./guides/agent/agent_component_reference/note.mdx)

## v0.15.1

发布于 2024 年 12 月 25 日。

### 升级

- 将 RAGFlow 的文档引擎 [Infinity](https://github.com/infiniflow/infinity) 升级至 v0.5.2。
- 增强了文档解析状态的日志显示。

### 修复的问题

此版本修复了以下问题：

- [Infinity](https://github.com/infiniflow/infinity) 返回的 `SCORE not found` 和 `position_int` 错误。
- 更改特定数据集中的 embedding 模型后，其他数据集中的 embedding 模型将无法再更改。
- 由于 embedding 模型重复加载，导致问答和 AI 搜索响应缓慢。
- 无法使用 RAPTOR 解析文档。
- 使用 **Table** 解析方法导致信息丢失。
- 其他 API 问题。

### API 变更

#### HTTP API

在以下 API 中添加了可选参数 `"user_id"`：

- [创建与聊天助手会话](https://ragflow.io/docs/dev/http_api_reference#create-session-with-chat-assistant)
- [更新聊天助手的会话](https://ragflow.io/docs/dev/http_api_reference#update-chat-assistants-session)
- [列出聊天助手的会话](https://ragflow.io/docs/dev/http_api_reference#list-chat-assistants-sessions)
- [创建与智能体会话](https://ragflow.io/docs/dev/http_api_reference#create-session-with-agent)
- [与聊天助手对话](https://ragflow.io/docs/dev/http_api_reference#converse-with-chat-assistant)
- [与智能体对话](https://ragflow.io/docs/dev/http_api_reference#converse-with-agent)
- [列出智能体会话](https://ragflow.io/docs/dev/http_api_reference#list-agent-sessions)

## v0.15.0

发布于 2024年12月18日。

### 新增功能

- 新增更多智能体专用的 API。
- 支持使用页面排名分数来提升跨多数据集搜索时的检索性能。
- 在聊天和智能体中提供 iframe，便于将 RAGFlow 集成到您的网页中。
- 新增用于在 Kubernetes 上部署 RAGFlow 的 Helm chart。
- 支持以 JSON 格式导入或导出智能体。
- 支持智能体组件/工具的步骤运行。
- 新增一种 UI 语言：日语。
- 支持从失败处恢复 GraphRAG 和 RAPTOR，提升任务管理的稳定性。
- 新增更多 Mistral 模型。
- 新增 UI 深色模式，允许用户在浅色和深色主题之间切换。

### 改进

- 升级了 DeepDoc 中的文档布局分析模型。
- 大幅提升了使用 [Infinity](https://github.com/infiniflow/infinity) 作为文档引擎时的检索性能。

### API 变更

#### HTTP API

- [列出智能体会话](https://ragflow.io/docs/dev/http_api_reference#list-agent-sessions)
- [列出智能体](https://ragflow.io/docs/dev/http_api_reference#list-agents)

#### Python API

- [列出智能体会话](https://ragflow.io/docs/dev/python_api_reference#list-agent-sessions)
- [列出智能体](https://ragflow.io/docs/dev/python_api_reference#list-agents)

## v0.14.1

发布于 2024年11月29日。

### 改进

新增 [Infinity 的配置文件](https://github.com/infiniflow/ragflow/blob/main/docker/infinity_conf.toml)，以便集成和自定义 [Infinity](https://github.com/infiniflow/infinity) 作为文档引擎。从本版本起，对 Infinity 配置的更新可直接在 RAGFlow 中进行，并将在使用 `docker compose` 重启 RAGFlow 后立即生效。[#3715](https://github.com/infiniflow/ragflow/pull/3715)

### 修复问题

本版本修复了以下问题：
- 点击后无法显示或编辑块的内容。
- Elasticsearch 中出现 'Not found' 错误。
- 解析时中文文本出现乱码。
- 与 Polars 的兼容性问题。
- Infinity 与 GraphRAG 之间的兼容性问题。

## v0.14.0

发布于 2024年11月26日。

### 新增功能

- 支持使用 [Infinity](https://github.com/infiniflow/infinity) 或 Elasticsearch（默认）作为文档引擎进行向量存储和全文索引。[#2894](https://github.com/infiniflow/ragflow/pull/2894)
- 通过为智能体添加更多变量并实现自动保存来提升用户体验。
- 新增三步翻译智能体模板，灵感来自 [Andrew Ng 的翻译智能体](https://github.com/andrewyng/translation-agent)。
- 新增 SEO 优化的博客写作智能体模板。
- 提供用于与智能体对话的 HTTP 和 Python API。
- 支持在检索过程中使用英文同义词。
- 优化词项权重计算，将检索时间缩短 50%。
- 改进任务执行器监控，新增更多性能指标。
- 用 Valkey 替换 Redis。
- 新增三种 UI 语言（*由社区贡献*）：印尼语、西班牙语和越南语。

### 兼容性变更

从本版本起，**service_config.yaml.template** 将取代 **service_config.yaml** 用于配置后端服务。Docker 容器启动时，该模板文件中定义的环境变量将自动填充，并从中自动生成 **service_config.yaml**。[#3341](https://github.com/infiniflow/ragflow/pull/3341)

此方法消除了在更改 **.env** 后手动更新 **service_config.yaml** 的需求，便于动态配置环境。

:::danger 重要提示
在尝试此新方法之前，请确保您已[将**代码**和**Docker镜像**都升级到本版本](./administrator/upgrade_ragflow.mdx#upgrade-ragflow-to-the-most-recent-officially-published-release)。
:::

### API 变更

#### HTTP API

- [创建 Agent 会话](https://ragflow.io/docs/dev/http_api_reference#create-session-with-agent)
- [与 Agent 对话](https://ragflow.io/docs/dev/http_api_reference#converse-with-agent)

#### Python API

- [创建 Agent 会话](https://ragflow.io/docs/dev/python_api_reference#create-session-with-agent)
- [与 Agent 对话](https://ragflow.io/docs/dev/python_api_reference#converse-with-agent)

### 文档

#### 新增文档

- [配置说明](https://ragflow.io/docs/dev/configurations)
- [管理团队成员](./guides/team/manage_team_members.md)
- [对 RAGFlow 依赖项运行健康检查](https://ragflow.io/docs/dev/run_health_check)

## v0.13.0

发布于 2024 年 10 月 31 日。

### 新增功能

- 为所有用户添加团队管理功能。
- 更新 Agent UI 以提升可用性。
- 在 **General** 分块方法中添加 Markdown 分块支持。
- 在 Agent UI 中引入 **invoke** 工具。
- 集成 Dify 知识库 API 支持。
- 添加 GLM4-9B 和 Yi-Lightning 模型支持。
- 引入数据集管理、数据集内文件管理以及聊天助手管理的 HTTP 和 Python API。

:::tip 提示
下载 RAGFlow Python SDK：

```bash
pip install ragflow-sdk==0.13.0
```
:::

### 文档

#### 新增文档

- [获取 RAGFlow API 密钥](./develop/acquire_ragflow_api_key.md)
- [HTTP API 参考文档](./references/http_api_reference.md)
- [Python API 参考文档](./references/python_api_reference.md)

## v0.12.0

发布于 2024 年 9 月 30 日。

### 新增功能

- 提供 RAGFlow Docker 镜像的精简版，该版本不包含内置的 BGE/BCE 嵌入或重排序模型。
- 改进多轮对话的结果。
- 允许用户删除已添加的 LLM 供应商。
- 添加 **OpenTTS** 和 **SparkTTS** 模型支持。
- 在 **General** 分块方法中实现 **Excel 转 HTML** 开关，允许用户将电子表格解析为 HTML 表格或按行解析为键值对。
- 添加 Agent 工具 **YahooFinance** 和 **Jin10**。
- 添加投资顾问 Agent 模板。

### 兼容性变更

从本版本起，RAGFlow 提供 Docker 镜像的精简版，以提升网络访问受限用户的使用体验。RAGFlow 精简版 Docker 镜像不包含内置的 BGE/BCE 嵌入模型，大小约为 1GB；RAGFlow 完整版约为 9GB，包含两个内置嵌入模型。

默认 Docker 镜像版本为 `nightly-slim`。以下列表说明各版本之间的区别：

- `nightly-slim`：最新测试版 Docker 镜像的精简版。
- `v0.12.0-slim`：最新**正式发布**版 Docker 镜像的精简版。
- `nightly`：最新测试版 Docker 镜像的完整版。
- `v0.12.0`：最新**正式发布**版 Docker 镜像的完整版。

有关升级说明，请参阅[升级 RAGFlow](./administrator/upgrade_ragflow.mdx)。

### 文档

#### 新增文档

- [升级 RAGFlow](./administrator/upgrade_ragflow.mdx)

## v0.11.0

发布于 2024 年 9 月 14 日。

### 新增功能

- [ms_marco_v1.1](https://huggingface.co/datasets/microsoft/ms_marco)
- [trivia_qa](https://huggingface.co/datasets/mandarjoshi/trivia_qa)
- [miracl](https://huggingface.co/datasets/miracl/miracl)

## v0.10.0

发布于 2024 年 8 月 26 日。

### 新增功能

- 在 Agent UI 中引入文本转 SQL 模板。
- 实现 Agent API。
- 集成任务执行器监控。
- 引入 Agent 工具 **GitHub**、**DeepL**、**BaiduFanyi**、**QWeather** 和 **GoogleScholar**。
- 支持 EML 文件分块。
- 支持更多 LLM 或模型服务：**GPT-4o-mini**、**PerfXCloud**、**TogetherAI**、**Upstage**、**Novita AI**、**01.AI**、**SiliconFlow**、**PPIO**、**XunFei Spark**、**Jiekou.AI**、**Baidu Yiyan** 和 **Tencent Hunyuan**。

## v0.9.0

发布于 2024 年 8 月 6 日。

### 新增功能

- 支持 GraphRAG 作为分块方法。
- 引入 Agent 组件 **Keyword** 和搜索工具，包括 **Baidu**、**DuckDuckGo**、**PubMed**、**Wikipedia**、**Bing** 和 **Google**。
- 支持音频文件的语音转文本识别。
- 支持模型供应商 **Gemini** 和 **Groq**。
- 支持推理框架、引擎和服务，包括 **LM studio**、**OpenRouter**、**LocalAI** 和 **Nvidia API**。
- 支持在 Xinference 中使用 reranker 模型。

## v0.8.0

发布于 2024 年 7 月 8 日。

### 新增功能

- 支持 Agentic RAG，支持基于图的 RAG 和 Agent 工作流构建。
- 支持模型供应商 **Mistral**、**MiniMax**、**Bedrock** 和 **Azure OpenAI**。
- MANUAL 分块方法支持 DOCX 文件。
- Q&A 分块方法支持 DOCX、MD 和 PDF 文件。

## v0.7.0

发布于 2024 年 5 月 31 日。

### 新增功能

- 支持使用 reranker 模型。
- 集成 reranker 和嵌入模型：[BCE](https://github.com/netease-youdao/BCEmbedding)、[BGE](https://github.com/FlagOpen/FlagEmbedding) 和 [Jina](https://jina.ai/embeddings/)。
- 支持 LLM Baichuan 和 VolcanoArk。
- 实现 [RAPTOR](https://arxiv.org/html/2401.18059v1) 以改进文本检索。
- GENERAL 分块方法支持 HTML 文件。
- 提供 HTTP 和 Python API 用于按 ID 删除文档。
- 支持 ARM64 平台。

:::danger 重要提示
虽然我们也在 ARM64 平台上测试 RAGFlow，但不维护 ARM 平台的 RAGFlow Docker 镜像。

如果您在 ARM 平台上，请按照[本指南](./develop/build_docker_image.mdx)构建 RAGFlow Docker 镜像。
:::

### API 变更

#### HTTP API

- [删除文档](https://ragflow.io/docs/dev/http_api_reference#delete-documents)

#### Python API

- [删除文档](https://ragflow.io/docs/dev/python_api_reference#delete-documents)

## v0.6.0

发布于 2024 年 5 月 21 日。

### 新增功能

- 支持流式输出。
- 提供 HTTP 和 Python API 用于检索文档块。
- 支持系统组件监控，包括 Elasticsearch、MySQL、Redis 和 MinIO。
- 支持在 GENERAL 分块方法中禁用布局识别以减少文件分块时间。

### API 变更

#### HTTP API

- [检索块](https://ragflow.io/docs/dev/http_api_reference#retrieve-chunks)

#### Python API

- [检索块](https://ragflow.io/docs/dev/python_api_reference#retrieve-chunks)

## v0.5.0

发布于 2024 年 5 月 8 日。

### 新增功能

- 支持 LLM DeepSeek。