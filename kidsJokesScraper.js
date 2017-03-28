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
    let counter = 0
    let completeResult = {}
    resultsArray.forEach(entry => {
      entry.posts.forEach(post => {
        completeResult[counter++] = post.body
      })
    })
    return writeFile('badjokes.json', JSON.stringify(completeResult), 'utf8')
  })
  .then(() => {
    console.log('successfullly written!')
  })
  .catch(console.error.bind(console))