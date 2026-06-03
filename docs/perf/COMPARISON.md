# 前端性能对比：优化前 vs 优化后

| | 优化前（古老版） | 优化后（当前） |
|---|------------------|----------------|
| 路径 | `Desktop/happyfri-vue3 - 1(古老版本)` | `Desktop/上线后克隆下来` |
| 栈 | Vue 3 + Pinia + Vite 7 | React 19 + Zustand + Vite 8 |
| 生产预览 | `http://localhost:4174/public/` | `http://localhost:4173/happfri/` |

---

## 1. 怎么测古老版（与当前对齐）

```powershell
# 终端 1：后端（两个版本共用）
cd backend
python run_desktop.py

# 终端 2：古老版 preview（端口与当前错开）
cd "C:\Users\zl203\Desktop\happyfri-vue3 - 1(古老版本)"
npm run build-only
npm run preview -- --port 4174 --strictPort
```

浏览器打开：

| 页面 | 古老版 URL | 说明 |
|------|------------|------|
| 入口（默认上传页） | http://localhost:4174/public/upload | `/` 会 redirect 到 upload |
| 答题页 | http://localhost:4174/public/item | 需先上传成功 |

Lighthouse 设置与 [FRONTEND_CHECKLIST.md](./FRONTEND_CHECKLIST.md) 相同：Desktop + 只勾 Performance。

> 古老版 dev/preview **没有** `VITE_API_BASE_URL`，上传走相对路径 `/api/...`；preview 不代理 API，**必须后端在 8000**，且可能需改 axios 为绝对地址或只用 dev 模式测上传。当前 build 下上传与 Network 测法建议用 `npm run dev`（8088 端口，自带代理）或临时改 API 地址。

---

## 2. Build 体积对比（客观数据）

### 首屏 JS（gzip）

| 版本 | 首屏加载的 JS chunk | gzip 合计 |
|------|---------------------|-----------|
| **古老版** `/upload` | `vendor` + `index` + `UploadView` | **~53 kB** |
| **优化后** `/` | `index`（含 React+Router）+ `HomeView` | **~77 kB** |

古老版通过 `manualChunks: { vendor: ['vue','vue-router','pinia'] }` 拆包，**主路径 JS 更小**。

### 答题页 JS（gzip）

| 版本 | 除 axios 外业务 chunk | gzip 合计 |
|------|------------------------|-----------|
| **古老版** `/item` | vendor + index + ItemView + ItemContainer | **~54 kB** |
| **优化后** `/item` | index + ItemView | **~78 kB** |

React 运行时打进单一 `index-*.js`（237 kB / gzip 76 kB），比 Vue vendor 方案大约 **+24 kB gzip**。

### 背景图（影响 LCP）

| 版本 | 策略 | 体积 |
|------|------|------|
| **古老版** | `body` 全局背景 `1-1.jpg`，**每一页都加载** | **111 kB** |
| **优化后** | 仅首页 `home-bg.png`；答题页纯色 `#f3f4f6` | 首页 **82 kB**，**item 无大图** |

**答题页 LCP 优化点**：去掉全站 111 kB 背景，item 不再为首页图买单。

---

## 3. Lighthouse 实测对比

> **测法说明**：优化后用 **生产包 preview**（`4173/happfri/`）；古老版 upload 页为 **dev 模式**（`8088/upload`）。dev 分数通常低于生产包，对比时 ancient 侧会略吃亏，但 LCP 差距仍具参考价值。严格对齐请古老版也跑 `npm run build-only && npm run preview -- --port 4174`。

### 首屏 / 上传入口

| 指标 | 古老版 `/upload`（dev 8088） | 优化后 `/`（preview 4173） | 变化 |
|------|-------------------------------|----------------------------|------|
| **Performance** | **94** | **100** | +6 |
| **LCP** | **1.5 s** ⚠️ | **0.5 s** | **−1.0 s** |
| **FCP** | **0.9 s** | **0.3 s** | −0.6 s |
| **TBT** | **0 ms** | **0 ms** | 持平 |
| **CLS** | 0.052 | 0（首页） | 略优 |

### 答题页

| 指标 | 古老版 `/item` | 优化后 `/item`（preview） |
|------|----------------|---------------------------|
| **Performance** | 待测 | **100** |
| **LCP** | 待测 | **0.4 s** |
| **FCP** | 待测 | **0.3 s** |
| **TBT** | 待测 | **0 ms** |

### 其他（古老版 upload 页）

| 类别 | 分数 |
|------|------|
| 无障碍 | 73 |
| 最佳做法 | 100 |
| SEO | 82 |

### 优化后 Network / Performance（已测）

- `parse-questions`：TTFB **~9 ms**，总 **~28 ms**，6.8 kB
- 录答题 15s：脚本+渲染 ~300 ms，无明显业务 Long Task

### 怎么解释 LCP 1.5 s → 0.5 s

1. 古老版 **全站 body 加载 111 kB 背景图**，upload 页 LCP 被大图拖慢（Lighthouse 标橙）。
2. 优化后背景 **仅首页 82 kB**，且为 **生产 build**（压缩、无 dev HMR）。
3. 优化后 FCP 0.3 s，首屏可交互更早。

---

## 4. 架构差异（面试怎么讲「优化了什么」）

| 维度 | 古老版 | 优化后 |
|------|--------|--------|
| 路由 | 5 页，`/` → upload | 7 页，独立首页 + 答题卡 |
| 代码分割 | vendor 手动拆包 | React.lazy 按路由拆 chunk |
| 状态 | Pinia 全在 `game.ts` | Zustand + `gameLogic` / `gamePersistence` 拆分 + 单测 |
| 刷新恢复 | 无 sessionStorage | sessionStorage hydrate |
| 背景资源 | 全站 111 kB JPG | 首页 82 kB PNG，答题页无大图 |
| API | 手写 multipart Content-Type | 浏览器自动带 boundary |

**结论（30 秒）**：

> 古老版 upload 页 Lighthouse Performance 94、LCP 1.5s（全站 111 kB 背景 + dev 环境）；优化后生产包首页 Performance 100、LCP 0.5s、FCP 0.3s。JS gzip 略增（~53 kB → ~77 kB），但 LCP 降约 1 秒，答题页无大图后 item LCP 0.4s。瓶颈仍在 `parse-questions`（TTFB ~9 ms），不在前端切题。

---

## 5. 功能差异（不是性能，但对比时要提）

- 优化后新增：答题卡 `/answer-card`、详情页、UploadDrawer、桌面 rem 修复
- 古老版：Home 与 Item 共用 `ItemContainer`，结构更简单
