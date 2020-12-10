const comparison = {
  true: v => v === true,
  false: v => v === false,
  truthy: v => !!v,
  falsy: v => !v
}

const satisfies = (value, type) => type === undefined ? true : comparison[type](value)

export default satisfies
