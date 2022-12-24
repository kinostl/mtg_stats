const arrs = [
  [128, 31, 128],
  [31, 128, 31],
  [128, 31, 31],
  [31, 31, 128],
  [2, 12, 256],
  [1, 256, 31],
  [31, 256, 12],
  [31, 12, 256],
  [31, 12, 256]
]

function getHash (row, digitHashTable) {
  let res = 0
  for (let i = 0; i < row.length; i++) {
    res = (31 * res + row[i]) % arrs.length
  }
  return res
}

function getHashes (rows) {
  return rows.map(row => getHash(row))
}

function getHashIsDuplicate (hashes) {
  const isDupes = []
  for (let y = 0; y < hashes.length; y++) {
    let isDupe = 0
    const hashA = hashes[y]
    for (let i = y + 1; i < hashes.length; i++) {
      const hashB = hashes[i]
      let dupes = 0
      if (hashA === hashB) {
        isDupe = 1
        break
      }
    }
    isDupes.push(isDupe)
  }
  return isDupes
}

function blankDuplicateRows (rows, dupes) {
  const outs = []
  for (let y = 0; y < rows.length; y++) {
    const isDupe = dupes[y]
    const row = rows[y]
    const outRow = []
    for (let x = 0; x < row.length; x++) {
      const letter = row[x]
      if (isDupe) {
        outRow.push(0)
      } else {
        outRow.push(letter)
      }
    }
    outs.push(outRow)
  }
  return outs
}

const hashes = getHashes(arrs)
console.log(hashes)
const dupes = getHashIsDuplicate(hashes)
console.log(dupes)
const blanks = blankDuplicateRows(arrs, dupes)
console.log(blanks)
