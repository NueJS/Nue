import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
// import typescript from '@rollup/plugin-typescript'

const minifier = [
  terser({
    compress: true,
    mangle: {
      properties: {
        regex: /^_/ // mangle properties whose name starts with _
      }
    }
  })
]

// (Node)
const cjsProd = {
  file: './dist/nue.cjs.prod.js',
  format: 'cjs',
  plugins: minifier
}

const cjsDev = {
  file: './dist/nue.cjs.dev.js',
  format: 'cjs'
}

// UMD (Browser + Node)
const umdProd = {
  file: './dist/nue.umd.prod.js',
  format: 'umd',
  plugins: minifier,
  name: 'nue'
}

const umdDev = {
  file: './dist/nue.umd.dev.js',
  format: 'umd',
  name: 'nue'
}

const es = {
  file: './dist/nue.es.js',
  format: 'es',
  plugins: minifier
}

const outputs = {
  cjsProd,
  cjsDev,
  umdProd,
  umdDev,
  es
}

export default info => {
  let replaceValues = {
    _DEV_: Boolean(info.dev)
  }

  if (info.bundle === 'es') {
    replaceValues = {
      _DEV_: "process.env.NODE_ENV !== 'production'"
    }
  }
  return {
    input: './src/index.js',
    output: outputs[info.bundle],
    plugins: [
      replace({
        values: replaceValues
      })
    ]
  }
}
