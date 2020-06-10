Object.assign(global, {
  notifyConfig: {
    path: "dictionary.json",
    hookUri: "https://hooks.slack.com/services/mock",
    username: "John Doe",
    channel: "#acme-keys",
    project: {
      name: "Acme App",
      boardUrl: "https://jira.acme.com/browse",
      key: "ACM"
    },
    messages: {
      title: "Changes to #{project} dictionary key(s):",
      added: {
        description: "Dictionary key #{key} has been #{type}",
        body: "Text: #{value}",
        footer: "#{type} by: #{username} | Task: #{task}"
      },
      changed: {
        description: "Dictionary key #{key} has been #{type}",
        body: "From: #{oldValue} - To: #{value}",
        footer: "#{type} by: #{username}"
      },
      removed: {
        description: "Dictionary key #{key} has been #{type}",
        body: "Text: #{value}",
        footer: "#{type} by: #{username}"
      }
    }
  },
  gitCommitDetails: {
    hash: '5629807',
    subject: 'commit: ACM-0234 :: Dictionary update',
    parents: '341865c',
    message: 'ACM-0234 :: Dictionary update',
    username: 'John Doe',
    email: 'john.doe@acme.com'
  },
  gitCommit: {
    isMerge: false,
    isAmend: false,
    isRebase: false,
    username: "John Doe",
    message: "ACM-0234 :: Initial commit changes"
  },
  gitDiff: `
    diff --git a/dictionary.json b/dictionary.json
    index cbff224..78fe51e 100644
    --- a/dictionary.json
    +++ b/dictionary.json
    @@ -6,5 +6,6 @@
      "addtocalendar_001": "Yahoo",
      "addtocalendar_002": "Google",
      "addtocalendar_003": "Apple",
    -  "key_0002": "Test - No, continue! % = + ) ( | / \\ _scanning* ' || [{]} ? > < .[!]~ Just, $ & ^ - testing, more, commas."
    +  "key_0002": "Test - No, continue! - testing, more, commas.",
    +  "key_0010": "Test",
    -  "key_0011": "Home Page"
    }
    \\ No newline at end of file
  `,
  gitKeysParsed: {
    "added": [{
      "key": "key_0010",
      "value": "Test"
    }],
    "removed": [{
      "key": "key_0011",
      "value": "Home Page"
    }],
    "changed": [{
      "key": "key_0002",
      "value": "Test - No, continue! - testing, more, commas.",
      "oldValue": "Test - No, continue! % = + ) ( | / \\ _scanning* ' || [{]} ? > < .[!]~ Just, $ & ^ - testing, more, commas."
    }]
  },
  slackMessage: {
    "channel": "#acme-keys",
    "username": "John Doe",
    "text": "Changes to Acme App dictionary key(s):",
    "attachments": [
      {
        "type": "added",
        "color": "#178667",
        "text": "Dictionary key key_0010 has been added\nText: Test",
        "footer": "Added by: John Doe | Task: <https://jira.acme.com/browse/ACM-0234|ACM-0234>"
      },
      {
        "type": "removed",
        "color": "#D73645",
        "text": "Dictionary key key_0011 has been removed\nText: Home Page",
        "footer": "Removed by: John Doe"
      },
      {
        "type": "changed",
        "color": "#FEC621",
        "text": "Dictionary key key_0002 has been changed\nFrom: Test - No, continue! % = + ) ( | / \\ _scanning* ' || [{]} ? > < .[!]~ Just, $ & ^ - testing, more, commas. - To: Test - No, continue! - testing, more, commas.",
        "footer": "Changed by: John Doe"
      }
    ]
  }
})