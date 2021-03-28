## 🛠 Build Files

### 🌌 UMD

UMD builds can be used directly in the browser via a `<script>` tag

`nue.umd.dev.js` and `nue.umd.prod.js` are umd bundles which can be used directly in browser


### 📦 CJS

CommonJS builds are for older bundlers that expects cjs modules and can not work with ES modules

`nue.cjs.js` is specified in `main` property of the `package.json` so that older bundlers can use it

`nue.cjs.js` exports either `nue.cjs.dev.js` or `nue.cjs.prod.js` based on the the value of `process.env.NODE_ENV`


### ⚡ ES

ES module builds are for modern bundlers that can work with ESM.

`nue.es.js` is ES build of nue.js which is specified in `module` property of `package.json` so that modern bundlers can use it

`nue.es.js` is minified for the purpose of reducing the bundle size as much as possible, by mangling the props using terser.

While in source code nue.js uses `_DEV_` to write development only code, it is replaced with `process.env.NODE_ENV !== "production"` in the `nue.es.js` instead to support bundlers that we can not configure to replace `_DEV_` with `true/false` such as skypack, jsdelivr and other cdn services.

Application that uses nue.js needs to replace `process.env.NODE_ENV` to `"production"` to generate a production build.

### Example: Rollup

```js
import replace from 'rollup-plugin-replace'

// for creating a production build
export default {
    ...

    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })

      ...
    ]
  }
}


```
