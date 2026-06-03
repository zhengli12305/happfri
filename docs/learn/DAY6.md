# 第 6 天：串讲 + 面试题

**目标（3h）**：能 5 分钟讲完项目；熟记 [INTERVIEW_QA.md](./INTERVIEW_QA.md)。

## 1. 五分钟串讲稿（建议背诵）

> 这是 happyfri 智能题库。用户在前端上传 Word、PDF 或 Excel，通过 FormData 调到 FastAPI 的 parse-questions 接口。后端用正则和文档库把题目、选项、答案解析成 JSON。前端用 Zustand 存题库和作答记录，在 Item 页答题并计时，提交后按集合比对算分，Score 页展示成绩，AnswerCard 复盘对错。开发用 Vite 代理 /api，生产用环境变量接 HTTPS API，静态页可部署 GitHub Pages。我还做了 sessionStorage 刷新恢复，以及 gameLogic 和 parser 的单测。

## 2. 练习（90min）

1. 闭卷录音 5 分钟串讲（可对照上文微调）
2. 逐题过 [INTERVIEW_QA.md](./INTERVIEW_QA.md)，每题用自己的话答 30 秒
3. 白板画：上传 → 解析 → store → 答题 → 计分

## 3. 手写练习（15min）

在纸上写 `isSameAnswerSet` 逻辑（或打开 `src/stores/gameLogic.ts` 默写）。

## 4. 两个优化点（30min）

见 INTERVIEW_QA 末尾；各准备 1 句「现状 + 改法 + 收益」。

## 5. checklist

- [ ] 5 分钟讲完整链路
- [ ] 15 题能举例
- [ ] 能画架构图（见 ARCHITECTURE.md）
