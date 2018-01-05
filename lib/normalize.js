'use strict'

const os = require('os')
const path = require('path')

const isNotNull = x => x !== null

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
    return await checker(pkgs)
  } catch (err) {
    console.error(`Failed to check for packages: ${pkgs.join(', ')}.`)
    throw err
  }
}

const isMatchingHost = (hostname, hosts) => {
  if (hosts == null) return true
  assertArrayOfStrings(hosts)
  return hosts.include(hostname)
}

const createNormalizer = ({
  root = path.resolve(process.cwd(), 'dest'),
  hostname = os.hostname(),
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
  owner,
  group,
  fmode,
  dmode,
  type
}) => {
  const isDir = type === 'directory'
  const isFile = type === 'file'
  const isSymlink = type === 'symlink'

  if (isDir) {
    if (fmode != null) throw new Error('Cannot set fmode mode for file.')
  }

  if (isFile) {
    if (dmode != null) throw new Error('Cannot set dmode mode for directory.')
  }

  if (isSymlink) {
    if (fmode != null) throw new Error('Cannot set fmode mode for symlink.')
    if (dmode != null) throw new Error('Cannot set dmode mode for symlink.')
    if (owner != null) throw new Error('Cannot set owner for symlink.')
    if (group != null) throw new Error('Cannot set group for symlink.')
  }

  if (!isMatchingHost(hostname, hosts)) return null

  const arePackagesInstalled = await checkInstalledPkgs(packageChecker, pkgs)
  if (!arePackagesInstalled) return null

  const source = isSymlink
    ? path.resolve(root, src)
    : path.resolve(src)

  const destination = dst == null
    ? path.resolve(root, src)
    : path.resolve(root, dst)

  return {
    source,
    destination,
    owner: owner == null ? defaultOwner : owner,
    group: group == null ? defaultGroup : group,
    fmode: fmode == null ? defaultFmode : parseMode(fmode),
    dmode: dmode == null ? defaultDmode : parseMode(dmode)
  }
}

module.exports = async ({hostname, root, packageChecker, ...manifest}) => {
  const normalizer = createNormalizer({hostname, packageChecker, root})

  const normalizeTarget = async target => {
    try {
      return await normalizer(target)
    } catch (err) {
      console.error(`Failed to parse or normalize: ${JSON.stringify(target)}`)
      throw err
    }
  }

  const normalizeTargets = x => x.map(normalizeTarget)

  const targetsByType = [
    manifest.directories.map(x => ({...x, type: 'directory'})),
    manifest.files.map(x => ({...x, type: 'file'})),
    manifest.symlinks.map(x => ({...x, type: 'symlink'}))
  ]

  const normalized = await Promise.all(
    targetsByType.map(x => Promise.all(normalizeTargets(x)))
  )

  const [ directories, files, symlinks ] = normalized.map(x => x.filter(isNotNull))

  return {directories, files, symlinks}
}
