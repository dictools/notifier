import GLOBALS from "../constants/globals";

const string = {
  capitalize: (text) => text.replace(/^\w/, char => char.toUpperCase()),
  replace: (text = "", replacements = {}) => {
    const pattern = /#\{(.*?)\}/g;
    const keys = text.match(pattern) || [];
    return keys.reduce((acc, key) => {
      const pureKey = key.replace(pattern, '$1');
      const replacement = replacements[pureKey] || key;
      return acc.replace(key, replacement);
    }, text);
  },
  getTask: (message = "", project = {}) => {
    const isRegExp = /^\/.*?\/[a-z]{0,6}$/.test(String(project.key));
    const projectKey = Array.isArray(project.key) ? project.key : [project.key];
    const pattern = isRegExp ? projectKey[0] : new RegExp(`(${projectKey.join('|')})-[0-9]+`, 'g');
    const tasks = message.match(pattern);

    if (tasks && project.boardUrl) {
      return tasks
        .map(task => string.replace(GLOBALS.CORE.TASK, { url: project.boardUrl, task: task }))
        .join(tasks.length > 1 && ' / ');
    }

    return;
  },
  getAttachmentFormatted: (line, type, commit, config) => {
    const changeType = type.toUpperCase();
    const task = string.getTask(commit.message, config.project);

    const description = string.replace(
      config.messages[type].description,
      { key: line.key, type }
    );

    const body = string.replace(
      config.messages[type].body,
      { value: line.value, oldValue: line.oldValue }
    );

    const footer = string.replace(
      config.messages[type]?.footer || (
        task 
          ? GLOBALS.MESSAGES.FOOTER_WITH_TASK 
          : GLOBALS.MESSAGES.FOOTER
      ),
      { 
        type: string.capitalize(type),
        username: commit.username,
        task
      }
    );

    return {
      type,
      color: GLOBALS.COLORS[changeType],
      text: `${description}\n${body}`,
      footer
    }
  }
}

export default string;