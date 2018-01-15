'use strict'

const src = 'test/root'

const pkg = undefined
const io = undefined

const unlinks = [{
  src
}]

const directories = [{
  src: `${src}/etc`
}]

const files = [{
  src: `${src}/foo.conf`
}, {
  src: `${src}/never-installed.conf`,
  pkgs: ['not-a-package', 'this-either']
}]

const symlinks = [{
  src: `${src}/baz.conf`,
  dst: `${src}/foo.conf`
}]

const root = `${__dirname}/dest`

module.exports = {unlinks, directories, files, symlinks, root, io, pkg}
