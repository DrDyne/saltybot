"use strict";
var settings = require('./settings')
var Api = require('./api')

module.exports = class Bot {
  constructor () {
    console.log('assembling bot...')

    this.message = undefined;
    this.api = new Api()
    //TODO move get commands(){} to its own file 
    // this.commands.run('get', id)
    // this.commands.run('
    //
    //this.commands = require('./commands')
  }

  get commands () {
    return [{
      name: 'ping',
    }, {
      name: 'get',
      definitions: [{
        syntax: /get (\w+)/, 
        exec: 'getPlayer', args: ['id'], 
      }, {
        syntax: /get player (\w+)/, 
        exec: 'getPlayer', args: ['id']
      }, {
        syntax: /get/, 
        exec: 'getAllPlayers', args: [],
      }, {
        syntax: /get all/,
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

  read (msg) {

    if ( this.isCommand('ping', msg) )
      return this.pong(msg).catch(handleError)

    if ( this.isCommand('get', msg) ) {
      var args = this.parseArgs('get', msg.content)
      console.log('args... ', args)
      return this.getPlayer(args.id).catch(handleError)
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
    return (answer) => { msg.reply(answer) }
  }

  pong (msg) {
    return Promise.resolve('pong!')
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

  getPlayers () {
    console.log('getting all players')

    return this.api.get('/players')
    .then((Players) => {
      console.info('got players')
      console.info(Players)
      var message = '\n';

      Players.reduce((message, player) => {
        return message + '- ' + player.name + '\n'
      }, message)

      return message
    })
  }

  getPlayer (id) {
    console.log('getting player', id)
    if ( !id ) return this.getPlayers()

    return this.api.get('/players/' + id)
    .then((Player) => {
      console.info('got %s', id)
      return '```' + JSON.stringify(Player, null, 2) + '```'
    })
  }
}
