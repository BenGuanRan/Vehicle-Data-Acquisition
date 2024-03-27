import { defineConfig } from 'vite'
import { join } from "path";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': join(__dirname, "src"),
    }
  },
  server: {
    port: 3000,
    proxy: {
      '^/api': {
        target: 'http://localhost:8080', //目标源，目标服务器，真实请求地址
        changeOrigin: true, //支持跨域
        rewrite: (path) => path.replace(/^\/api/, ""), //重写真实路径,替换/api
      }
    }
  }
})
