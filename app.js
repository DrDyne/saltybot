var Discord = require('discord.js')
var bot = new Discord.Client()
var token = require('token')

bot.on('ready', function () {
	console.log(bot.username, '-', bot.id)
})

bot.on('message', function (user, userID, chan, message, event) {
	console.log('message', message)
	bot.sendMessage({to: chan, message: 'lol'})
})

bot.loginWithToken(token)