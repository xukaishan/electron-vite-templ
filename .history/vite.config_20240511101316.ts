import { defineConfig } from 'vite';
import path from 'node:path';
import { resolve } from 'path';
import electron from 'vite-plugin-electron/simple';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: './src/main.ts', // 这里是你的主入口文件
                XlsxPopulate: './src/assets/browser/xlsx-populate.min.js',
            },
            output: {
                entryFileNames: '[name].js', // 使用 [name] 占位符来表示入口文件的名称
                chunkFileNames: '[name]-[hash].js', // 使用 [name] 和 [hash] 占位符来表示分片文件的名称
              },
        },
    },
    plugins: [
        vue(),
        AutoImport({
            vueTemplate: true,
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
            types: [],
        }),
        electron({
            main: {
                // Shortcut of `build.lib.entry`.
                entry: 'electron/main.ts',
            },
            preload: {
                // Shortcut of `build.rollupOptions.input`.
                // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
                input: path.join(__dirname, 'electron/preload.ts'),
            },
            // Ployfill the Electron and Node.js API for Renderer process.
            // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
            // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
            renderer:
                process.env.NODE_ENV === 'test'
                    ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
                      undefined
                    : {},
        }),
    ],
});
