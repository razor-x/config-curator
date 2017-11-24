const src = 'test/source'

const directories = ({hostname}) => []

const files = ({hostname}) => [{
  src: `${src}/foo.conf`
}]

const symlinks = ({hostname}) => []

module.exports = (...args) => ({
  root: './test/dest',
  directories: directories(...args),
  files: files(...args),
  symlinks: symlinks(...args)
})
