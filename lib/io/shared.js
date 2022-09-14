import fs, { promises as fsPromises } from 'fs'

export const checkAccess = ({ target }) =>
  fsPromises.access(target, fs.constants.R_OK)

export const chmod = ({ mode, target }) => fsPromises.chmod(target, mode)

export const copyFile = ({ source, destination }) =>
  fsPromises.copyFile(source, destination)

export const makeSymlink = ({ source, destination }) =>
  fsPromises.symlink(destination, source)
