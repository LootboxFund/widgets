import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import replace from '@rollup/plugin-replace';

const configESM = {
  input: ["src/index.ts"],
  output: {
    dir: "lib",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    typescript(),       // enable TypeScript
    commonjs(),         // enable CommonJS modules
    resolve(),          // enable importing from node_modules
    json(),             // enable JSON    
    globals(),          // allows globals to be imported (process.env)
    builtins(),          // allows builtins to be imported via require/import
  ],
  external: ["react"],
};
if (process.env.NODE_ENV === 'production') {
  configESM.plugins.push(terser());  // enable minification  
}

const configUMD = {
  input: ["src/index.ts"],
  output: {
    dir: "umd",
    format: "umd",
    sourcemap: true,
    name: "GuildFX_UI",
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    typescript(),       // enable TypeScript
    commonjs(),         // enable CommonJS modules
    resolve(),          // enable importing from node_modules
    json(),             // enable JSON    
    globals(),          // allows globals to be imported (process.env)
    builtins(),          // allows builtins to be imported via require/import
  ],
  external: ["react"],
}
if (process.env.NODE_ENV === 'production') {
  configUMD.plugins.push(terser());  // enable minification  
}

export default [configESM, configUMD];