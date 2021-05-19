import { dashify } from "../../src/string/dashify"
import { useRender } from "../utils/useRender"

class App {}

test('app is rendered on the document', () => {

  const createdApp = useRender(/** @type {NueComp} */(App))
  const appInDocument = document.querySelector(dashify(App.name))

  expect(createdApp).toBe(appInDocument)
})
