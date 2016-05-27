var Discord = require('discord.js')
var bot = new Discord.Client()
var settings = require('./settings')

bot.on('ready', function () {
	console.log(bot.username, '-', bot.id)
})

bot.on('message', function (user, userID, chan, message, event) {
	console.log('message', message)
	bot.sendMessage({to: chan, message: 'lol'})
})

bot.loginWithToken(settings.token)
.then(function (token) {
	console.log('logged in !', token);
	console.log('joining...', settings.invite);

	bot.joinServer(settings.invite)
	.then(function () {
		console.log('joined')
	}, function () {
		console.error('could not join')
	})


}, function couldNotLogin (err) {
	console.log(err);
})