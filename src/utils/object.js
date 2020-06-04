const stringToPath = (path) => {
  const pattern = /\[([0-9]+)\]/g;
  if (pattern.test(path)) return path.replace(pattern, '.$1').split('.');
  return path.split('.');
};

export const _get = (source, path, defaultArgument) => {
  return stringToPath(path).reduce((nestedObject, key) => {
    return nestedObject && key in nestedObject ? nestedObject[key] : void 0;
  }, source) || defaultArgument;
};

export const normalizeStringToJSON = (str) => {
  const stringNormalized = str.replace(/"?([\w_\- ]+)"?\s*?:\s*?"?(.*?)"?\s*?([,}\]])/gsi, (str, index, item, end) => '"' + index.replace(/"/gsi, '').trim() + '":"' + item.replace(/"/gsi, '').trim() + '"' + end).replace(/,\s*?([}\]])/gsi, '$1').replace(/\'/g, '');
  return JSON.parse(stringNormalized);
}