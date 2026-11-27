const stateKey = 'jobswipe:demo:v1'

export function readDemo() {
  const empty = { votes: {}, edits: {}, accountId: 'hahn' }
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(stateKey)) }
  } catch {
    return empty
  }
}

export function writeDemo(demo) {
  try {
    localStorage.setItem(stateKey, JSON.stringify(demo))
    return true
  } catch {
    return false
  }
}

function openVideoDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('jobswipe-media', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('videos')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function videoTransaction(mode, run) {
  const database = await openVideoDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction('videos', mode)
      const request = run(transaction.objectStore('videos'))
      transaction.oncomplete = () => resolve(request.result)
      transaction.onabort = () => reject(transaction.error)
    })
  } finally {
    database.close()
  }
}

export function readVideo(id) {
  return videoTransaction('readonly', (videos) => videos.get(id))
}

export function writeVideo(id, file) {
  return videoTransaction('readwrite', (videos) => videos.put(file, id))
}
