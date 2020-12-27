import addDep from '../../state/addDep.js'
import { render } from '../../../index.js'
import globalInfo from '../../../globalInfo.js'
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

  const forName = each.content + '-'

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

  function loopCompFn ({ html }) {
    html(forNode.innerHTML)
  }

  globalInfo.components[forName] = loopCompFn

  const init = () => {
    const array = of.getValue(comp)

    array.forEach((value, i) => {
      const loopComp = document.createElement(forName)
      loopComps.push(loopCompFn)

      loopComp.stateProps = {
        [each.content]: value
      }

      // console.log({ [each.content]: value })

      if (at) {
        loopComp.stateProps[at.content] = i
      }

      comp.deferred.push(() => {
        forNode.before(loopComp)
      })
    })
  }

  init()
  render(forName)

  const onArrayChange = () => {
    console.log('array changed')
  }

  addDep(comp, loopInfo.of.deps[0], onArrayChange, 'dom')

  comp.deferred.push(() => {
    forNode.remove()
  })
}

export default processFor
