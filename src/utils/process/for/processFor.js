// import sweetify from '../../node/sweetify.js'
// import traverse from '../../node/traverse.js'
import addDep from '../../state/addDep.js'
// import processNode from '../processNode.js'
// import slice from '../../state/slice.js'
import { render, supersweet } from '../../../index.js'
// import { STATE } from '../../constants.js'

function processFor (forNode) {
  const forNodes = []
  const groups = []

  let $each, $of, $at, $hash

  if (!forNode.hasAttribute('name')) throw new Error('for loop must have a name')
  const name = forNode.getAttribute('name') + '-'

  forNode.sweet.attributes.forEach(attribute => {
    if (attribute.name === 'each') $each = attribute.placeholder
    else if (attribute.name === 'of') $of = attribute.placeholder
    else if (attribute.name === '#') $hash = attribute.placeholder
    else if (attribute.name === 'at') $at = attribute.placeholder
  })

  function loopComponent ({ html, on }) {
    on.destroy(() => console.log('loop component removed'))
    html(forNode.innerHTML)
  }

  supersweet.components[name] = loopComponent

  const renderLoop = () => {
    const array = $of.getValue.call(this, forNode)

    array.forEach((value, i) => {
      const loopComponentInstance = document.createElement(name)

      loopComponentInstance.stateProps = {
        [$each.content]: value,
        [$at.content]: i
      }

      this.delayedProcesses.push(() => {
        forNode.before(loopComponentInstance)
      })
    })
  }

  renderLoop()
  render(name)

  const onArrayChange = () => {
    console.log('array changed')
  }

  addDep.call(this, $of.path, onArrayChange, 'dom')

  this.delayedProcesses.push(() => {
    forNode.remove()
  })
}

export default processFor
