import fs from 'node:fs/promises'

const matchCache = new Map()
async function loadFiles (cache) {
  let largestNumber = 0
  const files = await fs.readdir('./groupOutputs')
  for (const file of files) {
    const number = Number(file.split('.')[0])
    if (Number.isInteger(number)) {
      if (number > largestNumber) largestNumber = number
      const groupRes = await fs.readFile(`./groupOutputs/${file}`)
      const group = JSON.parse(groupRes)
      group.forEach((control, x, arr) => {
        arr.forEach(test => {
          cache.set([control, test], test)
        })
      })
    }
  }
  return largestNumber
}

const largestNumber = await loadFiles(matchCache)
console.log(largestNumber)
console.log(matchCache)
