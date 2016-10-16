"use strict";
const Message = require('../message')

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
    let Player = Players.find((p) => name === p.name)
    let message1 = new Message('md')
    message1.add('#' + Player.name)
    message1.add('> salt: [' + Player.salt + ']')
    message1.add('> Characters: ' + Player.played_characters.reduce((memo, id) => {
      let char = Characters.find((c) => c.id === id)
      return memo.concat(char.name)
    }, []).join(', '))
    return message1.toText()
  })
}

function getAllPlayers () {
  console.log('getting all players')

  return api.get('/players')
  .then((Players) => {
    let message = new Message('md')

    Players.forEach((p) => {
      message.add('+ ' + p.name)
      message.add('|- salt: ' + p.salt)
    })

    console.log(message, message.toString())
    return message.toText()
  })
}
