import ss from 'sentence-similarity'
import thesaurus from 'thesaurus'

let similarity = ss.sentenceSimilarity
let similarityScore = ss.similarityScore
let min = (a, b) => {
  if (a < b) return a
  else return b
}

let similar = async (sentence1, sentence2) => {
  let s1 = sentence1.split(' ')
  let s2 = sentence2.split(' ')
  let numbers = await Promise.all(
    s1.map(
      async e =>
        similarity(s1, s2, winkOpts)['score'] / min(s1.length, s2.length)
    )
  )
  return Math.max.apply(null, numbers) >= 0.9
}

let winkOpts = {
  f: similarityScore.winklerMetaphone,
  options: { threshold: 0 }
}

const filter = async (source, matchRider) => {
  await Promise.all(
    source.map(async (x, xi, xarr) => {
      const output = await Promise.all(
        xarr.map(async y => {
          if (await similar(x, y)) return y
          return null
        })
      )
      const filtered = output.filter(e => e)

      await matchRider(filtered, xi)
    })
  )
  // matches.splice(0, 1);
  // return matches
}

export default filter
