# 前端性能检查清单（Step 5）

**重要**：必须用生产构建，dev 模式不能作为性能结论。

```bash
npm run build
npm run preview
# 默认 http://localhost:4173
```

## Lighthouse（Performance）

对以下页面各跑一次 **Desktop**：

| 页面 | URL | 关注指标 |
|------|-----|----------|
| 首页 | `/` | LCP、FCP、TBT |
| 答题页 | `/item`（需先上传题库或恢复 session） | TBT、Long Task |

记录到 `BASELINE.md` 末尾或你的笔记：

```markdown
## 前端 Lighthouse（手动）

| 页面 | Performance | LCP | FCP | TBT |
|------|-------------|-----|-----|-----|
| / | | | | |
| /item | | | | |
```

## Network：上传链路

1. DevTools → Network → 上传 docx
2. 找到 `parse-questions`
3. 记录：**Waiting (TTFB)**、总耗时、响应大小

这与后端 Locust 的 P95 应同一数量级（单用户无并发）。

## Performance 面板：答题交互

录制 15 秒：切题 → 选选项 → 下一题 → 提交。

- 有无 **Long Task > 50ms**
- 题号 strip 题量很大时是否卡顿（100+ 题时可讨论虚拟列表优化）

## Bundle 体积（build 日志）

`npm run build` 输出中关注：

- `dist/assets/index-*.js` — 主包
- `ItemView-*.js`、`UploadDrawer-*.js` — 懒加载 chunk 是否分离

## 本项目的合理预期

- 答题/计分在 **Zustand 客户端**，无重复 API — 不必为答题页做 API 缓存方案。
- 性能故事重点：**首屏 + 上传解析等待时间**，不是「接口 QPS」。
