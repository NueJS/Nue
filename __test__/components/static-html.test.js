import { useRender } from "../utils/useRender"

const innerHTML = /* html */`
this is inner html
<div>       this is a div </div><p> this is a paragraph      </p>`


class App {
  html = innerHTML
}

test('app is rendered on the document', () => {

  const createdApp = useRender(/** @type {NueComp} */(App))
  const root = /** @type {ShadowRoot}*/(createdApp.shadowRoot)

  expect(root.innerHTML).toBe(innerHTML)
})
