const { dashify } = require('../../src/utils/string/dashify')
const { useRender } = require('../utils/useRender')

class App {}

test('app is rendered on the document', () => {

  const createdApp = useRender(/** @type {NueComp} */(App))
  const appInDocument = document.querySelector(dashify(App.name))

  expect(createdApp).toBe(appInDocument)
})
