const GLOBALS = {
  COLORS: {
    ADDED: '#178667',
    CHANGED: '#FEC621',
    REMOVED: '#D73645',
    DEFAULT: '#22A1D4'
  },
  CORE: {
    TASK: '<#{url}/#{task}|#{task}>'
  },
  MESSAGES: {
    TITLE: '_Changes to #{project} dictionary key(s):_\n\n',
    FOOTER: '*#{type} by:* #{username}',
    FOOTER_WITH_TASK: '*#{type} by:* #{username} | *Task:* #{task}',
    ADDED: {
      DESCRIPTION: 'Dictionary key *#{key}* has been #{type}',
      BODY: '*Text:* #{value}'
    },
    CHANGED: {
      DESCRIPTION: 'Dictionary key *#{key}* has been #{type}',
      BODY: '*From:* #{oldValue}\n*To:* #{value}'
    },
    REMOVED: {
      DESCRIPTION: 'Dictionary key *#{key}* has been #{type}',
      BODY: '*Text:* #{value}'
    },
    KEYS_UP_TO_DATE: '\n\x1b[32m[Notifier] Dictionary keys are up to date.\x1b[0m\n',
    HOOK_NOTIFIED: '\n\x1b[32m[Notifier] Changes were notified.\x1b[0m\n',
    HOOK_ERROR: '\n\x1b[31m[Notifier] Error: Changes were not notified an error has occurred.\x1b[0m\n'
  }
}

export default GLOBALS;