# 15 道面试题参考答案（基于 happyfri）

## 1. 为什么用 Zustand 而不是 Context/Redux？

题库+答题是**跨页共享**的全局状态，但体量不大。Zustand API 简单、无 Provider 嵌套、selector 按需订阅；比 Redux 轻，比 Context 少样板代码。见 `src/stores/game.ts`。

## 2. 路由懒加载带来什么好处？

`router/index.tsx` 用 `React.lazy` 按路由拆 chunk，首屏只加载首页相关 JS，上传/答题页访问时再拉取，降低首屏体积。

## 3. 单选/多选在 UI 层如何区分？

`ItemContainer.tsx` 的 `toggleOption`：`type === 'MORE'` 时 toggle 多选，否则单选直接 `setLocalSelection([optionId])`。

## 4. 计分规则？多选漏选算不算错？

`computeCalculateScore`（`gameLogic.ts`）：用户答案与标准答案经 `normalizeAnswerIds` 后必须**集合完全一致**才算对；漏选或多选都判错。有 `question.score` 则加权，否则均分 100 分。

## 5. 开发环境跨域怎么解决的？

主要靠 **Vite proxy**（`vite.config.ts`），浏览器请求同源 dev server 的 `/api`，由服务器转发到 8000；不单靠后端 CORS。

## 6. 上传接口为什么不用 JSON？

文件是二进制，需 `multipart/form-data`；`FormData` 由浏览器带 boundary。见 `src/api/quiz.ts`。

## 7. 后端如何做输入校验？

两层：Pydantic `schemas.py` 校验结构；`parser.py` 业务 `ValueError`（格式/无题）→ `main.py` 转 HTTP 422 + `detail`。

## 8. 解析器最难的点？

格式多样（题号/选项/答案多种标点）、卷末集中答案对齐、`.doc` 需 LibreOffice 转换。

## 9. 题库持久化怎么设计？

当前 `sessionStorage`（`gamePersistence.ts`）恢复刷新；可升级 localStorage 长期保存、或后端用户维度存 DB + 鉴权。

## 10. 并发 100 人上传瓶颈？

同步解析占 CPU/IO，`.doc` 子进程更重；可改异步队列（Celery/RQ）+ 对象存储 + 轮询结果。

## 11. 你做/改过什么？

示例：Vue3→React19 迁移；首页黑板背景；`sessionStorage` 答题恢复；抽取 `gameLogic` 单测。

## 12. ItemView 为什么 replace 到 /upload？

无 `hasQuestions` 时无法答题，replace 避免用户后退又回到空答题页。

## 13. BASE_URL 对 GitHub Pages 为什么重要？

项目部署在 `https://user.github.io/repo/` 子路径，静态资源与路由 basename 必须带 `/repo/`，否则 404。见 `vite.config.ts` + `BrowserRouter basename`。

## 14. TypeScript 的价值？

`gameTypes.ts` 统一题目结构；store、API、组件共享类型，减少字段拼写错误。

## 15. 怎么加单元测试？

- 前端：`src/stores/gameLogic.test.ts`（`isSameAnswerSet`、计分）
- 后端：`backend/tests/test_parser.py`（内存 docx 样例）

## 可主动提的优化点

1. 刷新前仅 sessionStorage → 可 zustand persist 或后端会话  
2. 同步解析大文件易超时 → 异步任务  
3. 派生字段手动 `syncDerived` → selector 或 computed middleware
