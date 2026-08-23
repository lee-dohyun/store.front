import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Next.js(App Router)는 별도의 vitest 프리셋을 제공하지 않으므로, JSX 트랜스폼을 위해
// @vitejs/plugin-react를 직접 붙인다. tsconfig.json의 "@/*" 경로 별칭을 그대로 미러링해서
// 앱 코드와 테스트 코드가 동일한 import 경로를 쓸 수 있게 한다.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    // @testing-library/jest-dom(v7)의 기본 진입점이 전역 expect를 직접 참조하므로
    // globals를 켜야 vitest.setup.ts의 matcher 확장이 에러 없이 동작한다.
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
