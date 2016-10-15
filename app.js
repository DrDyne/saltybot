"use strict";
const settings = require('./settings')
const Discord = require('discord.js')
const Bot = require('./bot')
const client = new Discord.Client()

var bot = new Bot(client)

client.on('message', (message) => {
  console.log('?', message.content)
  bot.read(message)
     .then(bot.reply(message))
     .catch(console.error.bind(null, '(╯°□°)╯︵ ┻━┻'))
})

console.log('connecting...')
client.login(settings.token);

client.on('ready', () => {
  console.log('t(ಠ_ಠt) sup\' bb?')
})
