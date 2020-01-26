
export const camelToSnakeCase = str => (
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
);

export const _parseObject = obj => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [camelToSnakeCase(key), value];
    })
  );
};