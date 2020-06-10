import slack from "@utils/slack";
import string from "@utils/string";
import { IncomingWebhook } from "@slack/webhook";
import GLOBALS from "@constants/globals";

jest.mock("@slack/webhook");

const mock = {
  message: {
    mrkdwn: true,
    channel: "#acme-alert",
    username: "Acme Project",
    text: "Slack notification title",
    attachments: [],
  },
};

describe("<root>/utils/slack.js", () => {
  beforeEach(() => {
    IncomingWebhook.mockClear();

    ["log", "error"].forEach(item => {
      console[item] = jest.fn();
      console[item].mockClear();
    });
  });

  test("notify() :: Should send slack notification", async () => {
    IncomingWebhook.mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({ test: "ok" }),
    }));

    await slack.notify(global.notifyConfig.hookUri, mock.message);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(GLOBALS.MESSAGES.HOOK_NOTIFIED);
  });

  test("notify() :: Should not send slack notification", async () => {
    IncomingWebhook.mockImplementation(() => ({
      send: jest.fn().mockRejectedValue({
        code: "error_code",
        original: { message: "Error message" },
      }),
    }));

    await slack.notify(global.notifyConfig.hookUri, mock.message);

    const expected = string.replace(GLOBALS.MESSAGES.HOOK_ERROR, {
      code: "error_code",
      message: "Error message",
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(expected);
  });
});
