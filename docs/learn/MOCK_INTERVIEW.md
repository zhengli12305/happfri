# 模拟面试脚本（约 90 分钟）

## 环节 1：项目介绍（3 分钟）

**考官**：介绍一下这个项目。

**要点**：业务价值、技术栈（React + Zustand + FastAPI）、你负责的部分、一个亮点（持久化/迁移/解析）。

---

## 环节 2：状态管理深挖（10 分钟）

1. `userAnswersMap` 和 `localSelection` 为什么分开？
2. `setParseResult` 之后为什么调 `initializeData`？
3. 刷新页面数据从哪恢复？键名是什么？
4. 计时器存在哪个字段？怎么防止重复 `setInterval`？

参考答案见 [DAY3.md](./DAY3.md)、`src/stores/game.ts`。

---

## 环节 3：手写/口述算法（10 分钟）

实现或口述：**判断两组选项 id 是否表示同一答案（多选顺序无关）**。

参考：`src/stores/gameLogic.ts` → `normalizeAnswerIds` + `isSameAnswerSet`。

---

## 环节 4：前后端时序（5 分钟）

画或说：

```
用户选文件 → FormData POST → FastAPI 读 bytes → parser 行数组 → JSON
→ axios 响应 → setParseResult → navigate /item
```

---

## 环节 5：边界与 Bug（5 分钟）

| 场景 | 行为 |
|------|------|
| 未上传点「开始答题」 | 按钮 disabled + 可打开上传抽屉 |
| 空文件 | 400，`detail` 展示 |
| 无题库进 /item | replace `/upload` |
| 答题卡「重新练习」 | `reset: true` 清空答案重来 |
| 最后一题未选就提交 | 提交空答案，该题算错 |

---

## 环节 6：开放题（5 分钟）

- 如何支持登录后云端题库？
- 如何给 parser 加新题型？

---

## 自评表

| 项 | 1-5 分 |
|----|--------|
| 表达清晰 | |
| 熟悉代码位置 | |
| 能画架构/时序 | |
| 能答追问 | |

低于 3 分的项回到对应 DAYn.md 补一天。
