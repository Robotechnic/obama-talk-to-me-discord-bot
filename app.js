const config = require("./config.json")
const discord = require("discord.js")
const obama = require("./obama.js")

var bot = new discord.Client()
var obamaRequest = new obama()


bot.once('ready', () => {
	console.log('Ready!')
})


obamaRequest.on("newVideo",(url)=>{
	console.log('new video',url)
})


bot.on("message",message => {
	if (!message.content.startsWith(config.prefix) && message.author.bot){
		return
	}
	const args = message.content.slice(config.prefix.length).trim().split(' ')
	const command = args.shift().toLowerCase()
	
	if (command == "help"){
		data = [
			"**Obama help command:**",
			"**!obama [message]**",
			"create a vidéo using obamatalktome",
			"**!help**",
			"display this message",
			message.author,
		]
		message.channel.send(data,{split:true})

	} else if (command == "obama"){
		obamaRequest.newVideo(args.join(" "))
		message.delete()
	}
})

bot.login(config.token)


//add bot to server
//https://discord.com/oauth2/authorize?client_id=764553821807706122&scope=bot&permissions=190464