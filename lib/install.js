const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const fsAccessAsync = promisify(fs.access)

const checkAccess = root => async src => {
  try {
    await fsAccessAsync(path.resolve(src), fs.constants.R_OK)
  } catch (err) {
    console.error('Check failed for', src)
    throw err
  }
}

const copyDirectory = root => async (targets) => {

}

const copyFile = root => async (targets) => {

}

const makeSymlink = root => async (targets) => {

}

module.exports = async ({root, directories, files, symlinks}) => {
  const sources = [...directories, ...files].map(({src}) => src)
  await Promise.all(sources.map(checkAccess(root)))
  await Promise.all(directories.map(copyDirectory(root)))
  await Promise.all(files.map(copyFile(root)))
  await Promise.all(symlinks.map(makeSymlink(root)))
}
