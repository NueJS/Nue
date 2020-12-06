import { is_placeholder, unwrap } from '../string/placeholder.js'

// <div id='cool' data-count=[count]> </div>
// returns
/* [
    { id: ['cool', false] },
    { data-count: ['count', true] }
  ]
*/

// function get_attributes (element) {
//   const names = element.getAttributeNames()
//   const attributes = []

//   for (const name of names) {
//     let value = element.getAttribute(name)
//     const is = is_placeholder(value)
//     if (is) value = unwrap(value)
//     attributes.push({ name, value, is_placeholder: is })
//   }

//   return attributes
// }

export default get_attributes
