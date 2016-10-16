"use strict";
const Dialogs = require('./dialogs')

module.exports = class Conversations {
  constructor (settings, user) {
    this.user = user
    this.max = settings.history.max || 10
    this.history = []
    this.dialogs = Dialogs
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

  //WIP
  findDialog (msg) {
    return class FakeDialog {
      constructor (msg) {
        this.msg = msg
      }
      get with () { return this.msg.author.username }
      get at () { this.msg.channel.id }
      tick () { console.log('tick'); return Promise.resolve(this) }
    }

    //return this.dialogs.find((dialog) => {
    //})
  }

  update (msg) {
    let dialog = this.find(msg.author, msg.channel).dialog
    return dialog.tick(msg)
    .then((res) => {
      if ( dialog.isFinished ) this.clear(msg)
      return res
    })
  }

  start (msg) {
    if ( this.history.length > this.max ) throw 'History limit exceeded'
    let input = this.parse(msg.cleanContent)

    let overridePreviousDialog = /^yo/.test(input) || /^sudo/.test(input)

    let Dialog = this.findDialog(msg)
    if ( !Dialog ) return;

    let previous = this.find(msg.author, msg.channel)

    if ( !previous ) {
      let dialog = new Dialog(this.user, msg)
      console.log('new dialog with %s at %s', dialog.with, dialog.at)

      this.history.push({
        author: msg.author,
        channel: msg.channel,
        dialog: dialog
      })
      return dialog.tick(msg)

    } else if ( !overridePreviousDialog ) {
      console.log('chatting with %s', msg.author.username)
      return previous.dialog.tick(msg)

    } else if ( overridePreviousDialog ) {
      console.log('reseting conversation with %s', msg.author.username)
      let dialog = new Dialog(this.user, msg)
      let previousIndex = this.findIndex(msg.author, msg.channel)
      this.history[previousIndex] = {
        author: msg.author,
        channel: msg.channel,
        dialog: dialog
      }

      return dialog.tick()
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
