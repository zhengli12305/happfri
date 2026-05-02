// src/utils/request.ts
import axios from 'axios';
// 1. 创建 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 确保你的 .env 文件中有这个变量，或者改为硬编码字符串
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// 2. 请求拦截器
service.interceptors.request.use((config) => {
    // 示例：如果需要从 Pinia 获取 token，请在这里引入 store
    // const userStore = useUserStore();
    // if (userStore.token) {
    //   config.headers['Authorization'] = `Bearer ${userStore.token}`;
    // }
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});
// 3. 响应拦截器
service.interceptors.response.use((response) => {
    // 直接返回数据部分
    return response.data;
}, (error) => {
    console.error('Response error:', error);
    if (error.response) {
        switch (error.response.status) {
            case 401:
                console.warn('未授权，请重新登录');
                // router.push('/login'); 
                break;
            case 404:
                console.warn('请求资源不存在');
                break;
            default:
                console.warn('服务器错误');
        }
    }
    return Promise.reject(error);
});
// 4. 封装通用请求方法
export const request = (method, url, data, config) => {
    return service({
        method,
        url,
        [method === 'GET' ? 'params' : 'data']: data,
        ...config,
    });
};
export default service;
