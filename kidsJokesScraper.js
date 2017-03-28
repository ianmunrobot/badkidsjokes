const tumblr = require('tumblr.js')
const Promise = require('bluebird')
var writeFile = Promise.promisify(require('fs').writeFile)

const tumblrSecrets = require('./tumblr.secrets')

const client = new tumblr.createClient({
  credentials: tumblrSecrets,
  returnPromises: true,
})

// client.blogPosts('badkidsjokes.tumblr.com', {offset: 20})
// .then(console.log.bind(console))
// .catch(console.error)


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
    let completeResult = resultsArray.map(entry => {
      return entry.posts.reduce((accum, curr) => {
            return `${curr.body}\n\n\n${accum}`
        })
      })
    return writeFile('badjokes.txt', completeResult)
  })
  .then(() => {
    console.log('successfullly written!')
  })
  .catch(console.error.bind(console))