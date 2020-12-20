import addDep from '../../state/addDep.js'
import { render, supersweet } from '../../../index.js'

function processFor (forNode) {
  const loopComps = []

  const loopInfo = {}

  if (!forNode.hasAttribute('name')) throw new Error('for loopInfo must have a name')
  const name = forNode.getAttribute('name') + '-'

  forNode.sweet.attributes.forEach(attribute => {
    const { name, placeholder } = attribute
    loopInfo[name] = placeholder
  })

  function loopComp ({ html, on }) {
    on.destroy(() => console.log('loopInfo component removed'))
    html(forNode.innerHTML)
  }

  supersweet.components[name] = loopComp

  const init = () => {
    const array = loopInfo.of.getValue.call(this)

    array.forEach((value, i) => {
      const loopCompInstance = document.createElement(name)
      loopComps.push(loopComp)

      loopCompInstance.stateProps = {
        [loopInfo.each.content]: value,
        [loopInfo.at.content]: i
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
