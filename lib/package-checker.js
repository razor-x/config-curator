'use strict'

const fs = require('fs')
const os = require('os')

const exec = require('./exec')

const simpleCheck = (cmd, match = null, fork = true) => async (pkgs = []) => {
  try {
    if (fork) {
      await Promise.all(
        pkgs.map(pkg => exec(`${cmd} ${pkg}`))
      )
    } else {
      await exec(`${cmd} ${pkgs.join(' ')}`)
    }
    return true
  } catch (err) {
    if (match === null) return false
    if (match.test(err.message)) return false
    throw err
  }
}

// TODO: Match error messages
const dpkg = simpleCheck('dpkg -s')
const pkgng = simpleCheck('pkg info')
const homebrew = simpleCheck('brew list --verbose', null, false)

const pacman = simpleCheck(
  'pacman -qQ',
  /package '.*' was not found/
)

const noop = async (pkgs = []) => {
  console.log(`Check for ${pkgs.join(', ')}`)
}

const types = {
  pacman,
  homebrew,
  dpkg,
  pkgng,
  noop
}

const defaultType = () => {
  if (os.type() === 'Darwin') return 'homebrew'
  // TODO: Autodetect dpkg.

  try {
    fs.accessSync('/bin/pacman', fs.constants.X_OK)
    return 'pacman'
  } catch (err) {
    return 'noop'
  }
}

module.exports = (type) => {
  const typeIsNotNil = type != null
  const typeIsCustomFunction = typeIsNotNil && typeof type === 'function'
  const typeIsNotSupported = typeIsNotNil && !types.hasOwnProperty(type)

  if (typeIsCustomFunction) return type

  if (typeIsNotSupported) {
    throw new Error(`Package manager ${type} is not supported.`)
  }

  return types[type || defaultType()]
}
