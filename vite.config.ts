import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// import lessPlugin from 'vite-plugin-less'; // Добавляем плагин для Less

export default defineConfig({
    plugins: [
        react(),
        // lessPlugin({
        //     javascriptEnabled: true, // Включаем поддержку встроенного JavaScript в Less
        // }),
    ],
    server: {
        host: true,
        port: 3000,
    },
    resolve: {
        alias: {
            '@public': path.resolve(__dirname, 'public'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@redux': path.resolve(__dirname, 'src/redux'),
            '@types': path.resolve(__dirname, 'src/types'),
            '@utils': path.resolve(__dirname, 'src/utils'),
        },
    },
});
