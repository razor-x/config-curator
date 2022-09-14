import fs from 'fs'

import { promisify } from 'util'

const fsAccessAsync = promisify(fs.access)
const fsChmodAsync = promisify(fs.chmod)
const fsCopyFileAsync = promisify(fs.copyFile)
const fsSymlink = promisify(fs.symlink)

export const checkAccess = ({ target }) =>
  fsAccessAsync(target, fs.constants.R_OK)

export const chmod = ({ mode, target }) => fsChmodAsync(target, mode)

export const copyFile = ({ source, destination }) =>
  fsCopyFileAsync(source, destination)

export const makeSymlink = ({ source, destination }) =>
  fsSymlink(destination, source)
