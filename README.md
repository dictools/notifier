# Getting started
Dictools Notifier - Notifies the development or content team using webhooks to notice when the dictionary keys based on a JSON file have changed. Usually, it is used when the development team has the autonomy to create dictionary keys directly in the code using a fallback file, this way it's not necessary to wait the content team create all keys before writing the code.

## Installation
You can install Dictools Notifier using npm or yarn:

```bash
# npm
npm install @dictools/notifier --save-dev

# yarn
yarn add @dictools/notifier --dev
```

## Usage
**Prerequisites:** 
- [NodeJS](https://nodejs.org/) (>=10.x.x) 
- [Git](https://git-scm.com/) (>= 2.13.x)
- Dictools Notifier should be used along with Git Hooks [ [post-commit](https://git-scm.com/docs/githooks#_post_commit) ] to recover information and compare your dictionary file. The library does not include built-in hooks, we recommend to use a third-party library like [husky](https://github.com/typicode/husky) or [build your own hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

**Script Initializer**

Create a configuration file to start using the `dictools/notifier` and specify your project details.

```js
// notification.js
const Notifier = require("@dictools/notifier");

const notification = new Notifier({
  path: "./i18n/dictionary.json",
  hookUri: "<hooks_api>",
  project: {
    name: "<project_name>",
    boardUrl: "<board_url>",
    key: "<task_key_identifier>"
  }
  /** 
   * Optional Configuration: ( Replacement of Slack notifications )
   * The text includes a few keys(#{key}) that are used to provide the project 
   * details it can be customized as you need
   */
  messages: {
    /** 
     * Replacement key details
     * @param {string} #{project} - Project name
     * @param {string} #{key} - Dictionary key name
     * @param {string} #{type} - It's used to inform which was the changes type (e.g. Added, Changed, Removed)
     * @param {string} #{username} - Git committer name (Git global or locally username)
     * @param {string} #{task} - Task link to the board (e.g. https://jira.acme.com/browse/ACM-0234)
     * @param {string} #{value} - Current content key value
     * @param {string} #{oldValue} - Previous content key value
     */
    title: "Changes to #{project} dictionary key(s):",
    added: {
      description: "Dictionary key #{key} has been #{type}"
      body: "Text: #{value}",
      footer: "#{type} by: #{username} | Task: #{task}"
    },
    changed: {
      description: "Dictionary key *#{key}* has been #{type}"
      body: "From: #{oldValue} To: #{value}",
      footer: "#{type} by: #{username} | Task: #{task}"
    },
    removed: {
      description: "Dictionary key *#{key}* has been #{type}"
      body: "Text: #{value}",
      footer: "#{type} by: #{username} | Task: #{task}"
    }
  }
});

notification.init();
```

## Configuration Object
Options                        | Description                                                                                       | PropTypes
-------------------------------|---------------------------------------------------------------------------------------------------|-----------
path                           | Defines the project's key map path                                                                | String
hookUri                        | [Slack Webhooks](https://api.slack.com/messaging/webhooks) API url                                | String
project.name                   | Project name                                                                                      | String
project.boardUrl               | It is used to link the notification with your project board `(e.g. https://jira.acme.com/browse)` | String
project.key                    | Key is the project identifier that is used to find the task number in a commit message `e.g. feat(blog): ACM-0234 :: add comment section`                                                                                                               | `String: "ACM"`/ `Array: ["ACM", "AMC"]` / `Regex: /(ACM)-[0-9]+/g`
messages.title                 | Slack message title `e.g. Changes to Acme dictionary key(s):`                                     | String
messages.added.description     | Slack message description to added keys `e.g. Dictionary key ticket_0234 has been added`          | String
messages.added.body            | Slack message body to added keys `e.g. Text: Hello World`                                         | String
messages.added.footer          | Slack message footer to added keys `e.g. Added by John Doe | Task: ACM-0234`                      | String
messages.changed.description   | Slack message description to changed keys `e.g. Dictionary key ticket_0234 has been changed`      | String
messages.changed.body          | Slack message body to changed keys `e.g. From: Hello World - To: Hi everyone!`                    | String
messages.changed.footer        | Slack message footer to changed keys `e.g. Changed by John Doe | Task: ACM-0234`                  | String
messages.removed.description   | Slack message description to removed keys `e.g. Dictionary key ticket_0234 has been removed`      | String
messages.removed.body          | Slack message body to removed keys `e.g. Text: Hi everyone!`                                      | String
messages.removed.footer        | Slack message footer to removed keys `e.g. Removed by John Doe | Task: ACM-0234`                  | String

**Configure Git Hooks**

Let's see an example using [Husky](https://github.com/typicode/husky).

```js
// package.json
{
  "husky": {
    "hooks": {
      "post-commit": "node ./notification-script.js"
    }
  }
}
```

## Contributing
Thanks for being interested in helping us to improve the experience for who use this library, we are all ears to listen, if you want to collaborate reporting an issue, feature or something else please use the [issues](https://github.com/dictools/notifier/issues) section using the proper labels to your request, we will answer as soon as we can, thank you!

## License

Dictools Notifier is [MIT licensed](/LICENSE).