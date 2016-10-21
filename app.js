"use strict";
const settings = require('./settings')
const Discord = require('discord.js')
const Bot = require('./bot')
const client = new Discord.Client()

console.log('connecting...')
client.login(settings.token);

client.on('ready', () => {
  var bot = new Bot(client, settings)
  console.log('(ಠ_ಠ)/ sup\' bb?')
  console.log('- %s', bot.name)

  client.on('message', (message) => {
    console.log('?', message.content)
    bot.read(message)
       .then(bot.reply(message), (err) => {
        console.error(err)
        Promise.resolve()
      })
       .catch(console.error.bind(null, '(╯°□°)╯︵ ┻━┻'))
  })

})
