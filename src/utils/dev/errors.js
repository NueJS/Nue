import err from './error'

export default {
  TEXTNODE_DIRECT_CHILD_OF_IF (comp) {
    err({
      comp,
      message: 'TEXT_NODE can\'t be direct child of <if>, \nwrap it inside <span>.'
    })
  },

  RENDER_CALLED_BEFORE_DEFINE (name) {
    err({
      message: `Tried to render <${name}> before it is defined. \ndefine({ ... }) first and then call render("${name}")`
    })
  }
}
