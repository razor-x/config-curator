'use strict'

const originRoot = `${__dirname}/root`
const targetRoot = `${__dirname}/dest`

const pkgType = undefined
const ioType = undefined
const defaults = undefined

const unlinks = [{
  src: targetRoot
}]

const directories = [{
  src: 'etc',
  user: process.geteuid(),
  group: process.getgid(),
  dmode: '0750',
  fmode: '0640'
}]

const files = [{
  src: 'foo.conf'
}, {
  src: 'never-installed.conf',
  pkgs: ['not-a-package', 'this-either']
}, {
  src: 'also-never-installed.conf',
  hosts: ['not-a-real-host']
}]

const symlinks = [{
  src: 'baz.conf',
  dst: 'foo.conf',
  order: 20
}, {
  src: 'bazp.conf',
  dst: 'foo.conf',
  pkgs: ['rsync'],
  order: 10
}]

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
