# 第 3 天：Zustand 与业务规则（面试核心）

**目标（3h）**：能默讲 `game.ts` 字段、判题计分、调用链。

## 1. 状态字段

| 字段 | 含义 |
|------|------|
| `questions` | 解析后的题目数组 |
| `itemNum` | 当前题号（从 1 开始） |
| `userAnswersMap` | `questionId → 选项 id[]` |
| `elapsedTime` / `timerId` | 秒表 |
| `currentTopic` | 派生：当前题对象 |
| `calculateScore` | 派生：总分 |
| `reviewItems` | 派生：复盘用（含对错） |

派生由 `syncDerived()` 在每次 `set` 时重算。

## 2. 必背算法

实现见 `src/stores/gameLogic.ts`（与 store 共用，可单测）：

1. **normalizeAnswerIds**：去重 + 排序 → 多选顺序无关
2. **isSameAnswerSet**：长度相同且逐项相等
3. **computeCalculateScore**：有 `question.score` 加权，否则 `100/题数` 均分

## 3. 调用链（上传 → 答题）

```
parseQuizFile → setParseResult
  → set questions + syncDerived
  → initializeData()（清空答案、题号归 1）
  → saveGameSession()

进入 /item → startTimer()（不 initializeData）
答题 → submitCurrentQuestion → setQuestionAnswer
提交 → stopTimer → navigate /score
```

## 4. ui store

`loading` / `error`；`UploadDrawer` 里 `axios.isAxiosError` 取 `response.data.detail`。

## 5. 自测答案

**Q: 刷新后题库还在吗？**  
A: 有 `sessionStorage` 持久化后，同标签页刷新可恢复；关浏览器 tab 后 session 清空。之前纯内存则丢失。

**Q: reviewItems vs questions？**  
A: `questions` 是题库标准答案；`reviewItems` 叠加用户答案与 `isCorrect`。

**Q: 最后一题「提交答卷」？**  
A: `persistCurrentSelection` → `stopTimer` → `/score`。

## 6. 阅读顺序

`gameLogic.ts` → `game.ts` → `gamePersistence.ts` → `ItemContainer.tsx`
