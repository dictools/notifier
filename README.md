<p align="center">
  <a href="https://github.com/dictools/notifier">
    <img alt="Dictools Notifier" src="./.github/dictools-notifier-logo@2x.png" width="335">
  </a>
</p>

<br />

<p align="center">
  <a href="https://github.com/dictools/notifier/blob/master/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/dictools/notifier?color=027EC5&style=flat-square"
    />
  </a>
  
  <a href="https://circleci.com/gh/dictools/notifier">
    <img alt="CircleCI" src="https://img.shields.io/circleci/build/github/dictools/notifier/master?style=flat-square"
    />
  </a>

  <a href='https://coveralls.io/github/dictools/notifier?branch=master'>
    <img alt="Coveralls Status" src="https://img.shields.io/coveralls/github/dictools/notifier?style=flat-square"
    />
  </a>

  <a href="https://github.com/dictools/notifier#contributing">
    <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square"
    />
  </a>
</p>

## Getting started
Dictools Notifier is a tool used to notifies development/content team using a [slack webhook](https://api.slack.com/messaging/webhooks) based on a JSON file. Usually, it is used when the development team has the autonomy to create i18n dictionary keys directly in the code using a fallback file, this way it's not necessary to await the content team create the keys before writing the code.

## Installation
Dictools Notifier can be installed using npm or yarn:

```bash
# npm
npm install @dictools/notifier --save-dev

# yarn
yarn add @dictools/notifier --dev
```

## Usage
**Prerequisites:** 
- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [NodeJS](https://nodejs.org/) (>=10.x.x) 
- [Git](https://git-scm.com/) (>= 2.13.x)
- Dictools Notifier should be used along with Git Hooks [ [post-commit](https://git-scm.com/docs/githooks#_post_commit) ] to recover information and compare your dictionary file. The library does not include built-in hooks, we recommend to use a third-party library like [husky](https://github.com/typicode/husky) or [build your own hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

**Script Initializer**

Create a configuration file to start using `dictools/notifier`. The message can be formatted using the attachment format provided by slack, to know more details please check out the [documentation](https://api.slack.com/docs/messages/builder?msg=%7B%22attachments%22%3A%5B%7B%22fallback%22%3A%22Required%20plain-text%20summary%20of%20the%20attachment.%22%2C%22color%22%3A%22%2336a64f%22%2C%22pretext%22%3A%22Optional%20text%20that%20appears%20above%20the%20attachment%20block%22%2C%22author_name%22%3A%22Bobby%20Tables%22%2C%22author_link%22%3A%22http%3A%2F%2Fflickr.com%2Fbobby%2F%22%2C%22author_icon%22%3A%22http%3A%2F%2Fflickr.com%2Ficons%2Fbobby.jpg%22%2C%22title%22%3A%22Slack%20API%20Documentation%22%2C%22title_link%22%3A%22https%3A%2F%2Fapi.slack.com%2F%22%2C%22text%22%3A%22Optional%20text%20that%20appears%20within%20the%20attachment%22%2C%22fields%22%3A%5B%7B%22title%22%3A%22Priority%22%2C%22value%22%3A%22High%22%2C%22short%22%3Afalse%7D%5D%2C%22image_url%22%3A%22http%3A%2F%2Fmy-website.com%2Fpath%2Fto%2Fimage.jpg%22%2C%22thumb_url%22%3A%22http%3A%2F%2Fexample.com%2Fpath%2Fto%2Fthumb.png%22%2C%22footer%22%3A%22Slack%20API%22%2C%22footer_icon%22%3A%22https%3A%2F%2Fplatform.slack-edge.com%2Fimg%2Fdefault_application_icon.png%22%2C%22ts%22%3A123456789%7D%5D%7D).

```js
// notification.js
const Notifier = require("@dictools/notifier");

const notification = new Notifier({
  path: "dictionary.json", // JSON file only
  hookUri: "https://hooks.slack.com/services/<api_token>",
  channel: "#acme-keys", // Optional
  username: "Acme", // Optional
  project: {
    name: "Acme App",
    boardUrl: "https://jira.acme.com/browse",
    key: "ACM" // (e.g. Task number ACM-0234)
  }
  /** 
   * Optional Configuration: ( Slack message replacement )
   * Text has available replacement keys that is used to get information from the project or git diff
   * and it can be customized as you need.
   */
  messages: {
    /** 
     * Check out the available text keys
     * @param {string} #{project} - Project name
     * @param {string} #{key} - Dictionary key name
     * @param {string} #{type} - Git change type (e.g. Added, Changed, Removed)
     * @param {string} #{username} - Git committer name (Global or locally git username)
     * @param {string} #{task} - Task link for the board (e.g. https://jira.acme.com/browse/ACM-0234)
     * @param {string} #{value} - Current content key value
     * @param {string} #{oldValue} - Previous content key value
     */
    title: "Changes to #{project} dictionary key(s):",
    added: {
      description: "Dictionary key #{key} has been #{type}",
      body: "Text: #{value}",
      footer: "#{type} by: #{username} | Task: #{task}"
    },
    changed: {
      description: "Dictionary key *#{key}* has been #{type}",
      body: "From: #{oldValue} To: #{value}",
      footer: "#{type} by: #{username} | Task: #{task}"
    },
    removed: {
      description: "Dictionary key *#{key}* has been #{type}",
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
channel (Optional)             | Slack channel where will be posted the notification                                               | String
username (Optional)            | Slack username that will be used to post the notification                                         | String
project.name                   | Project name                                                                                      | String
project.boardUrl               | It is used to link the notification with your project board `(e.g. https://jira.acme.com/browse)` | String
project.key                    | Key is the project identifier used to find a task number in a commit message `e.g. feat(blog): ACM-0234 :: add comment section`                                                                                                               | `String: "ACM"`/ `Array: ["ACM", "AMC"]` / `Regex: /(ACM)-[0-9]+/g`
messages.title                 | Slack message title `e.g. Changes to Acme dictionary key(s):`                                     | String
messages.added.description     | Slack message description to added keys `e.g. Dictionary key ticket_0234 has been added`          | String
messages.added.body            | Slack message body to added keys `e.g. Text: Hello World`                                         | String
messages.added.footer          | Slack message footer to added keys `e.g. Added by John Doe - Task: ACM-0234`                      | String
messages.changed.description   | Slack message description to changed keys `e.g. Dictionary key ticket_0234 has been changed`      | String
messages.changed.body          | Slack message body to changed keys `e.g. From: Hello World - To: Hi everyone!`                    | String
messages.changed.footer        | Slack message footer to changed keys `e.g. Changed by John Doe - Task: ACM-0234`                  | String
messages.removed.description   | Slack message description to removed keys `e.g. Dictionary key ticket_0234 has been removed`      | String
messages.removed.body          | Slack message body to removed keys `e.g. Text: Hi everyone!`                                      | String
messages.removed.footer        | Slack message footer to removed keys `e.g. Removed by John Doe - Task: ACM-0234`                  | String

**Configure Git Hooks**

Let's see an example using [Husky](https://github.com/typicode/husky).

```js
// package.json
{
  "husky": {
    "hooks": {
      "post-commit": "node ./notification.js"
    }
  }
}
```

## Contributing
Thanks for being interested in helping us to improve the experience for who use this library, we are all ears to listen, if you want to collaborate reporting an issue, feature or something else please use the [issues](https://github.com/dictools/notifier/issues) section using the proper labels to your request, we will answer as soon as we can, thank you!

## License

Dictools Notifier is [MIT licensed](/LICENSE).