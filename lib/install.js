'use strict'

const isEmpty = x => x.length === 0

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
  await Promise.all(unlinks.map(unlink(io)))
  console.log()
  console.log('>> Installing directories')
  if (isEmpty(directories)) console.log('Nothing to do')
  await Promise.all(directories.map(installDirectory(io)))
  console.log()
  console.log('>> Installing files')
  if (isEmpty(files)) console.log('Nothing to do')
  await Promise.all(files.map(installFile(io)))
  console.log()
  console.log('>> Making symlinks')
  if (isEmpty(symlinks)) console.log('Nothing to do')
  await Promise.all(symlinks.map(installSymlink(io)))
}
