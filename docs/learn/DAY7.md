# 第 7 天：模拟面试 + 实战

**目标（3h）**：模拟面试；验证仓库内已实现的两项实战。

## 1. 模拟面试（90min）

按 [MOCK_INTERVIEW.md](./MOCK_INTERVIEW.md) 流程自问自答或找同学 mock。

## 2. 实战 A：sessionStorage 恢复（已实现）

**验证步骤**

1. 上传题库，答 2 题
2. 浏览器刷新（F5）仍在 `/item` 或手动打开 http://localhost:5173/item
3. 题号、已选答案、用时应恢复

**代码位置**

- `src/stores/gamePersistence.ts` — 读写 session
- `src/main.tsx` — `hydrateGameStoreFromSession()`
- `src/views/ItemView.tsx` — 仅 `state.reset` 时 `initializeData()`
- 答题卡「重新练习」→ `Link state={{ reset: true }}`

**面试话术**：刷新不丢进度；重新练习显式 reset，避免误清空。

## 3. 实战 B：parser 测试（已实现）

```bash
cd backend
python -m pip install pytest
python -m pytest tests/ -v
```

`backend/tests/test_parser.py` 用 python-docx 在内存生成样例文档，断言题数与答案。

## 4. 前端逻辑测试

```bash
npm test
```

运行 `src/stores/gameLogic.test.ts`（Vitest）。

## 5. 收尾 checklist

- [ ] `npm run build` 通过
- [ ] `npm test` 与 `pytest` 通过
- [ ] 准备好「我负责的部分」一句真话
