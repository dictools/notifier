const parser = {
  factoryObject: (key = "", value = "", oldValue) => ({
    key,
    value,
    ...(oldValue && { oldValue }),
  }),
  stringToObject: line => {
    const pattern = /"(.*?)"/g;
    const keyValuePair = (line.match(pattern) || []).map(value => value.replace(/"/g, ""));
    return parser.factoryObject(keyValuePair[0], keyValuePair[1]);
  },
  parse: diff => {
    const mapper = {
      added: [],
      removed: [],
      changed: [],
    };

    // Trimming spaces from the beginning of the string
    const data = String(diff).replace(/^\s+/gm, "");
    const removedKeys = data.match(/^-\s.*/gm) || [];
    const addedKeys = data.match(/^\+\s.*/gm) || [];

    if (removedKeys.length > 0) {
      const removedLine = removedKeys.map(line => parser.stringToObject(line));
      mapper.removed.push(...removedLine);
    }

    if (addedKeys.length > 0) {
      addedKeys.forEach(line => {
        const addedLine = parser.stringToObject(line);
        const removedLineIndex = mapper.removed.findIndex(item => item.key === addedLine.key);

        if (removedLineIndex >= 0) {
          const oldValue = mapper.removed[removedLineIndex].value;

          if (addedLine.value !== oldValue) {
            const changedLine = parser.factoryObject(addedLine.key, addedLine.value, oldValue);
            mapper.changed.push(changedLine);
          }

          mapper.removed.splice(removedLineIndex, 1);
        } else {
          mapper.added.push(addedLine);
        }
      });
    }

    return mapper;
  },
};

export default parser;
