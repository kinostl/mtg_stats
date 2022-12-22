function getHash (row) {
  let hash = row[0]
  for (let i = 1; i < row.length; i++) {
    hash += row[i] * 2 * i
  }
  return hash
}
function getHashes (rows) {
  return rows.map(row => getHash(row))
}

console.log(
  getHashes([
    [0, 31, 0],
    [31, 0, 31],
    [0, 31, 31],
    [31, 31, 0],
    [3, 1, 2],
    [2, 1, 2],
    [3, 1, 2],
    [1, 2, 3],
    [3, 2, 1]
  ])
)
