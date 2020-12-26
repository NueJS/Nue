import addDep from '../../state/addDep.js'
import { render, supersweet } from '../../../index.js'
import err from '../../dev/error.js'
import DEV from '../../dev/DEV.js'

function processFor (comp, forNode) {
  const loopComps = []

  const loopInfo = {}

  forNode.sweet.attributes.forEach(attribute => {
    const { name, placeholder } = attribute
    loopInfo[name] = placeholder
  })

  const { each, of, at } = loopInfo

  let forName = forNode.getAttribute('name')

  if (DEV) {
    if (!forName) {
      err({
        message: 'for loop is missing "name" attribute',
        code: 3,
        link: ''
      })
    }

    if (!each) {
      err({
        message: 'for loop is missing "each" attribute',
        code: 1,
        link: ''
      })
    }

    if (!of) {
      err({
        message: 'for loop is missing "of" attribute',
        code: 2,
        link: ''
      })
    }
  }

  forName += '-'

  function loopComp ({ html }) {
    html(forNode.innerHTML)
  }

  supersweet.components[forName] = loopComp

  const init = () => {
    const array = of.getValue(comp)

    array.forEach((value, i) => {
      const loopCompInstance = document.createElement(forName)
      loopComps.push(loopComp)

      loopCompInstance.stateProps = {
        [each.content]: value
      }

      if (at) {
        loopCompInstance.stateProps[at.content] = i
      }

      comp.delayedProcesses.push(() => {
        forNode.before(loopCompInstance)
      })
    })
  }

  init()
  render(forName)

  const onArrayChange = () => {
    console.log('array changed')
  }

  addDep(comp, loopInfo.of.deps[0], onArrayChange, 'dom')

  comp.delayedProcesses.push(() => {
    forNode.remove()
  })
}

export default processFor
