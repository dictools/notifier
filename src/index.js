import git from "./utils/git";
import parser from "./utils/parser";
import string from "./utils/string";
import slack from "./utils/slack";
import GLOBALS from "./constants/globals";
import * as objectUtils from "./utils/object";
import config from "./factories/config";

class Notifier {
  constructor(options = {}) {
    this.config = config.get(options);
  }

  validate = () => {
    const config = this.config;

    const validation = Object.entries(GLOBALS.MESSAGES.VALIDATIONS).reduce(
      (acc, item) => {
        const [path, message] = item;
        const data = objectUtils._get(config, path);

        if (!data) {
          return {
            ...acc,
            isValid: false,
            messages: [...acc.messages, message],
          };
        }

        return acc;
      },
      { isValid: true, messages: [] }
    );

    return validation;
  };

  init = async () => {
    const config = this.config;
    const validation = this.validate();

    if (validation.isValid) {
      const commit = await git.getCommitDetails();
      const diff = parser.parse(await git.diff(config.path));
      const haveKeysChanged = Object.values(diff).some(item => item.length);

      if (commit.isRebase || commit.isMerge || (!haveKeysChanged && commit.isAmend)) return false;

      if (haveKeysChanged) {
        const title = string.replace(config.messages.title, {
          project: config.project.name,
        });

        const attachments = Object.keys(diff).reduce((acc, key) => {
          if (diff[key].length) {
            return [...acc, ...diff[key].map(line => string.getAttachmentFormatted(line, key, commit, config))];
          }

          return acc;
        }, []);

        slack.notify(config.hookUri, {
          channel: config.channel,
          username: config?.username || config?.project?.name,
          text: title,
          attachments,
        });
      } else {
        console.log(GLOBALS.MESSAGES.KEYS_UP_TO_DATE);
      }
    } else {
      validation.messages.forEach(error => console.error(`ERROR: ${error}`));
    }
  };
}

export default Notifier;
