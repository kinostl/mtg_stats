import fs from 'node:fs/promises'
import cliProgress from 'cli-progress'

const groupMin = 3
const matchMin = 0.7
const blankMin = 0.5
const destinationPath = './templates'

function groupSimilarCards (list, fileName) {
  const filteredList = [...new Set(list)]
  const templateList = filteredList
    .map(o => o.split(' '))
    .sort((a, b) => a.length - b.length)
    .reduce((templates, sentence, x, arr) => {
      const shortList = arr.slice(x + 1)
      const matchList = shortList.reduce((groups, test) => {
        const matchPoints = test.reduce((points, word) => {
          if (sentence.indexOf(word) > -1) points++
          return points
        }, 0)
        const matchScore = matchPoints / sentence.length
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
