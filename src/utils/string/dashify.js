export const dashify = s => s + '-'

export const dashifyComponentNames = (html, components) =>
  components.reduce(
    (acc, comp) => acc.replace(new RegExp(`<${comp.name}|</${comp.name}`, 'g'), dashify),
    html
  )
