import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
// import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import replace from '@rollup/plugin-replace'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import svg from 'rollup-plugin-svg'

console.log(process.env.NODE_ENV)

/**
 * <BadgeFactoryBCS />
 *
 *
 */
const BadgeFactoryBCS = {
  input: ['src/injects/BadgeFactoryBCS/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/BadgeFactoryBCS.production.js' : 'iife/BadgeFactoryBCS.js',
    format: 'iife',
    sourcemap: true,
    name: 'Lootbox',
    inlineDynamicImports: true,
    globals: {
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes',
      react: 'React',
      callbackify: 'callbackify',
      path: false,
      fs: false,
      os: false,
      module: false,
      util: false,
      tty: false,
      buffer: false,
    },
  },
  plugins: [
    commonjs({
      // namedExports: {
      // // This is needed because react/jsx-runtime exports jsx on the module export.
      // // Without this mapping the transformed import import {jsx as _jsx} from 'react/jsx-runtime' will fail.
      // 'react/jsx-runtime': ['jsx', 'jsxs'],
      // },
    }),
    nodePolyfills(), // enable NodeJS polyfills
    resolve({ preferBuiltins: true, browser: true }), // enable importing from node_modules
    typescript(), // enable TypeScript
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    svg(),
    json(), // enable JSON
    // globals(), // allows globals to be imported (process.env)
    builtins(), // allows builtins to be imported via require/import
  ],
  external: ['react'],
}
if (process.env.NODE_ENV === 'production') {
  BadgeFactoryBCS.plugins.unshift(terser()) // enable minification
}

/**
 * <BadgeMinterBCS />
 *
 *
 */
const BadgeMinterBCS = {
  input: ['src/injects/BadgeMinterBCS/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/BadgeMinterBCS.production.js' : 'iife/BadgeMinterBCS.js',
    format: 'iife',
    sourcemap: true,
    name: 'Lootbox',
    inlineDynamicImports: true,
    globals: {
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes',
      react: 'React',
      callbackify: 'callbackify',
      path: false,
      fs: false,
      os: false,
      module: false,
      util: false,
      tty: false,
      buffer: false,
    },
  },
  plugins: [
    commonjs({
      // namedExports: {
      // // This is needed because react/jsx-runtime exports jsx on the module export.
      // // Without this mapping the transformed import import {jsx as _jsx} from 'react/jsx-runtime' will fail.
      // 'react/jsx-runtime': ['jsx', 'jsxs'],
      // },
    }),
    nodePolyfills(), // enable NodeJS polyfills
    resolve({ preferBuiltins: true, browser: true }), // enable importing from node_modules
    typescript(), // enable TypeScript
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    svg(),
    json(), // enable JSON
    // globals(), // allows globals to be imported (process.env)
    builtins(), // allows builtins to be imported via require/import
  ],
  external: ['react'],
}
if (process.env.NODE_ENV === 'production') {
  BadgeMinterBCS.plugins.unshift(terser()) // enable minification
}

export default [BadgeFactoryBCS, BadgeMinterBCS]

// --------------------------------------------------

/**
 * ESM build
 *
 *
 */
// const configESM = {
//   input: ['src/index.ts'],
//   output: {
//     dir: 'lib',
//     format: 'esm',
//     sourcemap: true,
//   },
//   plugins: [
//     typescript(), // enable TypeScript
//     commonjs(), // enable CommonJS modules
//     resolve(), // enable importing from node_modules
//     json(), // enable JSON
//     globals(), // allows globals to be imported (process.env)
//     builtins(), // allows builtins to be imported via require/import
//   ],
//   external: ['react'],
// }
// if (process.env.NODE_ENV === 'production') {
//   configESM.plugins.push(terser()) // enable minification
// }
