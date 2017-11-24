const filter = require('./filter')
const install = require('./install')

module.exports = async manifest => {
  const [ directories, files, symlinks ] = await Promise.all([
    manifest.directories,
    manifest.files,
    manifest.symlinks
  ].map(x => x.filter(filter)))

  return install({root: manifest.root, directories, files, symlinks})
}
