import { upper } from '../others'
import dashify from './dashify'

const transformTemplate = (nue) => {
  const children = nue.component.uses
  if (!children) return

  const mapping = children.map(comp => {
    const from = comp.name
    const to = dashify(comp.name)
    // mark this nodeName as a component
    nue.memo.childComps[upper(to)] = true
    return ({ from, to })
  })

  let t = nue.templateHTML
  mapping.forEach((m) => {
    t = t.replace(new RegExp('<' + m.from, 'g'), '<' + m.to)
    t = t.replace(new RegExp(m.from + '>', 'g'), m.to + '>')
  })

  nue.templateHTML = t
}

export default transformTemplate
