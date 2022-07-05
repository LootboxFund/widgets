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
 * <CreateLootbox />
 *
 *
 */
const CreateLootbox = {
  input: ['src/injects/CreateLootbox/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/CreateLootbox.production.js' : 'iife/CreateLootbox.js',
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
  CreateLootbox.plugins.unshift(terser()) // enable minification
}

/**
 * <InteractWithLootbox />
 *
 *
 */
const InteractWithLootbox = {
  input: ['src/injects/InteractWithLootbox/index.ts'],
  output: {
    file:
      process.env.NODE_ENV === 'production' ? 'iife/InteractWithLootbox.production.js' : 'iife/InteractWithLootbox.js',
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
  InteractWithLootbox.plugins.unshift(terser()) // enable minification
}

/**
 * <ManageLootbox />
 *
 *
 */
const ManageLootbox = {
  input: ['src/injects/ManageLootbox/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/ManageLootbox.production.js' : 'iife/ManageLootbox.js',
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
  ManageLootbox.plugins.unshift(terser()) // enable minification
}

/**
 * <SearchBar />
 *
 *
 */
const SearchBar = {
  input: ['src/injects/SearchBar/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/SearchBar.production.js' : 'iife/SearchBar.js',
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
  SearchBar.plugins.unshift(terser()) // enable minification
}

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

const Authentication = {
  input: ['src/injects/Authentication/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/Authentication.production.js' : 'iife/Authentication.js',
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
  Authentication.plugins.unshift(terser()) // enable minification
}

const MyProfile = {
  input: ['src/injects/MyProfile/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/MyProfile.production.js' : 'iife/MyProfile.js',
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
  MyProfile.plugins.unshift(terser()) // enable minification
}

const TournamentCreate = {
  input: ['src/injects/TournamentCreate/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/TournamentCreate.production.js' : 'iife/TournamentCreate.js',
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
  TournamentCreate.plugins.unshift(terser()) // enable minification
}

const TournamentManage = {
  input: ['src/injects/TournamentManage/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/TournamentManage.production.js' : 'iife/TournamentManage.js',
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
  TournamentManage.plugins.unshift(terser()) // enable minification
}

const TournamentPublic = {
  input: ['src/injects/TournamentPublic/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/TournamentPublic.production.js' : 'iife/TournamentPublic.js',
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
  TournamentPublic.plugins.unshift(terser()) // enable minification
}

const BattleFeed = {
  input: ['src/injects/BattleFeed/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/BattleFeed.production.js' : 'iife/BattleFeed.js',
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
  BattleFeed.plugins.unshift(terser()) // enable minification
}

const PartyBasketManage = {
  input: ['src/injects/PartyBasketManage/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/PartyBasketManage.production.js' : 'iife/PartyBasketManage.js',
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
  PartyBasketManage.plugins.unshift(terser()) // enable minification
}

const PartyBasketRedeem = {
  input: ['src/injects/PartyBasketRedeem/index.ts'],
  output: {
    file: process.env.NODE_ENV === 'production' ? 'iife/PartyBasketRedeem.production.js' : 'iife/PartyBasketRedeem.js',
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
  PartyBasketRedeem.plugins.unshift(terser()) // enable minification
}

export default [
  CreateLootbox,
  InteractWithLootbox,
  ManageLootbox,
  SearchBar,
  Authentication,
  MyProfile,
  TournamentCreate,
  TournamentManage,
  TournamentPublic,
  BattleFeed,
  PartyBasketManage,
  PartyBasketRedeem,
]
