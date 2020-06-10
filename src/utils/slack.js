import { IncomingWebhook } from "@slack/webhook";
import GLOBALS from "../constants/globals";
import string from "./string";

const slack = {
  notify: async (hookUri, { text, attachments, channel, username }) => {
    const content = {
      mrkdwn: true,
      channel,
      username,
      text,
      attachments
    }
    
    const webhook = new IncomingWebhook(hookUri);

    await webhook.send(content)
      .then(() => console.log(GLOBALS.MESSAGES.HOOK_NOTIFIED))
      .catch(error => {
        const message = string.replace(GLOBALS.MESSAGES.HOOK_ERROR, {
          code: error.code,
          ...(error?.original?.message && { message: error?.original?.message })
        });

        console.error(message);
      });
  }
}

export default slack;