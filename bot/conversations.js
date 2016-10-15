module.exports = class Conversations {
  constructor (options) {
    options = options || {}
    this.max = options.max || 10
    this.authors = {}
    this.channels = {}
    this.history = [];
  }

  add (msg) {
    if ( this.history.length > this.max ) throw 'History limit exceeded'

    if ( !this.authors[msg.author.username] ) this.authors[msg.author.username] = []
    this.authors[msg.author.username].push(msg)

    if ( !this.channels[msg.channel.id] ) this.channels[msg.channel.id] = []
    this.channels[msg.channel.id].push(msg)

    this.history.push(msg)
  }

  clear () {
    Object.keys(this.authors).forEach((username) => {
      this.authors[username] = [];
    })

    Object.keys(this.channels).forEach((id) => {
      this.channels[id] = [];
    })

    this.history = []
  }
}
