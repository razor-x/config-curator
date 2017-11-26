const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const fsAccessAsync = promisify(fs.access)

const checkAccess = async ({source}) => {
  try {
    await fsAccessAsync(path.resolve(source), fs.constants.R_OK)
  } catch (err) {
    console.error('Failed to read', source)
    throw err
  }
}

const syncDirectory = async ({source, destination, owner, group, fmode, dmode}) => {
  try {
    console.log('TODO', 'rsync -rt --del', source, destination)
    console.log('TODO', 'chmod F', fmode, destination)
    console.log('TODO', 'chmod D', dmode, destination)
    console.log('TODO', 'chown', owner, destination)
    console.log('TODO', 'chgrp', group, destination)
  } catch (err) {
    console.error('Failed to install', source, 'to', destination)
    throw err
  }
}

const copyFile = async ({source, destination, owner, group, fmode}) => {
  try {
    console.log('TODO', 'mkdirp', path.dirname(destination))
    console.log('TODO', 'cp', source, destination)
    console.log('TODO', 'chmod F', fmode, source, destination)
    console.log('TODO', 'chown', owner, source, destination)
    console.log('TODO', 'chgrp', group, source, destination)
  } catch (err) {
    console.error('Failed to install', source, 'to', destination)
    throw err
  }
}

const makeSymlink = async ({source, destination}) => {
  try {
    console.log('TODO', 'ln -s', path.dirname(destination))
  } catch (err) {
    console.error('Failed to link', source, 'to', destination)
    throw err
  }
}

module.exports = async ({directories, files, symlinks}) => {
  await Promise.all([...directories, ...files].map(checkAccess))
  await Promise.all(directories.map(syncDirectory))
  await Promise.all(files.map(copyFile))
  await Promise.all(symlinks.map(makeSymlink))
}
