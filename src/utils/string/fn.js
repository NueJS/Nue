// import slice from '../slice/slice.js'

// // if the string inside the placeholder uses () it uses function
// export const uses_fn = (content) => content.includes('(') && content.includes('(')

// function process_fn (str) {
//   const space_removed = str.replaceAll(' ', '')
//   const [fn_name, args_str] = space_removed.split('(')
//   const args_comma = args_str.substr(0, args_str.length - 1)
//   const args = args_comma.split(',')
//   return [fn_name, args]
// }

// export function add_fn_deps (content) {
//   const [fn_name, args] = process_fn(content)
//   const slices = args.map(a => a.split('.'))
//   if (this.fn[fn_name]) {
//     return {
//       fn_name,
//       deps: slices,
//       deps_joined: args,
//       call_fn: function () {
//         const values = slices.map(path => slice(this.$, path))
//         const value = this.fn[fn_name](...values)
//         return value
//       }
//     }
//   }
// }

// export default process_fn
