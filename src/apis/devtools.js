const devtools = {
  showUpdates: false,
  onNodeUpdate: (cb) => {
    if (devtools.showUpdates) cb()
  }
}

export default devtools
