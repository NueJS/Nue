const getSlice = (state, key) => {
  const split = key.split('.');
  if (split.length === 1) return state[key];
  else {
    let value = state;
    split.forEach((k) => {
      value = value[k];
    });
    return value;
  }
};

export default getSlice;
