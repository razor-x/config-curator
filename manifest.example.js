'use strict'

/* All destination paths are prefixed with this.
 * For unlinks and symlinks, the source is also prefixed.
 *
 * Use __dirname to refer to the location of this file
 * and process.cwd() for the current working directory.
 *
 * Default: a ./dest folder under the current working directory.
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
