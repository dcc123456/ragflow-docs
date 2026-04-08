---
sidebar_position: 6
slug: /manage_files
sidebar_custom_props: {
  categoryIcon: LucideFolderDot
}

---

# 文件管理

RAGFlow 的文件管理功能支持单个或批量上传文件。您可以将上传的文件链接到多个目标知识库。本指南将介绍文件管理功能的一些基本用法。

:::info 重要提示
与直接将文件上传到各个知识库相比，将文件上传到 RAGFlow 文件管理后再链接到不同知识库，这一步**并非多余**，特别是当您想删除一些已解析的文件或整个知识库但保留原始文件时。
:::

## 创建文件夹

RAGFlow 的文件管理功能允许您建立具有嵌套文件夹结构的文件系统。要在 RAGFlow 根目录中创建文件夹：

![create new folder](https://github.com/infiniflow/ragflow/assets/93570324/3a37a5f4-43a6-426d-a62a-e5cd2ff7a533)

:::caution 注意
RAGFlow 中的每个知识库都对应 **root/.knowledgebase** 目录下的一个文件夹。您不允许在其中创建子文件夹。
:::

## 上传文件

RAGFlow 的文件管理功能支持从本地机器上传文件，支持单个和批量上传：

![upload file](https://github.com/infiniflow/ragflow/assets/93570324/5d7ded14-ce2b-4703-8567-9356a978f45c)

![bulk upload](https://github.com/infiniflow/ragflow/assets/93570324/def0db55-824c-4236-b809-a98d8c8674e3)

## 预览文件

RAGFlow 的文件管理功能支持预览以下格式的文件：

- 文档（PDF、DOCS）
- 表格（XLSX）
- 图片（JPEG、JPG、PNG、TIF、GIF）

![preview](https://github.com/infiniflow/ragflow/assets/93570324/2e931362-8bbf-482c-ac86-b68b09d331bc)

## 将文件链接到知识库

RAGFlow 的文件管理功能允许您将上传的文件*链接*到多个知识库，在每个目标知识库中创建文件引用。因此，删除文件管理中的文件将**自动删除**所有知识库中的相关文件引用。

![link knowledgebase](https://github.com/infiniflow/ragflow/assets/93570324/6c6b8db4-3269-4e35-9434-6089887e3e3f)

您可以将文件链接到一个或多个知识库：

![link multiple kb](https://github.com/infiniflow/ragflow/assets/93570324/6c508803-fb1f-435d-b688-683066fd7fff)

## 将文件移动到指定文件夹

![move files](https://github.com/user-attachments/assets/3a2db469-6811-4ea0-be80-403b61ffe257)

## 搜索文件或文件夹

**文件管理**仅支持在当前目录中按文件名和文件夹名进行过滤（不会检索子目录中的文件或文件夹）。

![search file](https://github.com/infiniflow/ragflow/assets/93570324/77ffc2e5-bd80-4ed1-841f-068e664efffe)

## 重命名文件或文件夹

RAGFlow 的文件管理功能允许您重命名文件或文件夹：

![rename_file](https://github.com/infiniflow/ragflow/assets/93570324/5abb0704-d9e9-4b43-9ed4-5750ccee011f)

## 删除文件或文件夹

RAGFlow 的文件管理功能允许您单个或批量删除文件或文件夹。

删除文件或文件夹：

![delete file](https://github.com/infiniflow/ragflow/assets/93570324/85872728-125d-45e9-a0ee-21e9d4cedb8b)

批量删除文件或文件夹：

![bulk delete](https://github.com/infiniflow/ragflow/assets/93570324/519b99ab-ec7f-4c8a-8cea-e0b6dcb3cb46)

> - 您不允许删除 **root/.knowledgebase** 文件夹。
> - 删除已链接到知识库的文件将**自动删除**所有知识库中的相关文件引用。

## 下载已上传的文件

RAGFlow 的文件管理功能允许您下载已上传的文件：

![download_file](https://github.com/infiniflow/ragflow/assets/93570324/cf3b297f-7d9b-4522-bf5f-4f45743e4ed5)

> 从 RAGFlow v0.24.0 版本起，不支持批量下载，也无法下载整个文件夹。