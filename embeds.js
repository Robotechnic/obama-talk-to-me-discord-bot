const helpEmbed = {
	"color":0000,
	"author": {
		"name": 'Obama help command:',
		"icon_url": 'https://cdn.discordapp.com/app-icons/764553821807706122/d582b2fe95bf35fdcc7a476ed8729a7a.png?size=64'
	},
	"fields": [
		{
			"name":"!help",
			"value":"Affiche ce message"
		},
		{
			"name":"!obama [texte]",
			"value":"Fait dire ce que vous voulez a obama en utilisant http://talkobamato.me"
		}
	]
}

videoEmbed = (url) => {
	return {
		"color":0000,
		"author": {
			"name": 'Obama say:',
			"icon_url": 'https://cdn.discordapp.com/app-icons/764553821807706122/d582b2fe95bf35fdcc7a476ed8729a7a.png?size=64'
		},
		// "fields": [
		// 	{
		// 		"name":"",
		// 		"value":url
		// 	}
		// ]
		"url":url
	}
}

module.exports = {
	"helpEmbed":helpEmbed,
	"videoEmbed":videoEmbed
}