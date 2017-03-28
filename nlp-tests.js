const nlp = require('compromise')
const fs = require('fs')

const texts = JSON.parse(fs.readFileSync('badjokes.json').toString());

let test = texts[208]
  .replace(/<br\/>/g, '\n')
  .replace(/<[/]*[\s\S]+?>/g, '')
console.log(test)
var text = nlp(test)

var nouns = text.nouns()
console.log(nouns.out('array'))