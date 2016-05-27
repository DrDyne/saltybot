var Discord = require('discord.js')
var bot = new Discord.Client()
var token = require('./token')

bot.on('ready', function () {
	console.log(bot.username, '-', bot.id)
})

bot.on('message', function (user, userID, chan, message, event) {
	console.log('message', message)
	bot.sendMessage({to: chan, message: 'lol'})
})

console.log('using token...', token);
bot.loginWithToken(token)
.then(function (token) {
	console.log('logged in !', token)

}, function couldNotLogin (err) {
	console.log(err);
})