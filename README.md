# Config Curator

[![npm](https://img.shields.io/npm/v/@rxrc/curator.svg)](https://www.npmjs.com/package/@rxrc/curator)
[![github](https://img.shields.io/badge/github-rxrc/curator-blue.svg)](https://github.com/rxrc/curator)
[![David](https://img.shields.io/david/rxrc/curator.svg)](https://david-dm.org/rxrc/curator)
[![CircleCI](https://img.shields.io/circleci/project/github/rxrc/curator.svg)](https://circleci.com/gh/rxrc/curator)

## Description

**CLI tool for installing static configuration.**

- **Idempotent:** syncs directories, copies files,
  creates system links, deletes paths, and sets access permissions to ensure
  the system will be in a consistent state after each run.
- **Declarative**: all operations are defined
  in a manifest file with a simple syntax.
- **Flexible**: operations may be limited only to specific hosts
  or only when specific packages are installed,
  additionally, since the manifest is written in JavaScript,
  it may include arbitrary logic.
- **Minimal:** written in Node.js using only the standard library
  and a few system calls.
- **Secure:** no additional third party dependencies (except `rsync`)
  and a small codebase for easy review.
  (Safe to run with `sudo` to install system files.)
- **Fast:** uses maximal concurrency for all file operations.

**To try it out:**

1. Clone this repo.
2. Run `npm install`.
3. Run `npm test`:
   This will install the configuration
   defined in `test/manifest.js` to `test/dest`.

**Simple manifest file:**

```js
'use strict'

const os = require('os')

const root = os.homedir()

const unlinks = [{
  src: 'old.conf'
}]

const directories = [{
  src: '.config/envs'
}, {
  src: 'vim',
  dst: '.vim'
}, {
  src: 'private',
  dmode: '0700',
  fmode: '0600',
  user: 'root',
  group: 'wheel'
}]

const files = [{
  src: '.zshrc'
}, {
  src: `keys/${os.hostname()}`,
  dst: '.ssh/id_rsa',
  fmode: '0600',
  pkgs: ['openssh']
}]

const symlinks = [{
  src: '.config/env.conf',
  dst: '.config/envs.${os.hostname()}.conf',
  hosts: ['alpha', 'delta']
}]

module.exports = {root, unlinks, directories, files, symlinks}
```

## Requirements

- Linux or macOS with [rsync] installed.
- [Node.js] version 8 or above.

For conditional configuration based on installed packages,
the following package managers are supported:

- [Pacman]
- [Homebrew]
- [dpkg]
- [pkgng]

[dpkg]: https://help.ubuntu.com/lts/serverguide/dpkg.html
[Homebrew]: https://brew.sh/
[Node.js]: https://nodejs.org/
[Pacman]: https://www.archlinux.org/pacman/
[pkgng]: https://wiki.freebsd.org/pkgng
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
and run the `curator` command to install the configuration.

- The manifest configuration is defined below.
  Copy the example manifest from [`manifest.example.js`](./manifest.example.js).
- The location of the manifest file may be passed as the first argument,
  otherwise it looks for `manifest.js` in the current working directory.
- The environment variables `CURATOR_IO` and `CURATOR_PKG` may be set
  to override the `io` and `pkg` values from the manifest.

```js
/* manifest.js */

'use strict'

/* All destination paths are prefixed with this.
 * For unlinks and symlinks, the source is also prefixed.
 *
 * Use __dirname to refer to the location of this file
 * and process.cwd() for the current working directory.
 *
 * Default: current working directory.
 */
const root = require('os').homedir()

/* The package lookup backend to use:
 * pacman, dpkg, homebrew, pkgng, or noop.
 *
 * The special value noop will assume all packages are installed.
 *
 * Default: attempt to autodetect, fallback to noop.
 */
const pkg = 'homebrew'

/* The I/O backend to use:
 * linux, macos, or noop.
 *
 * The special value noop will not perform any modifications
 * and only log what actions would be taken.
 *
 * Default: attempt to autodetect, fallback to noop.
 */
const io = 'macos'

/* The defaults to use for each operation.
 *
 * Default: shown below.
 */
const defaults = {
  dmode: '0750', // files have user write, group read, other no access
  fmode: '0640', // directories have user write, group read, other no access
  user: process.getuid(), // current user
  group: process.getgid() // current group
}

/* Operations to perform by type.
 *
 * Operations always happen in this order:
 * unlinks, directories, files, symlinks.
 * Each type of operations waits
 * until the previous type has completed successfully.
 * All operations of a specific type are done in parallel.
 *
 * Specifying an array of hostnames will restrict that
 * operation to matching hosts (case insensitive).
 *
 * Specifying an array of packages will restrict that
 * operation to hosts with all packages installed (case insensitive).
 *
 * All operation types will default to an empty array if unset.
 */

/* Unlink (unconditionally remove) the directory, file, or symlink at src.
 *
 * The src is relative to the root.
 */
const unlinks = [{
  // Remove ~/intruders on all host.
  src: 'intruders'
}, {
  // Remove ~/warpcore on host enterprise if the eject package is installed.
  src: 'warpcore',
  hosts: ['enterprise'],
  pkgs: ['eject']
}]

/* Synchronize the contents of the directory at src to dst
 * and sets the directory and file permissions.
 *
 * The dst is relative to the root.
 *
 * NOTE: this WILL remove files in dst that are not in src.
 *
 * If dst is not given, will use src as the subpath.
 */
const directories = [{
  // Synchronize ./holodeck to ~/holodeck on all hosts.
  src: 'holodeck'
}, {
  // Synchronize ./panels/exploding to ~/bridge/panels
  // and set specific user, group, and access permissions
  // on hosts enterprise and defiant
  // if the turbolift and transporter packages are installed.
  src: 'panels/exploding',
  dst: 'bridge/panels',
  user: 'numberone',
  group: 'officers',
  dmode: '0755',
  fmode: '0644',
  hosts: ['enterprise', 'defiant'],
  pkgs: ['turbolift', 'transporter']
}]

/* Copy the file at src to dst
 * and sets the file permissions.
 *
 * The dst is relative to the root.
 *
 * NOTE: this WILL replace the file at dst.
 *
 * If dst is not given, will use src as the subpath.
 */
const files = [{
  // Copy ./bay/torpedo to ~/bay/torpedo on all hosts.
  src: 'bay/torpedo'
}, {
  // Copy ./phaser to ~/brig/phaser
  // and set the user, group, and access permissions
  // on host defiant if the stun package is installed.
  src: 'phaser',
  dst: 'brig/phaser',
  user: 'warf',
  group: 'security',
  fmode: '0600',
  hosts: ['defiant'],
  pkgs: ['stun']
}]

/* Create a system link (symlink) at src pointing to dst.
 *
 * The src and dst is relative to the root.
 *
 * NOTE: this WILL replace the file at src.
 */
const symlinks = [{
  // Create a symlink from ~/drink to ~/tea/earlgray/hot on all hosts.
  src: 'drink',
  dst: 'tea/earlgray/hot'
}, {
  // Create a symlink from ~/hypospray to ~/hyposprays/norepinephrine
  // on host enterprise if the sickbay package is installed.
  src: 'hypospray',
  dst: 'hyposprays/norepinephrine',
  hosts: ['enterprise'],
  pkgs: ['sickbay']
}]

/* Export each value set above.
 * Simply do not export an option to use the default.
 */
module.exports = {
  unlinks,
  directories,
  files,
  symlinks,
  root,
  io,
  pkg,
  defaults
}
```

## Similar Software

This is the successor to my original configuration tool written in Ruby:
https://github.com/razor-x/config_curator.

GitHub maintains an unofficial guide to dotfiles: https://dotfiles.github.io/.

## Contributing

Please submit and comment on bug reports and feature requests.

To submit a patch:

1. Fork it (https://github.com/rxrc/curator/fork).
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Make changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin my-new-feature`).
6. Create a new Pull Request.

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
