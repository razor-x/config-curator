const src = 'test/root'

const directories = []

const files = [{
  src: `${src}/foo.conf`
}]

const symlinks = []

const root = `${__dirname}/dest`

module.exports = {directories, files, symlinks, root}
