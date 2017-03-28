const tumblr = require('tumblr.js')
const Promise = require('bluebird')
var writeFile = Promise.promisify(require('fs').writeFile)

const tumblrSecrets = require('./tumblr.secrets')

const client = new tumblr.createClient({
  credentials: tumblrSecrets,
  returnPromises: true,
})

client.blogPosts('badkidsjokes.tumblr.com')
  .then(results => {
    return results.total_posts
  })
  .then(totalPosts => {
    const requests = totalPosts / 20;
    const promises = [];
    for (let i = 0; i < requests; i++) {
      promises.push(client.blogPosts('badkidsjokes.tumblr.com', {
        type: 'text',
        offset: i * 20,
      }))
    }
    return Promise.all(promises)
  })
  .then(resultsArray => {
    let completeResult = {jokes: []}
    resultsArray.forEach(entry => {
      entry.posts.forEach(post => {
        let normalized = post.body
          .split(/(<\/[\s\S]+?>)|\n/g)
          .filter(element => element)
          .map(element => {
            return element
              .replace(/<[/]*[\s\S]+?>/g, '')
          })
          .filter(element => element !== '')
        completeResult.jokes.push(...normalized)
      })
    })
    return writeFile('badjokesSentences.json', JSON.stringify(completeResult), 'utf8')
  })
  .then(() => {
    console.log('successfullly written!')
  })
  .catch(console.error.bind(console))