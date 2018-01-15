'use strict'

const fs = require('fs')
const { promisify } = require('util')

const fsAccessAsync = promisify(fs.access)
const fsChmodAsync = promisify(fs.chmod)
const fsCopyFileAsync = promisify(fs.copyFile)
const fsSymlink = promisify(fs.symlink)

const checkAccess = ({target}) => fsAccessAsync(target, fs.constants.R_OK)
const chmod = ({mode, target}) => fsChmodAsync(target, mode)
const copyFile = ({source, destination}) => fsCopyFileAsync(source, destination)
const makeSymlink = ({source, destination}) => fsSymlink(destination, source)

module.exports = {
  checkAccess,
  chmod,
  copyFile,
  makeSymlink
}
