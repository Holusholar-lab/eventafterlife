import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: ReturnType<typeof react>[] = [react()];
  if (mode === "development") {
    try {
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch {
      // lovable-tagger optional; skip if missing (e.g. on Vercel build)
    }
  }
  return {
    server: {
      host: "localhost",
      port: 8080,
      hmr: { overlay: false },
    },
    plugins,
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  };
});
