---
sidebar_position: 3
slug: /switch_doc_engine
sidebar_custom_props: {
  categoryIcon: LucideShuffle
}

---

# 切换文档引擎

将文档引擎从 Elasticsearch 切换到 Infinity。

---

RAGFlow 默认使用 Elasticsearch 来存储全文和向量。要切换到 [Infinity](https://github.com/infiniflow/infinity/)，请按照以下步骤操作：

:::caution 警告
在 Linux/arm64 机器上切换到 Infinity 尚未正式支持。
:::

1. 停止所有正在运行的容器：

   ```bash
   $ docker compose -f docker/docker-compose.yml down -v
   ```

:::caution 警告
`-v` 会删除 Docker 容器的卷，现有数据将被清除。
:::

2. 在 **docker/.env** 中将 `DOC_ENGINE` 设置为 `infinity`。

3. 启动容器：

   ```bash
   $ docker compose -f docker-compose.yml up -d
   ```