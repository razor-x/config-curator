# Config Curator

[![npm](https://img.shields.io/npm/v/@rxrc/curator.svg)](https://www.npmjs.com/package/@rxrc/curator)
[![github](https://img.shields.io/badge/github-repo-blue.svg)](https://github.com/rxrc/curator)
[![David](https://img.shields.io/david/rxrc/curator.svg)](https://david-dm.org/rxrc/curator)
[![CircleCI](https://img.shields.io/circleci/project/github/rxrc/curator.svg)](https://circleci.com/gh/rxrc/curator)

## Description

Config curator is CLI tool for installing static configuration.

- Minimal: written in Node.js using only the standard library
  and a few system calls.
- Secure: no additional third party dependencies (except `rsync`)
  and a small codebase for easy review.
  (Safe to run with `sudo` to install system files.)
- Fast: uses maximal concurrency for all file operations.

**To try it out:**

1. Clone this repo.
2. Run `npm install`.
3. Run `npm test`:
   This will install the configuration
   defined in `test/manifest.js` to `test/dest`.

## Requirements

- Linux or macOS with [rsync] installed.
- [Node.js] version 8 or above.
- For conditional configuration based on installed packages,
  the following package managers are supported: [Pacman] or [Homebrew].

[Homebrew]: https://brew.sh/
[Node.js]: https://nodejs.org/
[Pacman]: https://www.archlinux.org/pacman/
[rsync]: https://rsync.samba.org/

## Installation

1. Add this as a development dependency to your project using [npm] with

    ```
    $ npm install --save-dev @rxrc/curator
    ```

2. Add a [script][npm scripts] to your `package.json` with `"curator": "curator"`
   so you may run this with
   
    ```
    $ npm run curator
    ```

[npm]: https://www.npmjs.com/
[npm scripts]: https://docs.npmjs.com/misc/scripts

## Usage

Create a `manifest.js` file to define the configuration
and run `npm run curator` to install the configuration.

## License

This npm package is licensed under the MIT license.

## Warranty

This software is provided by the copyright holders and contributors "as is" and
any express or implied warranties, including, but not limited to, the implied
warranties of merchantability and fitness for a particular purpose are
disclaimed. In no event shall the copyright holder or contributors be liable for
any direct, indirect, incidental, special, exemplary, or consequential damages
(including, but not limited to, procurement of substitute goods or services;
loss of use, data, or profits; or business interruption) however caused and on
any theory of liability, whether in contract, strict liability, or tort
(including negligence or otherwise) arising in any way out of the use of this
software, even if advised of the possibility of such damage.
