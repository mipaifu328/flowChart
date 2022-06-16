/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-06-14 15:32:04
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-06-15 14:52:14
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
