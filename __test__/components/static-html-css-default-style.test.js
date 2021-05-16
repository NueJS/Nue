const { dashify } = require('../../src/string/dashify')
const { useRender } = require('../utils/useRender')

const innerHTML = /* html */`
this is inner html
<div>       this is a div </div><p> this is a paragraph      </p>`

const scopedCSS = /* css */`
:host {
  color: red;
  background: blue;
}
`

const defaultStyle = /* css */`
:host {
  display: block;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
`

const config = { defaultStyle }


class App {
  html = innerHTML
  css = scopedCSS
}

test('app is rendered on the document', () => {

  const createdApp = useRender(/** @type {NueComp} */(App), config)
  const root = /** @type {ShadowRoot}*/(createdApp.shadowRoot)

  const expectedHTML =
    innerHTML +
    `<style default="">${defaultStyle}</style>` +
    `<style scoped="">${scopedCSS}</style>`

  expect(root.innerHTML).toBe(expectedHTML)
})
