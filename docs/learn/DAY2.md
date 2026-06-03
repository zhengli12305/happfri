# 第 2 天：React 在本项目中的用法

**目标（2–3h）**：掌握 Hooks、懒加载、答题局部 state；完成按钮 disabled 练习。

## 1. 模式对照表

| 模式 | 位置 | 面试说法 |
|------|------|----------|
| `useState` | HomeContent、ItemContainer | 局部 UI：hint、当前题选项 |
| `useEffect` | ItemView、AnswerCardView | 进入页校验、计时 |
| `lazy` + `Suspense` | `router/index.tsx` | 路由级代码分割 |
| `useNavigate` / `Link` | 各 View | 编程式/声明式导航 |
| `useParams` / `useSearchParams` | AnswerDetail、AnswerCard | 动态路由与 query |

## 2. 精读（90min）

### HomeView + HomeContent

- 抽屉：`useState(isDrawerOpen)` + `lazy(UploadDrawer)`
- **已实现**：`disabled={!hasQuestions}` 防止无题库误点（见 `HomeContent.tsx`）

### ItemView

```tsx
// 无题库 → replace /upload
// 有题库 → 仅 startTimer（不再 initializeData，避免刷新清空答案）
// state.reset === true → 从答题卡「重新练习」时重置进度
```

### ItemContainer

- `localSelection`：当前题正在选的选项
- `useEffect` 依赖 `currentTopic?.id`：切题从 `userAnswersMap` 恢复
- `persistCurrentSelection`：切题/下一题前写入 store
- `toggleOption`：`MORE` 多选 toggle，否则单选覆盖

## 3. 小练习（已完成）

「开始答题」`disabled={!hasQuestions}`：比仅靠 hint 更明确，减少无效点击与误导航。

## 4. 自测答案

**Q: 单选/多选逻辑在哪？**  
A: `ItemContainer.tsx` 的 `toggleOption`，`topic.type === 'MORE'` 分支。

**Q: 为何切题要先 persist？**  
A: 答案在 `localSelection`，不写回 store 则切题丢失当前题选择。

## 5. 调试建议

在 `toggleOption`、`persistCurrentSelection` 打 `console.log`，上传 3 题文件后切题观察 map 变化。
