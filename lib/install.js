'use strict'

const isEmpty = x => x.length === 0

const makeGroups = (key, items) => {
  const sortedDescending = [...items].sort((x, y) => y[key] - x[key])

  const { groups } = sortedDescending.reduce(
    ({i, groups}, item) => {
      const next = item[key]
      const isNewGroup = next < i
      return {
        i: next,
        groups: isNewGroup
          ? [[item], ...groups]
          : [[...groups[0], item], ...groups.slice(1)]
      }
    }, {i: Infinity, groups: []}
  )

  return groups
}

const forEachGroup = async (f, items) => {
  const groups = makeGroups('order', items)
  for (const group of groups) {
    await Promise.all(group.map(f))
  }
}

const checkAccess = io => async ({
  source
}) => {
  try {
    await io.checkAccess({target: source})
  } catch (err) {
    console.error(`* Read failed: ${source}`)
    throw err
  }
}

const installDirectory = io => async ({
  source,
  destination,
  owner,
  group,
  fmode,
  dmode
}) => {
  try {
    await io.overwriteDirectory({source, destination})
    await io.chmodRecursive({fmode, dmode, target: destination})
    await io.chownRecursive({owner, target: destination})
    await io.chgrpRecursive({group, target: destination})
    console.info(`${source} => ${destination}`)
  } catch (err) {
    console.error(`* Install failed: ${source} => ${destination}`)
    throw err
  }
}

const unlink = io => async ({
  source
}) => {
  try {
    await io.unlink({target: source})
    console.info(`${source} <= /dev/null`)
  } catch (err) {
    console.error(`* Unlink failed: ${source} <= /dev/null #`)
    throw err
  }
}

const installFile = io => async ({
  source,
  destination,
  owner,
  group,
  fmode
}) => {
  try {
    await io.copyFile({source, destination})
    await io.chmod({mode: fmode, target: destination})
    await io.chown({owner, target: destination})
    await io.chgrp({group, target: destination})
    console.info(`${source} +> ${destination}`)
  } catch (err) {
    console.error(`* Install failed: ${source} +> ${destination}`)
    throw err
  }
}

const installSymlink = io => async ({
  source,
  destination
}) => {
  try {
    await io.makeSymlink({source, destination})
    console.info(`${source} -> ${destination}`)
  } catch (err) {
    console.error(`* Link failed: ${source} -> ${destination}`)
    throw err
  }
}

module.exports = async ({unlinks, directories, files, symlinks, io}) => {
  await Promise.all([...directories, ...files].map(checkAccess(io)))
  console.log('>> Unlinking paths')
  if (isEmpty(unlinks)) console.log('Nothing to do')
  await forEachGroup(unlink(io), unlinks)
  console.log()
  console.log('>> Installing directories')
  if (isEmpty(directories)) console.log('Nothing to do')
  await forEachGroup(installDirectory(io), directories)
  console.log()
  console.log('>> Installing files')
  if (isEmpty(files)) console.log('Nothing to do')
  await forEachGroup(installFile(io), files)
  console.log()
  console.log('>> Making symlinks')
  if (isEmpty(symlinks)) console.log('Nothing to do')
  await forEachGroup(installSymlink(io), symlinks)
}
