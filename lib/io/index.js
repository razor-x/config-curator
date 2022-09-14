import os from 'os'

import linux from './linux.js'
import noop from './noop.js'

const has = (obj, k) => Object.prototype.hasOwnProperty.call(obj, k)

const types = {
  linux,
  darwin: linux,
  macos: linux,
  noop
}

const getDefaultType = () => {
  if (['Linux', 'Darwin'].includes(os.type())) return 'linux'
  return 'noop'
}

export default (type) => {
  const typeIsNotNil = type != null
  const typeIsCustomObject = typeIsNotNil && typeof type === 'object'
  const typeIsNotSupported = typeIsNotNil && !has(types, type)

  if (typeIsCustomObject) return type

  if (typeIsNotSupported) {
    throw new Error(`I/O backend ${type} is not supported.`)
  }

  return types[type || getDefaultType()]
}
