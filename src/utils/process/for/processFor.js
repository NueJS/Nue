import addDep from '../../state/addDep.js'
import { render, supersweet } from '../../../index.js'
import err from '../../dev/error.js'

function processFor (forNode) {
  const loopComps = []

  const loopInfo = {}

  forNode.sweet.attributes.forEach(attribute => {
    const { name, placeholder } = attribute
    loopInfo[name] = placeholder
  })

  const { each, of, at } = loopInfo

  let forName = forNode.getAttribute('name')
  if (!forName) {
    throw err({
      message: 'for loop is missing "name" attribute',
      code: 3,
      link: ''
    })
  }
  forName += '-'

  const name = forName

  if (DEV && !each) {
    throw err({
      message: 'for loop is missing "each" attribute',
      code: 1,
      link: ''
    })
  }

  if (DEV && !of) {
    throw err({
      message: 'for loop is missing "of" attribute',
      code: 2,
      link: ''
    })
  }

  function loopComp ({ html }) {
    html(forNode.innerHTML)
  }

  supersweet.components[name] = loopComp

  const init = () => {
    const array = of.getValue.call(this)

    array.forEach((value, i) => {
      const loopCompInstance = document.createElement(name)
      loopComps.push(loopComp)

      loopCompInstance.stateProps = {
        [each.content]: value
      }

      if (at) {
        loopCompInstance.stateProps[at.content] = i
      }

      this.delayedProcesses.push(() => {
        forNode.before(loopCompInstance)
      })
    })
  }

  init()
  render(name)

  const onArrayChange = () => {
    console.log('array changed')
  }

  addDep.call(this, loopInfo.of.deps[0], onArrayChange, 'dom')

  this.delayedProcesses.push(() => {
    forNode.remove()
  })
}

export default processFor
