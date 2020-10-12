const config = require("./config.json")
const discord = require("discord.js")
const obama = require("./obama.js")
const customEmbed = require("./embeds.js")

var bot = new discord.Client()
var obamaRequest = new obama()


bot.once('ready', () => {
	console.log('Ready!')
})


obamaRequest.on("newVideo",(channel)=>{
	//console.log('new video',channel)
	//bot.channels.cache.get(channel.channelId).send({ embed: customEmbed.videoEmbed(channel.url) })
	bot.channels.cache.get(channel.channelId).send(channel.url)
})


bot.on("message",message => {
	if (!message.content.startsWith(config.prefix) && message.author.bot){
		return
	}
	const args = message.content.slice(config.prefix.length).trim().split(' ')
	const command = args.shift().toLowerCase()
	
	if (command == "help"){
		message.channel.send({ embed: customEmbed.helpEmbed })

	} else if (command == "obama"){
		console.log("command obama",message.channel.id)
		obamaRequest.newVideo(args.join(" "),message.channel.id)
	}
})

bot.login(config.token)


//add bot to server
//https://discord.com/oauth2/authorize?client_id=764553821807706122&scope=bot&permissions=190464