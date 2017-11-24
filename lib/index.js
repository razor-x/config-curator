const normalize = require('./normalize')
const install = require('./install')

const isNotNull = x => x !== null

module.exports = async manifest => {
  const [ directories, files, symlinks ] = await Promise.all([
    manifest.directories,
    manifest.files,
    manifest.symlinks
  ].map(x => Promise.all(x.map(normalize))))

  return install({
    root: manifest.root,
    directories: directories.filter(isNotNull),
    files: files.filter(isNotNull),
    symlinks: symlinks.filter(isNotNull)
  })
}
