const fs = require('fs');

// read the joke JSON file and turn it into a newline separated txt file
fs.readFile('badjokesSentences.json', 'utf8', (err, data) => {
  if (err) throw err;
  let text = JSON.parse(data).jokes
  .map(joke => joke
    .replace('&ldquo;', '\"')
    .replace('&rdquo;', '\"')
    .replace('&quot;', '\"')
    .replace('&rsquo;', '\'')
    .replace('&hellip;', '...'))
  .join('\n');
  fs.writeFile('jokesText.txt', text, err => {
    if (err) throw err;
    console.log('written successfully!');
  })
})