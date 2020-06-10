import config from "@factories/config";
import GLOBALS from "@constants/globals";

const mock = {};

describe("<root>/factories/config.js", () => {
  beforeEach(() => {
    mock.config = JSON.parse(JSON.stringify(global.notifyConfig));
  });

  test("get() :: Should get config options", () => {
    const received = config.get(mock.config);
    expect(received).toEqual(global.notifyConfig);
  });

  test("get() :: Should get config options using fallback", () => {
    mock.config.path = "";
    mock.config.hookUri = "";
    mock.config.channel = "";
    mock.config.username = "";
    mock.config.project.name = "";
    mock.config.project.boardUrl = "";
    mock.config.project.key = "";
    mock.config.messages.title = "";
    mock.config.messages.added.description = "";
    mock.config.messages.added.body = "";
    mock.config.messages.added.footer = "";
    mock.config.messages.changed.description = "";
    mock.config.messages.changed.body = "";
    mock.config.messages.changed.footer = "";
    mock.config.messages.removed.description = "";
    mock.config.messages.removed.body = "";
    mock.config.messages.removed.footer = "";

    const received = config.get(mock.config);
    expect(received).toEqual({
      path: "",
      hookUri: "",
      username: "",
      channel: "",
      project: {
        name: "",
        boardUrl: "",
        key: "",
      },
      messages: {
        title: GLOBALS.MESSAGES.TITLE,
        added: {
          description: GLOBALS.MESSAGES.ADDED.DESCRIPTION,
          body: GLOBALS.MESSAGES.ADDED.BODY,
          footer: "",
        },
        changed: {
          description: GLOBALS.MESSAGES.CHANGED.DESCRIPTION,
          body: GLOBALS.MESSAGES.CHANGED.BODY,
          footer: "",
        },
        removed: {
          description: GLOBALS.MESSAGES.REMOVED.DESCRIPTION,
          body: GLOBALS.MESSAGES.REMOVED.BODY,
          footer: "",
        },
      },
    });
  });
});
