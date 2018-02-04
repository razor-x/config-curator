'use strict'

const os = require('os')
const { execSync } = require('child_process')

const exec = require('./exec')

const commandExists = cmd => {
  try {
    execSync(`command -v ${cmd}`)
    return true
  } catch (err) {
    return false
  }
}

const simpleCheck = (cmd, match = null, fork = true) => async (pkgs = []) => {
  try {
    const execCheck = arg => exec([cmd, arg].join(' '))

    const check = fork
      ? Promise.all(pkgs.map(execCheck))
      : execCheck(pkgs.join(' '))

    await check
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
  if (os.type() === 'Darwin' && commandExists('brew')) return 'homebrew'
  if (commandExists('pacman')) return 'pacman'
  if (commandExists('dpkg')) return 'dpkg'
  if (commandExists('pkg')) return 'pkgng'
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
