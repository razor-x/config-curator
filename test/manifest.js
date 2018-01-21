'use strict'

const src = 'test/root'
const root = `${__dirname}/dest`

const pkg = undefined
const io = undefined
const defaults = undefined

const unlinks = [{
  src
}]

const directories = [{
  src: `${src}/etc`,
  user: process.geteuid(),
  group: process.getgid(),
  dmode: '0750',
  fmode: '0640'
}]

const files = [{
  src: `${src}/foo.conf`
}, {
  src: `${src}/never-installed.conf`,
  pkgs: ['not-a-package', 'this-either']
}, {
  src: `${src}/also-never-installed.conf`,
  hosts: ['not-a-real-host']
}]

const symlinks = [{
  src: `${src}/baz.conf`,
  dst: `${src}/foo.conf`
}, {
  src: `${src}/bazp.conf`,
  dst: `${src}/foo.conf`,
  pkgs: ['rsync']
}]

module.exports = {unlinks, directories, files, symlinks, root, io, pkg, defaults}
