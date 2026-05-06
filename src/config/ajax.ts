// src/utils/request.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getApiRoot } from '@/config/api'

// 1. 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: getApiRoot() || '/api',
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 示例：如果需要从 Pinia 获取 token，请在这里引入 store
    // const userStore = useUserStore();
    // if (userStore.token) {
    //   config.headers['Authorization'] = `Bearer ${userStore.token}`;
    // }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 3. 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回数据部分
    return response.data;
  },
  (error) => {
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
  }
);

// 4. 封装通用请求方法
export const request = <T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service({
    method,
    url,
    [method === 'GET' ? 'params' : 'data']: data,
    ...config,
  });
};

export default service;