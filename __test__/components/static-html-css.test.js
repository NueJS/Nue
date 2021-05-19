import { dashify } from "../../src/string/dashify"
import { useRender } from "../utils/useRender"

const innerHTML = /* html */`
this is inner html
<div>       this is a div </div><p> this is a paragraph      </p>`

const scopedCSS = /* css */`
:host {
  color: red;
  background: blue
}
`

class App {
  html = innerHTML
  css = scopedCSS
}

test('app is rendered on the document', () => {

  const createdApp = useRender(/** @type {NueComp} */(App))
  const root = /** @type {ShadowRoot}*/(createdApp.shadowRoot)

  const expectedHTML = innerHTML + `<style scoped="">${scopedCSS}</style>`

  expect(root.innerHTML).toBe(expectedHTML)
})
