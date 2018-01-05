'use strict'

const checkAccess = io => async ({
  source
}) => {
  try {
    await io.checkAccess({target: source})
  } catch (err) {
    console.error(`Failed to read ${source}`)
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
    console.info(`Install ${source} to ${destination}`)
  } catch (err) {
    console.error(`Failed to install ${source} to ${destination}`)
    throw err
  }
}

const unlink = io => async ({
  source
}) => {
  try {
    await io.unlink({target: source})
    console.info(`Remove ${source}`)
  } catch (err) {
    console.error(`Failed to unlink ${source}`)
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
    console.info(`Install ${source} to ${destination}`)
  } catch (err) {
    console.error(`Failed to install ${source} to ${destination}`)
    throw err
  }
}

const installSymlink = io => async ({
  source,
  destination
}) => {
  try {
    await io.makeSymlink({source, destination})
    console.info(`Link ${source} to ${destination}`)
  } catch (err) {
    console.error(`Failed to link ${source} to ${destination}`)
    throw err
  }
}

module.exports = async ({unlinks, directories, files, symlinks, io}) => {
  await Promise.all([...directories, ...files].map(checkAccess(io)))
  await Promise.all(unlinks.map(unlink(io)))
  await Promise.all(directories.map(installDirectory(io)))
  await Promise.all(files.map(installFile(io)))
  await Promise.all(symlinks.map(installSymlink(io)))
}
