'use strict'

const fs = require('fs')
const os = require('os')

const exec = require('./exec')

const pacman = async (pkgs = []) => {
  try {
    await Promise.all(
      pkgs.map(pkg => exec(`pacman -qQ ${pkg}`))
    )
    return true
  } catch (err) {
    if (/package '.*' was not found/.test(err.message)) return false
    throw err
  }
}

const dpkg = async (pkgs = []) => {
  try {
    await Promise.all(
      pkgs.map(pkg => exec(`dpkg -s ${pkg}`))
    )
    return true
  } catch (err) {
    // TODO: Match error message
    return false
  }
}

const pkgng = async (pkgs = []) => {
  try {
    await Promise.all(
      pkgs.map(pkg => exec(`pkg info ${pkg}`))
    )
    return true
  } catch (err) {
    // TODO: Match error message
    return false
  }
}

const homebrew = async (pkgs = []) => {
  throw new Error('TODO: Homebrew support not yet implemented.')
}

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
