"use strict";
var shortid = require('shortid')

var Message = require('./message')
var Conversations = require('./conversations')

var settings = require('../settings')
var Commands = require('../commands')

module.exports = class Bot {
  constructor (client) {
    console.log('assembling bot...')
    this.client = client
    this.conversations = new Conversations()
    console.log('loading commands into memory')
    console.log(Commands)
    this.cmd = Commands
  }

  read (msg) {
    if ( this.isCommand('ping', msg) )
      return this.cmd.pong(msg).catch(handleError)

    if ( this.isCommand('get', msg) ) {
      var args = this.parseArgs('get', msg.content)
      console.log('args... ', args)
      return this.cmd.get.player(args.id)
      .catch(handleError)
    }

    return Promise.reject()

    function handleError (err) {
      console.error(err)
      throw err
    }
  }

  isCommand (command, msg) {
    var rgx = '^!' + settings.prefix + command
    return RegExp(rgx + '$').test(msg.content) || RegExp(rgx).test(msg.content)
  }

  reply (msg) {
    return (answer) => {
      if ( msg.channel ) msg.channel.sendMessage(answer)
      else msg.reply(answer)
    }
  }


  get commands () {
    return [{
      name: 'ping',
    }, {
      name: 'get',
      definitions: [{
        syntax: /get players/,
        exec: 'getAllPlayer', args: [],
      }, {
        syntax: /get all/,
        exec: 'getAllPlayers', args: [],
      }, {
        syntax: /get player (\w+)/,
        exec: 'getPlayer', args: ['id'],
      }, {
        syntax: /get all players/,
      exec: 'getAllPlayer', args: [],
      }, {
        syntax: /get (\w+)/,
        exec: 'getPlayer', args: ['id'],
      }, {
        syntax: /get/,
        exec: 'getAllPlayers', args: [],
      }]
    }, {
      name: 'start',
      definitions: [{
        syntax: /start (\w+) vs (\w+)/,
        exec: 'startMatch', args: ['p1', 'p2']
      }, {
        syntax: /start vs (\w+)/,
        exec: 'startMatch', args: ['p2']
      }]
    }]
  }

  parseArgs (name, cmdStr) {
    var command = this.commands.find((command) => command.name === name)
    if ( !command ) throw 'Unknown command'

    var definition = command.definitions.find((def) => { return cmdStr.match(def.syntax) })
    if ( !definition ) throw 'Bad syntax'

    var args = cmdStr.match(definition.syntax)
    return definition.args.reduce((memo, name, index) => {
      memo[name] = args[index+1]
      return memo
    }, {})
  }
}