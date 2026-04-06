// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },

    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                secure: false,
            },
            '/socket.io': {
                target: 'http://127.0.0.1:3000',
                ws: true,
                changeOrigin: true,
                secure: false,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        const socketErr = err as any;

                        if (socketErr.code === 'ECONNRESET' || socketErr.code === 'ECONNABORTED') {
                            return; // ปล่อยผ่านไป
                        }
                        console.log('proxy error', err);
                    });

                    proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
                        socket.on('error', (err) => {
                            const socketErr = err as any;

                            if (socketErr.code === 'ECONNRESET' || socketErr.code === 'ECONNABORTED') {
                                return;
                            }
                            console.error('WebSocket proxy socket error:', err);
                        });
                    });
                },
            },
        },
    },
})