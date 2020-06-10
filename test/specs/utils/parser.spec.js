import parser from "@utils/parser";

describe("<root>/utils/parser.js", () => {
  test("factoryObject() :: Should get key object with key details", () => {
    const received = parser.factoryObject("key_001", "Key text", "Old key text");
    expect(received).toEqual({
      key: "key_001",
      value: "Key text",
      oldValue: "Old key text",
    });
  });

  test("factoryObject() :: Should get key object with default values", () => {
    const received = parser.factoryObject(undefined, undefined, undefined);
    expect(received).toEqual({
      key: "",
      value: "",
    });
  });

  test("stringToObject() :: Should get key/value populated when JSON follow the right format", () => {
    const received = parser.stringToObject(
      `-  "key_001": "Teste - No, continue! % = + ) ( | / \\ _scanning* ' || [{]} ? > < .[!]~ Just, $ & ^ - testing, more, commas."`
    );
    expect(received).toEqual({
      key: "key_001",
      value: "Teste - No, continue! % = + ) ( | / \\ _scanning* ' || [{]} ? > < .[!]~ Just, $ & ^ - testing, more, commas.",
    });
  });

  test("stringToObject() :: Should get key/value empty when the string does not follow the right JSON format", () => {
    const received = parser.stringToObject(
      `-  key_001: Teste - No, continue! % = + ) ( | / \\ _scanning* ' || [{]} ? > < .[!]~ Just, $ & ^ - testing, more, commas."`
    );
    expect(received).toEqual({
      key: "",
      value: "",
    });
  });

  test("parse() :: Should get diff object with added/removed/changed keys", () => {
    const received = parser.parse(global.gitDiff);
    expect(received).toStrictEqual(global.gitKeysParsed);
  });

  test("parse() :: Should get diff object with added key", () => {
    const diff = `
      diff --git a/dictionary.json b/dictionary.json
      index cbff224..78fe51e 100644
      --- a/dictionary.json
      +++ b/dictionary.json
      @@ -6,5 +6,6 @@
        "addtocalendar_001": "Yahoo",
        "addtocalendar_002": "Google",
        "addtocalendar_003": "Apple",
      +  "key_0010": "Test"
      }
      \\ No newline at end of file
    `;

    const received = parser.parse(diff);
    const expected = Object.assign({}, global.gitKeysParsed, {
      removed: [],
      changed: [],
    });

    expect(received).toEqual(expected);
  });

  test("parse() :: Should get diff object with removed key", () => {
    const diff = `
      diff --git a/dictionary.json b/dictionary.json
      index cbff224..78fe51e 100644
      --- a/dictionary.json
      +++ b/dictionary.json
      @@ -6,5 +6,6 @@
        "addtocalendar_001": "Yahoo",
        "addtocalendar_002": "Google",
        "addtocalendar_003": "Apple",
      -  "key_0011": "Home Page"
      }
      \\ No newline at end of file
    `;

    const received = parser.parse(diff);
    const expected = Object.assign({}, global.gitKeysParsed, {
      added: [],
      changed: [],
    });

    expect(received).toEqual(expected);
  });

  test("parse() :: Should get diff object with changed key", () => {
    const diff = `
      diff --git a/dictionary.json b/dictionary.json
      index cbff224..78fe51e 100644
      --- a/dictionary.json
      +++ b/dictionary.json
      @@ -6,5 +6,6 @@
        "addtocalendar_001": "Yahoo",
        "addtocalendar_002": "Google",
        "addtocalendar_003": "Apple",
      -  "key_0002": "Test - No, continue! % = + ) ( | / \\ _scanning* ' || [{]} ? > < .[!]~ Just, $ & ^ - testing, more, commas."
      +  "key_0002": "Test - No, continue! - testing, more, commas."
      }
      \\ No newline at end of file
    `;

    const received = parser.parse(diff);
    const expected = Object.assign({}, global.gitKeysParsed, {
      added: [],
      removed: [],
    });

    expect(received).toEqual(expected);
  });

  test("parse() :: Should get diff object with no changes", () => {
    const diff = `
      diff --git a/dictionary.json b/dictionary.json
      index cbff224..78fe51e 100644
      --- a/dictionary.json
      +++ b/dictionary.json
      @@ -6,5 +6,6 @@
        "addtocalendar_001": "Yahoo",
        "addtocalendar_002": "Google",
        "addtocalendar_003": "Apple",
      -  "key_0002": "Test - No, continue! - testing, more, commas."
      +  "key_0002": "Test - No, continue! - testing, more, commas."
      }
      \\ No newline at end of file
    `;

    const received = parser.parse(diff);
    const expected = Object.assign({}, global.gitKeysParsed, {
      added: [],
      removed: [],
      changed: [],
    });

    expect(received).toStrictEqual(expected);
  });
});
