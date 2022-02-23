import { omitBy } from 'lodash'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...omitBy(loadEnv(mode, process.cwd()), Boolean),
  }
  return defineConfig({
    plugins: [reactRefresh(), tsconfigPaths(), visualizer({ open: false })],
    esbuild: {
      jsxInject: `import React from 'react';`,
    },
    define: {
      __DEV__: process.env.NODE_ENV !== 'production',
    },
  })
}
