import { _get, normalizeStringToJSON } from "@utils/object";

const mock = {
  user: {
    firstName: "John",
    lastName: "Doe",
    address: [
      { type: "HOME" },
      { type: "WORK" },
    ]
  }
};

describe('<root>/utils/object.js', () => {
  test('_get() :: Should get nested value from object', () => {
    const received = _get(mock, 'user.firstName');
    expect(received).toBe("John");
  });

  test('_get() :: Should get nested value from object using array index', () => {
    const received = _get(mock, 'user.address[1].type');
    expect(received).toBe("WORK");
  });

  test('normalizeStringToJSON() :: Should get normalized JSON when string type', () => {
    const received = normalizeStringToJSON('{ key: "value" }');
    expect(received).toEqual({ "key": "value" });
  });

  test('normalizeStringToJSON() :: Should get normalized JSON when JSON type', () => {
    const received = normalizeStringToJSON({ key: "value" });
    expect(received).toEqual({ key: "value" });
  });
});