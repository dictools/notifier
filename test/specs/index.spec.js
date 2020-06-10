import Notifier from "@root/src/index";
import GLOBALS from "@constants/globals";
import git from "@utils/git";
import parser from "@utils/parser";
import slack from "@utils/slack";

jest.mock("@utils/git");
jest.mock("@utils/parser");
jest.mock("@utils/slack", () => ({
  notify: jest.fn(),
}));

const mock = {
  setGitMock: (method, value, isRejected) => {
    const mockFn = git[method];
    if (mockFn) {
      if (isRejected) mockFn.mockRejectedValue(value);
      mockFn.mockResolvedValue(value);
    }
  },
};

describe("<root>/index.js", () => {
  beforeEach(() => {
    const config = Object.assign({}, global.notifyConfig);
    mock.notification = new Notifier(config);
    slack.notify.mockClear();

    ["log", "error"].forEach(item => {
      console[item] = jest.fn();
      console[item].mockClear();
    });

    mock.setGitMock("diff", global.gitDiff);
    mock.setGitMock("getCommitDetails", global.gitCommitDetails);
    parser.parse.mockImplementation(() => global.gitKeysParsed);
  });

  test("init() :: Should validation fails when config.hookUri is not set", () => {
    delete mock.notification.config.hookUri;
    mock.notification.init();

    const loggerSpy = jest.spyOn(console, "error");
    expect(loggerSpy).toHaveBeenCalledWith(`ERROR: ${GLOBALS.MESSAGES.VALIDATIONS["hookUri"]}`);
  });

  test("init() :: Should validation fails when config is empty", () => {
    const notification = new Notifier();
    notification.init();

    const loggerSpy = jest.spyOn(console, "error");
    expect(loggerSpy).toHaveBeenCalledWith(`ERROR: ${GLOBALS.MESSAGES.VALIDATIONS["hookUri"]}`);
  });

  test("init() :: Should notify slack client with the all key changes", async () => {
    await mock.notification.init();

    expect(slack.notify).toHaveBeenCalled();
    expect(slack.notify).toHaveBeenCalledTimes(1);
    expect(slack.notify).toHaveBeenCalledWith(mock.notification.config.hookUri, global.slackMessage);
  });

  test("init() :: Should notify slack client using username as project.name", async () => {
    const config = Object.assign({}, global.notifyConfig, { username: "" });
    const notification = new Notifier(config);
    const expectedMessage = Object.assign({}, global.slackMessage, { username: "Acme App" });
    await notification.init();

    expect(slack.notify).toHaveBeenCalled();
    expect(slack.notify).toHaveBeenCalledTimes(1);
    expect(slack.notify).toHaveBeenCalledWith(notification.config.hookUri, expectedMessage);
  });

  test("init() :: Should notify slack client with the added keys only", async () => {
    const parsedKeys = Object.assign({}, global.gitKeysParsed, {
      removed: [],
      changed: [],
    });

    const message = Object.assign({}, global.slackMessage, {
      attachments: global.slackMessage.attachments.slice(0, 1),
    });

    parser.parse.mockImplementation(() => parsedKeys);

    await mock.notification.init();

    expect(slack.notify).toHaveBeenCalled();
    expect(slack.notify).toHaveBeenCalledTimes(1);
    expect(slack.notify).toHaveBeenCalledWith(mock.notification.config.hookUri, message);
  });

  test("init() :: Should not notify slack client when keys are up to date", async () => {
    const parsedKeys = Object.assign({}, global.gitKeysParsed, {
      added: [],
      removed: [],
      changed: [],
    });

    parser.parse.mockImplementation(() => parsedKeys);

    await mock.notification.init();
    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(GLOBALS.MESSAGES.KEYS_UP_TO_DATE);
  });

  test("init() :: Should cancel script when is git merge", async () => {
    const commitDetails = Object.assign({}, global.gitCommit, {
      isMerge: true,
    });

    const parsedKeys = Object.assign({}, global.gitKeysParsed, {
      added: [],
      removed: [],
      changed: [],
    });

    mock.setGitMock("getCommitDetails", commitDetails);
    parser.parse.mockImplementation(() => parsedKeys);

    const received = await mock.notification.init();

    expect(received).toBe(false);
    expect(console.log).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  test("init() :: Should cancel script when is git rebase", async () => {
    const commitDetails = Object.assign({}, global.gitCommit, {
      isRebase: true,
    });

    const parsedKeys = Object.assign({}, global.gitKeysParsed, {
      added: [],
      removed: [],
      changed: [],
    });

    mock.setGitMock("getCommitDetails", commitDetails);
    parser.parse.mockImplementation(() => parsedKeys);

    const received = await mock.notification.init();

    expect(received).toBe(false);
    expect(console.log).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  test("init() :: Should cancel script when have not key changes and is git amend", async () => {
    const commitDetails = Object.assign({}, global.gitCommit, {
      isAmend: true,
    });

    const parsedKeys = Object.assign({}, global.gitKeysParsed, {
      added: [],
      removed: [],
      changed: [],
    });

    mock.setGitMock("getCommitDetails", commitDetails);
    parser.parse.mockImplementation(() => parsedKeys);

    const received = await mock.notification.init();

    expect(received).toBe(false);
    expect(console.log).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  test("init() :: Should notify slack client with the added key and is git amend", async () => {
    const commitDetails = Object.assign({}, global.gitCommit, {
      isAmend: true,
    });

    const parsedKeys = Object.assign({}, global.gitKeysParsed, {
      added: [
        {
          key: "key_0010",
          value: "Test",
        },
      ],
      removed: [],
      changed: [],
    });

    const message = Object.assign({}, global.slackMessage, {
      attachments: global.slackMessage.attachments.slice(0, 1),
    });

    mock.setGitMock("getCommitDetails", commitDetails);
    parser.parse.mockImplementation(() => parsedKeys);

    await mock.notification.init();

    expect(slack.notify).toHaveBeenCalled();
    expect(slack.notify).toHaveBeenCalledTimes(1);
    expect(slack.notify).toHaveBeenCalledWith(mock.notification.config.hookUri, message);
  });
});
