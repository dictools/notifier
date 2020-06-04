const parser = {
  data: {
    added: [],
    removed: [],
    changed: []
  },
  factoryObject: (key = "", value = "", oldValue = "") => ({
    key,
    value,
    ...(oldValue && { oldValue })
  }),
  stringToObject: (line) => {
    const pattern = /\"(.*?)\"/g;
    const keyValuePair = (line.match(pattern) || []).map(value => value.replace(/\"/g, ''));
    return parser.factoryObject(keyValuePair[0], keyValuePair[1]);
  },
  parse: (diff) => {
    const removedKeys = diff.match(/^-\s.*/gm) || [];
    const addedKeys = diff.match(/^\+\s.*/gm) || [];

    if (removedKeys.length > 0) {
      const removedLine = removedKeys.map(line => parser.stringToObject(line));
      parser.data.removed.push(...removedLine)
    }
  
    if (addedKeys.length > 0) {
      addedKeys.forEach(line => {
        const addedLine = parser.stringToObject(line);
        const removedLineIndex = parser.data.removed.findIndex(item => item.key === addedLine.key);
  
        if (removedLineIndex >= 0) {
          const oldValue = parser.data.removed[removedLineIndex].value;
  
          if (addedLine.value !== oldValue) {
            const changedLine = parser.factoryObject(addedLine.key, addedLine.value, oldValue)
            parser.data.changed.push(changedLine);
          }
  
          parser.data.removed.splice(removedLineIndex, 1);
        }
        else {
          parser.data.added.push(addedLine);
        }
      });
    }

    return parser.data;
  }
}

export default parser;