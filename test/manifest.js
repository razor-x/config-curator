'use strict'

const src = 'test/root'

const pkg = 'noop'
const io = 'noop'

const unlinks = []

const directories = []

const files = [{
  src: `${src}/foo.conf`
}, {
  src: `${src}/never-installed.conf`,
  pkgs: ['not-a-package', 'this-either']
}]

const symlinks = []

const root = `${__dirname}/dest`

module.exports = {unlinks, directories, files, symlinks, root, io, pkg}
