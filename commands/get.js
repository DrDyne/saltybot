"use strict";
const Message = require('../bot/message')

const Characters = require('./characters')
const Api = require('./api'), api = new Api()

module.exports = {
  player: getPlayer,
  allPlayers: getAllPlayers,
}

function getPlayer (name) {
  console.log('getting player', name)
  if ( !name ) return getAllPlayers()

  return api.get('/players')
  .then((Players) => {
    var Player = Players.find((p) => name === p.name)
    var message1 = new Message('md')
    message1.add('#' + Player.name)
    message1.add('> salt: [' + Player.salt + ']')

    var message2 = new Message()
    message2.add('Played characters:')
    Player.played_characters.forEach((id) => {
      var char = Characters.find((c) => c.id === id)
      var url = 'https://saltoverflow.herokuapp.com/public/images/characters/small/' + char.code + '.png'
      message2.add(url)
    })
    return message1.toText() + message2.toText()
  })
}

function getAllPlayers () {
  console.log('getting all players')

  return api.get('/players')
  .then((Players) => {
    var message = new Message('md')

    Players.forEach((p) => {
      message.add('+ ' + p.name)
      message.add('|- salt: ' + p.salt)
    })

    console.log(message, message.toString())
    return message.toText()
  })
}
