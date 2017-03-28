const nlp = require('compromise')
const fs = require('fs')

let jokes = JSON.parse(fs.readFileSync('badjokesSentences.json').toString()).jokes;

jokes = jokes.map(joke => joke.replace('&ldquo;', '\"')
  .replace('&rsquo;', '\'')
  .replace('&hellip;', '...'))

const Markov = require('markov-strings');

const markov = new Markov(jokes, {
  stateSize: 2,
  maxWords: 30,
});
markov.buildCorpusSync();
const result = markov.generateSentenceSync();
console.log(result);
