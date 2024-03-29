const type = value => {
  return value && Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1];
};

const stringToPath = path => {
  const pattern = /\[([0-9]+)\]/g;
  if (pattern.test(path)) return path.replace(pattern, ".$1").split(".");
  return path.split(".");
};

export const _get = (source, path, defaultArgument) => {
  return (
    stringToPath(path).reduce((nestedObject, key) => {
      return nestedObject && key in nestedObject ? nestedObject[key] : void 0;
    }, source) || defaultArgument
  );
};

export const normalizeStringToJSON = str => {
  if (type(str) === "String") {
    const stringNormalized = str
      .replace(
        /"?([\w_\- ]+)"?\s*?:\s*?"?(.*?)"?\s*?([,}\]])/gis,
        (str, index, item, end) => '"' + index.replace(/"/gis, "").trim() + '":"' + item.replace(/"/gis, "").trim() + '"' + end
      )
      .replace(/,\s*?([}\]])/gis, "$1")
      .replace(/'/g, "");
    return JSON.parse(stringNormalized);
  }

  return str;
};
