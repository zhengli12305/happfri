# happyfri 面试速成学习资料

按 7 天计划跟练，每天打开对应 `DAYn.md`，完成「必读 → 动手 → 自测」。

| 天 | 文档 | 重点 |
|----|------|------|
| 1 | [DAY1.md](./DAY1.md) | 跑通、架构图、Vite 代理 |
| 2 | [DAY2.md](./DAY2.md) | React Hooks、懒加载、答题 UI |
| 3 | [DAY3.md](./DAY3.md) | Zustand、判题计分（核心） |
| 4 | [DAY4.md](./DAY4.md) | API、FormData、部署变量 |
| 5 | [DAY5.md](./DAY5.md) | parser 三阶段管线 |
| 6 | [DAY6.md](./DAY6.md) + [INTERVIEW_QA.md](./INTERVIEW_QA.md) | 串讲、15 道面试题 |
| 7 | [DAY7.md](./DAY7.md) + [MOCK_INTERVIEW.md](./MOCK_INTERVIEW.md) | 模拟面试、实战 |

全局参考：[ARCHITECTURE.md](./ARCHITECTURE.md)

## 本地启动

```bash
# 终端 1
cd backend && python run_desktop.py

# 终端 2
npm run dev
```

前端 http://localhost:5173/ ，后端 http://127.0.0.1:8000/health

## 仓库内已实现的练习

- 首页「开始答题」无题库时 `disabled`（第 2 天）
- `sessionStorage` 答题进度持久化（第 7 天 A）
- `backend/tests/` parser 样例测试（第 7 天 B）
- `src/stores/gameLogic.ts` 可单测的判题/计分函数
