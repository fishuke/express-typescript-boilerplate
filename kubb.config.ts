import { defineConfig } from '@kubb/core';
import { pluginTs } from '@kubb/swagger-ts';
import { pluginOas } from '@kubb/plugin-oas'
import { pluginClient } from '@kubb/plugin-client'

export default defineConfig({
  root: '.',
  input: {
    path: './openapi/spec.json',
  },
  output: {
    path: './client-sdk',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginClient({
      output: {
        path: './clients/axios',
        barrelType: 'named',
        banner: '/* eslint-disable no-alert, no-console */',
        footer: ''
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Service`,
      },
      transformers: {
        name: (name, _type) => {
          return `${name}Client`
        },
      },
      operations: true,
      parser: 'client',
      exclude: [
        {
          type: 'tag',
          pattern: 'store',
        },
      ],
      pathParamsType: "object",
      dataReturnType: 'full',
      client: 'axios'
    }),
  ],
});
