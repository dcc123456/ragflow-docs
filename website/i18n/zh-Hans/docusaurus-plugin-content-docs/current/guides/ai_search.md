---
sidebar_position: 2
slug: /ai_search
sidebar_custom_props: {
  categoryIcon: LucideSearch
}

---

# 搜索

执行AI搜索。

---

AI搜索是使用预定义的检索策略（加权关键词相似度与加权向量相似度的混合搜索）和系统默认聊天模型进行的单轮AI对话。它不涉及高级RAG策略，如知识图谱、自动关键词或自动问题。相关文本块根据相似度分数按降序排列在聊天模型回复的下方。

![创建搜索应用](https://raw.githubusercontent.com/infiniflow/ragflow-docs/main/images/create_search_app.jpg)

![搜索视图](https://raw.githubusercontent.com/infiniflow/ragflow-docs/main/images/search_view.jpg)

:::tip 提示
在调试聊天助手时，可以使用AI搜索作为参考来验证模型设置和检索策略。
:::

## 前置条件

- 确保已在**模型提供商**页面配置了系统的默认模型。
- 确保目标数据集已正确配置，且目标文档已完成文件解析。

## 常见问题

### AI搜索与AI聊天的关键区别是什么？

聊天是多轮AI对话，您可以定义检索策略（可以使用加权重排序分数替换混合搜索中的加权向量相似度）并选择聊天模型。在AI聊天中，您可以为特定场景配置高级RAG策略，如知识图谱、自动关键词和自动问题。检索到的文本块不会与答案一起显示。