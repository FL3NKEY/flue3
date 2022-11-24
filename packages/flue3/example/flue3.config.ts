import { defineConfig } from 'flue3';
import 'dotenv';

export default defineConfig({
    ssr: true,
    server: {
        port: 3005,
    },
});
