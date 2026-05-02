import { createRouter, createWebHistory } from 'vue-router';
// 注意：新项目中，App.vue 通常在 main.ts 中挂载，不需要在这里作为路由组件
// 我们直接把原来的 children 提升为根路由
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            // 如果原本的 App 组件里有 <router-view>，现在由根目录的 App.vue 负责
            // 这里可以直接放子路由，或者放一个 Layout 组件（如果有的话）
            // 为了保持和你旧代码逻辑一致，我们直接写 children
            children: [
                {
                    path: '', // 对应旧代码的 path: '' (即首页 /)
                    name: 'Home',
                    // ✅ 新式懒加载 + 保留 Chunk 名称注释 (Vite 支持此注释)
                    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
                },
                {
                    path: 'item', // 对应旧代码的 /item (注意：父级有 /，这里写 item 即可，或者写 /item 也行)
                    name: 'Item',
                    component: () => import(/* webpackChunkName: "item" */ '../views/ItemView.vue')
                },
                {
                    path: 'score', // 对应旧代码的 /score
                    name: 'Score',
                    component: () => import(/* webpackChunkName: "score" */ '../views/ScoreView.vue')
                }
            ]
        }
    ]
});
export default router;
