import GLOBALS from "@constants/globals";

describe("<root>/constants/globals.js", () => {
  test("Should globals match snapshot", async () => {
    expect(GLOBALS).toMatchSnapshot();
  });
});
