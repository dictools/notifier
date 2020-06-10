import string from "@utils/string";

describe('<root>/utils/string.js', () => {
  test('capitalize() :: Should text be capitalized', () => {
    const received = string.capitalize("added");
    expect(received).toEqual("Added");
  });

  test('replace() :: Should text be replaced by replacements', () => {
    const received = string.replace("*From:* #{oldValue}\n*To:* #{value}", {
      oldValue: "Hello",
      value: "Hi!"
    });

    expect(received).toEqual("*From:* Hello\n*To:* Hi!");
  });

  test('replace() :: Should text return without replace', () => {
    const received = string.replace("*From:* #{oldValue}\n*To:* #{value}");
    expect(received).toEqual("*From:* #{oldValue}\n*To:* #{value}");
  });

  test('replace() :: Should text without replacements not be replaced', () => {
    const received = string.replace("Hello World!");
    expect(received).toEqual("Hello World!");
  });

  test('replace() :: Should text undefined return an empty string', () => {
    const received = string.replace();
    expect(received).toEqual("");
  });

  test('getTask() :: Should get task link from commit message', () => {
    const received = string.getTask("ACM-0234 :: Commit message", { key: "ACM", boardUrl: "https://jira.acme.com/browse"});
    expect(received).toEqual("<https://jira.acme.com/browse/ACM-0234|ACM-0234>");
  });

  test('getTask() :: Should get multiple task links from commit message', () => {
    const received = string.getTask("ACM-0234 :: ACM-9034 :: Commit message", { key: "ACM", boardUrl: "https://jira.acme.com/browse"});
    expect(received).toEqual("<https://jira.acme.com/browse/ACM-0234|ACM-0234> / <https://jira.acme.com/browse/ACM-9034|ACM-9034>");
  });

  test('getTask() :: Should get task link using regex', () => {
    const received = string.getTask("ACM-0234 :: Commit message", { key: /(ACM)-[0-9]+/g, boardUrl: "https://jira.acme.com/browse"});
    expect(received).toEqual("<https://jira.acme.com/browse/ACM-0234|ACM-0234>");
  });

  test('getTask() :: Should get multiple tasks link with different keys', () => {
    const received = string.getTask("ACM-0234 :: MCA-9034 :: Commit message", { key: ["ACM", "MCA"], boardUrl: "https://jira.acme.com/browse"});
    expect(received).toEqual("<https://jira.acme.com/browse/ACM-0234|ACM-0234> / <https://jira.acme.com/browse/MCA-9034|MCA-9034>");
  });

  test('getTask() :: Should not get task link when board url is not defined', () => {
    const received = string.getTask("ACM-0234 :: MCA-9034 :: Commit message", { key: "ACM" });
    expect(received).toEqual(undefined);
  });

  test('getTask() :: Should not get task link when message is defined', () => {
    const received = string.getTask(undefined, { key: "ACM" });
    expect(received).toEqual(undefined);
  });

  test('getTask() :: Should not get task link when project details is defined', () => {
    const received = string.getTask("ACM-0234 :: MCA-9034 :: Commit message");
    expect(received).toEqual(undefined);
  });

  test('getAttachmentFormatted() :: Should get attachment formatted', () => {
    const line = { key: "key_001", value: "Hello World!" }
    const commit = { message: "ACM-0345 :: Commit message", username: "John Doe" }
    const received = string.getAttachmentFormatted(line, "added", commit, global.notifyConfig);
    const expected = {
      type: "added",
      color: "#178667",
      text: "Dictionary key key_001 has been added\nText: Hello World!",
      footer: "Added by: John Doe | Task: <https://jira.acme.com/browse/ACM-0345|ACM-0345>"
    }
    expect(received).toEqual(expected);
  });

  test('getAttachmentFormatted() :: Should get attachment formatted without custom footer with task link', () => {
    const config = Object.assign({}, global.notifyConfig);
    delete config.messages.added.footer
    const line = { key: "key_001", value: "Hello World!" }
    const commit = { message: "ACM-0345 :: Commit message", username: "John Doe" }
    const received = string.getAttachmentFormatted(line, "added", commit, config);
    const expected = {
      type: "added",
      color: "#178667",
      text: "Dictionary key key_001 has been added\nText: Hello World!",
      footer: "*Added by:* John Doe | *Task:* <https://jira.acme.com/browse/ACM-0345|ACM-0345>"
    }
    expect(received).toEqual(expected);
  });

  test('getAttachmentFormatted() :: Should get attachment formatted without custom footer without task link', () => {
    const config = Object.assign({}, global.notifyConfig);
    delete config.messages.added.footer
    const line = { key: "key_001", value: "Hello World!" }
    const commit = { message: "Commit message", username: "John Doe" }
    const received = string.getAttachmentFormatted(line, "added", commit, config);
    const expected = {
      type: "added",
      color: "#178667",
      text: "Dictionary key key_001 has been added\nText: Hello World!",
      footer: "*Added by:* John Doe"
    }
    expect(received).toEqual(expected);
  });
})