# Config Curator

[![npm](https://img.shields.io/npm/v/@rxrc/curator.svg)](https://www.npmjs.com/package/@rxrc/curator)
[![github](https://img.shields.io/badge/github-rxrc/curator-blue.svg)](https://github.com/rxrc/curator)
[![David](https://img.shields.io/david/rxrc/curator.svg)](https://david-dm.org/rxrc/curator)
[![CircleCI](https://img.shields.io/circleci/project/github/rxrc/curator.svg)](https://circleci.com/gh/rxrc/curator)

## Description

**CLI tool for installing static configuration or dotfiles.**

- **Idempotent:** syncs directories, copies files,
  creates system links, deletes paths, and sets access permissions to ensure
  the system will be in a consistent state after each run.
- **Declarative**: all operations are defined
  in a manifest file with a simple syntax.
- **Flexible**: operations may be limited only to specific hosts
  or only when specific packages are installed,
  additionally, since the manifest is written in JavaScript,
  it may include arbitrary logic.
- **Minimal:** written in &lt; 500 lines of code
  using only the Node.js standard library and a few system calls.
- **Secure:** no additional third party dependencies (except `rsync`):
  safe to run with `sudo` to install system files.
- **Fast:** uses maximal concurrency
  and allows custom ordering of groups of operations.


#### Try it out

1. Clone this repo.
2. Run `npm install`.
3. Run `npm test`:
   This will install the configuration
   defined in `test/manifest.js` to `test/dest`.

## Requirements

- Linux or macOS with [rsync] installed.
- [Node.js] version 8 or above.
- For conditional configuration based on installed packages,
  the following package managers are supported:
  [Pacman], [Homebrew], [dpkg], or [pkgng].

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
  to override the `ioType` and `pkgType` values from the manifest.

### Manifest

#### Minimal example

```js
/* manifest.js */

'use strict'

const os = require('os')

const targetRoot = os.homedir()

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

module.exports = {targetRoot, unlinks, directories, files, symlinks}
```

#### Complete manifest API

```js
/* manifest.js */

'use strict'

/* Prefix for all source paths
 * except for unlinks and symlinks which use targetRoot below.
 *
 * Use __dirname to refer to the location of this file
 * and process.cwd() for the current working directory.
 *
 * Default: the current working directory.
 */
const originRoot = require('os').homedir()

/* Prefix for all destination paths.
 * For unlinks and symlinks, the source is also prefixed.
 *
 * Use __dirname to refer to the location of this file
 * and process.cwd() for the current working directory.
 *
 * Default: a ./dest folder under the current working directory.
 */
const targetRoot = require('os').homedir()

/* Package lookup backend to use:
 * pacman, dpkg, homebrew, pkgng, or noop.
 *
 * The special value noop will assume all packages are installed.
 *
 * Default: attempt to autodetect, fallback to noop.
 */
const pkgType = 'homebrew'

/* I/O backend to use:
 * linux, macos, or noop.
 *
 * The special value noop will not perform any modifications
 * and only log what actions would be taken.
 *
 * Default: attempt to autodetect, fallback to noop.
 */
const ioType = 'macos'

/* Defaults to use for each operation.
 *
 * Default: shown below.
 */
const defaults = {
  order: 100, // all operations start with this order value
  dmode: '0750', // files have user write, group read, other no access
  fmode: '0640', // directories have user write, group read, other no access
  user: process.getuid(), // current user
  group: process.getgid() // current group
}

/* Operations to perform by type.
 *
 * Operations always happen in this order: unlinks, directories, files, and symlinks.
 *
 * Each type of operations waits until the previous type has completed successfully.
 *
 * Operations of each type with equal order value are always done in parallel,
 * but operations with a later order do not start until earlier ones complete.
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
 * The src is relative to the global targetRoot option.
 */
const unlinks = [{
  // Remove ~/intruders on all hosts.
  src: 'intruders'
}, {
  // Remove ~/warpcore on host enterprise, if the eject package is installed.
  src: 'warpcore',
  hosts: ['enterprise'],
  pkgs: ['eject']
}]

/* Synchronize the contents of the directory at src to dst
 * and sets the directory and file permissions.
 *
 * The src is relative to the global originRoot option.
 * The dst is relative to the global targetRoot option.
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
  // on hosts enterprise and defiant,
  // if the turbolift and transporter packages are installed,
  // and set specific user, group, and access permissions.
  src: 'panels/exploding',
  dst: 'bridge/panels',
  user: 'numberone',
  group: 'officers',
  dmode: '0755',
  fmode: '0644',
  hosts: ['enterprise', 'defiant'],
  pkgs: ['turbolift', 'transporter']
}, {
  // Install sickbay first, then install the beds and meds.
  src: 'decks/sickbay',
  dst: 'sickbay',
  order: 10
}, {
  src: 'beds',
  dst: 'sickbay/beds',
  order: 11
}, {
  src: 'meds',
  dst: 'sickbay/meds',
  order: 11
}]

/* Copy the file at src to dst
 * and sets the file permissions.
 *
 * The src is relative to the global originRoot option.
 * The dst is relative to the global targetRoot option.
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
  // on host defiant, if the stun package is installed,
  // and set the user, group, and access permissions.
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
 * The src and dst are relative to the global targetRoot option.
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
  originRoot,
  targetRoot,
  ioType,
  pkgType,
  defaults
}
```

## Similar Software

This is the successor to my original configuration tool written in Ruby:
https://github.com/razor-x/config_curator.

GitHub maintains an unofficial guide to dotfiles: https://dotfiles.github.io/.

## Users

_If you are using Config Curator, add a link here and open a pull request._

- [My Arch Linux configuration.](https://github.com/rxrc/archrc)

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
