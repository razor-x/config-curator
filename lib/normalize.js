'use strict'

const os = require('os')
const path = require('path')

const isNotNil = x => x != null

const cleanString = s => s.trim().toLowerCase()

const assertArrayOfStrings = arr => {
  if (Array.isArray(arr) && arr.every(x => typeof x === 'string')) return
  throw new Error('Must be an array of strings, got', arr)
}

const parseMode = mode => (
  typeof mode === 'string' ? parseInt(mode, 8) : mode
)

const checkInstalledPkgs = async (checker, pkgs) => {
  try {
    if (pkgs == null) return true
    assertArrayOfStrings(pkgs)
    if (pkgs.length === 0) return true
    return await checker(pkgs.map(cleanString))
  } catch (err) {
    console.error(`* Failed to check for packages: ${pkgs.join(', ')}.`)
    throw err
  }
}

const isMatchingHost = (hostname, hosts) => {
  if (hosts == null) return true
  assertArrayOfStrings(hosts)
  return hosts.map(cleanString).includes(cleanString(hostname))
}

const createNormalizer = ({
  originRoot = process.cwd(),
  targetRoot = path.resolve(process.cwd(), 'dest'),
  hostname = os.hostname(),
  defaultOrder = 100,
  defaultOwner = process.getuid(),
  defaultGroup = process.getgid(),
  defaultFmode = parseMode('0640'),
  defaultDmode = parseMode('0750'),
  packageChecker
}) => async ({
  src,
  dst,
  pkgs,
  hosts,
  order,
  owner,
  group,
  fmode,
  dmode,
  type
}) => {
  const isUnlink = type === 'unlink'
  const isFile = type === 'file'
  const isSymlink = type === 'symlink'

  if (isUnlink) {
    if (isNotNil(dst)) throw new Error('Cannot set dst mode for unlink.')
    if (isNotNil(fmode)) throw new Error('Cannot set fmode mode for unlink.')
    if (isNotNil(dmode)) throw new Error('Cannot set dmode mode for unlink.')
    if (isNotNil(owner)) throw new Error('Cannot set owner for unlink.')
    if (isNotNil(group)) throw new Error('Cannot set group for unlink.')
  }

  if (isFile) {
    if (isNotNil(dmode)) throw new Error('Cannot set dmode mode for file.')
  }

  if (isSymlink) {
    if (isNotNil(fmode)) throw new Error('Cannot set fmode mode for symlink.')
    if (isNotNil(dmode)) throw new Error('Cannot set dmode mode for symlink.')
    if (isNotNil(owner)) throw new Error('Cannot set owner for symlink.')
    if (isNotNil(group)) throw new Error('Cannot set group for symlink.')
  }

  if (!isMatchingHost(hostname, hosts)) return null

  const arePackagesInstalled = await checkInstalledPkgs(packageChecker, pkgs)
  if (!arePackagesInstalled) return null

  const source = isSymlink || isUnlink
    ? path.resolve(targetRoot, src)
    : path.resolve(originRoot, src)

  const destination = dst == null
    ? path.resolve(targetRoot, src)
    : path.resolve(targetRoot, dst)

  if (isSymlink && source === destination) {
    throw new Error('Cannot link path to itself.')
  }

  return {
    source,
    destination,
    order: order == null ? defaultOrder : order,
    owner: owner == null ? defaultOwner : owner,
    group: group == null ? defaultGroup : group,
    fmode: fmode == null ? defaultFmode : parseMode(fmode),
    dmode: dmode == null ? defaultDmode : parseMode(dmode)
  }
}

module.exports = async ({
  hostname,
  originRoot,
  targetRoot,
  packageChecker,
  defaults = {},
  unlinks = [],
  directories = [],
  files = [],
  symlinks = []
}) => {
  const normalizer = createNormalizer({
    hostname,
    packageChecker,
    originRoot,
    targetRoot,
    defaultOwner: defaults.owner,
    defaultGroup: defaults.group,
    defaultFmode: defaults.fmode,
    defaultDmode: defaults.dmode
  })

  const normalizeTarget = async target => {
    try {
      return await normalizer(target)
    } catch (err) {
      console.error(`* Failed to parse or normalize: ${JSON.stringify(target)}`)
      throw err
    }
  }

  const normalizeTargets = x => x.map(normalizeTarget)

  const addType = (type, targets) => targets.map(x => ({...x, type}))
  const targetsByType = [
    addType('unlink', unlinks),
    addType('directory', directories),
    addType('file', files),
    addType('symlink', symlinks)
  ]

  const normalized = await Promise.all(
    targetsByType.map(x => Promise.all(normalizeTargets(x)))
  )

  const [ ul, di, fi, sl ] = normalized.map(x => x.filter(isNotNil))
  return {unlinks: ul, directories: di, files: fi, symlinks: sl}
}
