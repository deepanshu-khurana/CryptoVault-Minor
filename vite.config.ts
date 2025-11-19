// File: CryptoVault/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// The mode argument allows us to check if we are in 'development' or 'production'
export default defineConfig(({ mode }) => ({
    // 🔑 CRITICAL FIX: Base path is '/' for local development
    // It should only be '/static/' when running the final production build for Django.
    base: mode === 'production' ? '/static/' : '/', 

    server: {
        host: "::",
        port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));