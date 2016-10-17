"use strict";
const Scenarios = require('./scenarios')
const Dialog = require('./dialog')

module.exports = class Conversations {
  constructor (settings, user) {
    this.user = user
    this.max = settings.history.max || 10
    this.history = []
  }

  find (author, channel) {
    return this.history.find((conv) => {
      return (conv.author === author) && (conv.channel === channel)
    })
  }

  findIndex (author, channel) {
    return this.history.findIndex((conv) => {
      return (conv.author === author) && (conv.channel === channel)
    })
  }

  update (msg) {
    let dialog = this.find(msg.author, msg.channel).dialog
    return dialog.tick(msg)
    .then((res) => {
      if ( dialog.resolved ) this.clear(msg)
      return res
    })
  }

  findScenarioFor (content) {
    return Scenarios.find((scenario) => {
      return content.match(scenario[0].syntax)
    })
  }

  start (msg) {
    if ( this.history.length > this.max ) throw 'History limit exceeded'
    let previous = this.find(msg.author, msg.channel)

    let input = this.parse(msg.cleanContent)
    let overridePreviousDialog = /^yo/.test(input) || /^sudo/.test(input)
    let Scenario = this.findScenarioFor(input)

    if ( !Scenario ) throw 'No scenario for conversation'
    if ( !previous ) {
      let dialog = new Dialog(this.user, msg, Scenario)
      console.log(`new dialog with ${dialog.with} at ${dialog.at}`)

      this.history.push({
        author: msg.author,
        channel: msg.channel,
        dialog: dialog
      })
      return dialog.tick(msg)

    } else if ( !overridePreviousDialog ) {
      console.log(`chatting with ${msg.author.username}`)
      return previous.dialog.tick(msg)

    } else if ( overridePreviousDialog ) {
      console.log(`reseting conversation with ${msg.author.username}`)
      let dialog = new Dialog(this.user, msg, Scenario)
      let previousIndex = this.findIndex(msg.author, msg.channel)
      this.history[previousIndex] = {
        author: msg.author,
        channel: msg.channel,
        dialog: dialog
      }

      return dialog.tick(msg)
    }
  }

  parse (content, options) {
    return content.replace(RegExp('@' + this.user.username), '').trim()
  }

  clear (msg) {
    if ( !msg ) return this.history = []

    let index = this.findIndex(msg.author, msg.channel)
    this.history.splice(index, 1)
  }
}
