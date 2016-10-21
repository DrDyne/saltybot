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
    let answer = new Message({type: 'md'})
    answer.add('#' + Player.name)
    answer.add('> salt: [' + Player.salt + ']')
    answer.add('> Characters: ' + Player.played_characters.reduce((memo, id) => {
      let char = Characters.find((c) => c.id === id)
      return memo.concat(char.name)
    }, []).join(', '))
    return answer.toText()
  })
}

function getAllPlayers () {
  console.log('getting all players')

  return api.get('/players')
  .then((Players) => {
    let answer = new Message({type: 'md'})

    Players.forEach((p) => {
      answer.add('+ ' + p.name)
      answer.add('|- salt: ' + p.salt)
    })

    return answer.toText()
  })
}
