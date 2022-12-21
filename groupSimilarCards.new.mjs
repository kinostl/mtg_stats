import fs from 'node:fs/promises'
import cliProgress from 'cli-progress'

const groupMin = 3
const matchMin = 0.6
const blankMin = 0.5
const destinationPath = './templates'

function groupSimilarCards (list, fileName) {
  const filteredList = [...new Set(list)]
  //filteredList is sorted by first word
  const templateList = filteredList
    .map(o => o.split(' '))
    .sort((a, b) => a.length - b.length)
    .reduce((templates, sentence, x, arr) => {
      // Is this just for efficiency?
      // We can assume all sentences behind this have been grouped because of the order.
      const shortList = arr.slice(x + 1)

      //control sentence is compared to every remaining sentence
      const matchList = shortList.reduce((groups, test) => {
        //test is sentence being tested
        //whole sentence gets a score
        const matchPoints = test.reduce((points, word) => {
          //every word in the sentence is compared to every other word in every other sentence. All we're looking for is frequency.
          //this is to filter out one-off effects that don't have a pattern to compare against.
          if (sentence.indexOf(word) > -1) points++
          return points
        }, 0)
        const matchScore = matchPoints / sentence.length

        //tested sentence gets pushed because our algo assumes the shortest version is the easiest to template. It drops any words not in every other thing in the group.
        if (matchScore > matchMin) groups.push(test)
        return groups
      }, [])

      if (matchList.length >= groupMin) {
        const template = sentence.reduce((parts, word) => {
          if (matchList.every(group => group.indexOf(word) > -1)) {
            parts.push(word)
          } else {
            parts.push('BLANK')
          }
          return parts
        }, [])
        const blankPoints = template.reduce((score, part) => {
          if (part.localeCompare('BLANK')) score++
          return score
        }, 0)
        const blankScore = blankPoints / sentence.length
        if (blankScore >= blankMin) {
          const templateString = template.join(' ').replaceAll('BLANK', '___')
          templates.push(templateString)
        }
      }
      return templates
    }, [])

  const dedupedTemplates = [...new Set(templateList)]

  return fs.writeFile(
    `${destinationPath}/${fileName}.json`,
    JSON.stringify(dedupedTemplates, null, 2)
  )
}

export default groupSimilarCards
