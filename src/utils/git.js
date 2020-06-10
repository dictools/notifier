import { exec } from "child_process";
import { normalizeStringToJSON } from "../utils/object";

const git = {
  run: (...args) => new Promise((resolve, reject) => exec(...args, (err, res) => (err ? reject(err) : resolve(res)))),
  diff: source =>
    git
      .run(`git diff HEAD@{1} ${source}`)
      .then(resp => resp)
      .catch(error => error),
  getCommitDetails: async () => {
    const data = {
      hash: "%h",
      subject: "%gs",
      parents: "%p",
      message: "%s",
      username: "%gn",
      email: "%ge",
    };

    const getPatternToFindWord = word => new RegExp(`\\b(${word})\\b`, "g");
    const normalize = value => value.replace(/(\r\n|\n|\r)/gm, "");
    const commit = await git
      .run(`git reflog show -1 --pretty=format:'${JSON.stringify(data)}'`)
      .then(resp => (resp ? normalizeStringToJSON(normalize(resp)) : {}));
    const hash_parents = (commit?.parents || "").split(/\s/);
    const isAmend = getPatternToFindWord("amend").test(commit?.subject || "");
    const isRebase = getPatternToFindWord("rebase").test(commit?.subject || "");

    return {
      isMerge: hash_parents.length > 1,
      isAmend,
      isRebase,
      username: commit?.username || "Unknown",
      message: commit?.message || "",
    };
  },
};

export default git;
