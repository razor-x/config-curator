'use strict'

const src = 'test/root'

const directories = []

const files = [{
  src: `${src}/foo.conf`
}, {
  src: `${src}/never-installed.conf`,
  pkgs: ['not-a-package', 'this-either']
}]

const symlinks = []

const root = `${__dirname}/dest`

module.exports = {directories, files, symlinks, root}
