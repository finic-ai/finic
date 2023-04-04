import { b as resolve } from './chunk-utils-env.03f840f2.js';
import { e as execa } from './vendor-index.737c3cff.js';
import 'tty';
import 'url';
import 'path';
import 'buffer';
import 'child_process';
import 'process';
import './vendor-index.e1d4cf84.js';
import './vendor-_commonjsHelpers.addc3445.js';
import 'fs';
import 'assert';
import 'events';
import 'stream';
import 'util';
import 'os';

class VitestGit {
  constructor(cwd) {
    this.cwd = cwd;
  }
  async resolveFilesWithGitCommand(args) {
    let result;
    try {
      result = await execa("git", args, { cwd: this.root });
    } catch (e) {
      e.message = e.stderr;
      throw e;
    }
    return result.stdout.split("\n").filter((s) => s !== "").map((changedPath) => resolve(this.root, changedPath));
  }
  async findChangedFiles(options) {
    const root = await this.getRoot(this.cwd);
    if (!root)
      return null;
    this.root = root;
    const changedSince = options.changedSince;
    if (typeof changedSince === "string") {
      const [committed, staged2, unstaged2] = await Promise.all([
        this.getFilesSince(changedSince),
        this.getStagedFiles(),
        this.getUnstagedFiles()
      ]);
      return [...committed, ...staged2, ...unstaged2];
    }
    const [staged, unstaged] = await Promise.all([
      this.getStagedFiles(),
      this.getUnstagedFiles()
    ]);
    return [...staged, ...unstaged];
  }
  getFilesSince(hash) {
    return this.resolveFilesWithGitCommand(
      ["diff", "--name-only", `${hash}...HEAD`]
    );
  }
  getStagedFiles() {
    return this.resolveFilesWithGitCommand(
      ["diff", "--cached", "--name-only"]
    );
  }
  getUnstagedFiles() {
    return this.resolveFilesWithGitCommand(
      [
        "ls-files",
        "--other",
        "--modified",
        "--exclude-standard"
      ]
    );
  }
  async getRoot(cwd) {
    const options = ["rev-parse", "--show-cdup"];
    try {
      const result = await execa("git", options, { cwd });
      return resolve(cwd, result.stdout);
    } catch {
      return null;
    }
  }
}

export { VitestGit };
