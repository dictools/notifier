import { promisify } from "util";
import { exec } from "child_process";
import { normalizeStringToJSON } from "../utils/object";
const run = promisify(exec);

const git = {
  diff: (source) => run(`git diff HEAD@{1} ${source}`).then(resp => resp.stdout),
  getCommitDetails: async () => {
    const data = {
      hash: "%h",
      subject: "%gs",
      parents: "%p",
      message: "%s",
      username: "%gn",
      email: "%ge"
    }

    const getPatternToFindWord = (word = "") => new RegExp(`\\b(${word})\\b`, 'g');
    const normalize = (value = "") => value.replace(/(\r\n|\n|\r)/gm, '');
    const commit = await run(`git reflog show -1 --pretty=format:'${JSON.stringify(data)}'`).then(resp => normalizeStringToJSON(normalize(resp.stdout)));
    const hash_parents = (commit?.parents || "").split(/\s/);
    const isAmend = getPatternToFindWord('amend').test(commit?.subject || "");
    const isRebase = getPatternToFindWord('rebase').test(commit?.subject || "");

    return {
      isMerge: hash_parents.length > 1,
      isAmend,
      isRebase,
      username: commit?.username || "Unknown",
      message: commit?.message || ""
    };
  }
}

export default git;