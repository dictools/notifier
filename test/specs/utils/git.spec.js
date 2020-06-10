import git from "@utils/git";
import child_process from "child_process";

jest.mock('child_process', () => ({
  exec: jest.fn()
}));

const mock = {
  setExecMock: ({ error, stdout }) => {
    child_process.exec.mockImplementation((command, callback) => callback(error, stdout));
    return { error, stdout };
  },
  getExpectedCommit: (options = {}) => Object.assign({}, global.gitCommit, options)
}

describe('<root>/utils/git.js', () => {
  test('diff() :: Should get diff value through the promise', async () => {
    const execResult = mock.setExecMock({ error: null, stdout: "ok" });
    const diff = await git.diff(global.notifyConfig.path);
    expect(diff).toEqual(execResult.stdout);
  });

  test('diff() :: Should get diff error through the promise', async () => {
    const execResult = mock.setExecMock({ error: "fail", stdout: null });
    const diff = await git.diff(global.notifyConfig.path);
    expect(diff).toEqual(execResult.error);
  });

  test('getCommitDetails() :: Should get commit details', async () => {
    mock.setExecMock({ error: null, stdout: JSON.stringify(global.gitCommit) });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit();
    expect(commit).toEqual(expected);
  });

  test('getCommitDetails() :: Should get commit details with amend flag true', async () => {
    const mockCommit = Object.assign({}, global.gitCommit, { subject: 'commit (amend): ACM-1294 :: dictionary changes' });
    mock.setExecMock({ error: null, stdout: JSON.stringify(mockCommit) });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit({ isAmend: true });
    expect(commit).toEqual(expected);
  });

  test('getCommitDetails() :: Should get commit details with merge flag true', async () => {
    const mockCommit = Object.assign({}, global.gitCommit, { parents: '341865c 248835d' });
    mock.setExecMock({ error: null, stdout: JSON.stringify(mockCommit) });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit({ isMerge: true });
    expect(commit).toEqual(expected);
  });

  test('getCommitDetails() :: Should get commit details with rebase flag true', async () => {
    const mockCommit = Object.assign({}, global.gitCommit, { subject: 'rebase -i (squash): ACM-1294 :: Rewriting the history' });
    mock.setExecMock({ error: null, stdout: JSON.stringify(mockCommit) });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit({ isRebase: true });
    expect(commit).toEqual(expected);
  });

  test('getCommitDetails() :: Should get commit details username as unknown', async () => {
    const mockCommit = Object.assign({}, global.gitCommit, { username: "" });
    mock.setExecMock({ error: null, stdout: JSON.stringify(mockCommit) });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit({ username: "Unknown" });
    expect(commit).toEqual(expected);
  });

  test('getCommitDetails() :: Should get commit details with empty message', async () => {
    const mockCommit = Object.assign({}, global.gitCommit, { message: "" });
    mock.setExecMock({ error: null, stdout: JSON.stringify(mockCommit) });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit({ message: "" });
    expect(commit).toEqual(expected);
  });

  test('getCommitDetails() :: Should get commit details with empty commit parents', async () => {
    const mockCommit = Object.assign({}, global.gitCommit, { parents: "" });
    mock.setExecMock({ error: null, stdout: JSON.stringify(mockCommit) });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit();
    expect(commit).toEqual(expected);
  });

  test('getCommitDetails() :: Should get commit details with empty subject', async () => {
    const mockCommit = Object.assign({}, global.gitCommit, { subject: "" });
    mock.setExecMock({ error: null, stdout: JSON.stringify(mockCommit) });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit();
    expect(commit).toEqual(expected);
  });

  test('getCommitDetails() :: Should get empty commit details', async () => {
    mock.setExecMock({ error: null, stdout: "" });
    const commit = await git.getCommitDetails();
    const expected = mock.getExpectedCommit({
      username: "Unknown",
      message: ""
    });
    expect(commit).toEqual(expected);
  });
});