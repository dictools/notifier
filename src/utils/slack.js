import fetch from "node-fetch";
import GLOBALS from "../constants/globals";

const slack = {
  notify: async (hookUri, { text, attachments, channel, username }) => {
    const content = {
      mrkdwn: true,
      channel,
      username,
      text,
      attachments
    }

    await fetch(hookUri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
      .then((response) => {
        if(response.status === 200) {
          console.log(GLOBALS.MESSAGES.HOOK_NOTIFIED)
        } else {
          throw Error(`(${response.status}) ${response.statusText}`);
        }
      })
      .catch(error => console.log(GLOBALS.MESSAGES.HOOK_ERROR, error));
  }
}

export default slack;