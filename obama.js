const url = require('url')
const {http,https} = require("follow-redirects")
const querystring = require('querystring');
const EventEmitter = require('events');

const webSite = "talkobamato.me"
const post = "/synthesize.py"
const exist = "/synth/output/"
const file = "/obama.mp4"
const maxCaracter = 280

class obamaRequest extends EventEmitter{

	requestStack = [] //contain all vidéo token
	currentRequest = {}
	videoId = -1

	constructor () {
		super()
	}

	newVideo(text,id){
		var texts = [text]
		while (texts[texts.length-1].length > maxCaracter){
			temp = texts[texts.length-1]
			texts[texts.length-1] = temp.slice(0,maxCaracter-1)
			texts.push(temp.slice(maxCaracter))
		}

		for (var i = 0; i<texts.length; i++){
			this.makeRequest(texts[i],id)
		}
	}

	makeRequest(text,id){
		
		const data = querystring.stringify({
			"input_text":text
		})

		const options = {
			hostname:webSite,

			path:post,
			method:"POST",
			headers :{
				'Content-Type': 'application/x-www-form-urlencoded',
    			'Content-Length': Buffer.byteLength(data)
			}
		}

		const req = http.request(options, res =>{
			//console.log("httprequest post",this.parseUrl(res.responseUrl),id)
			this.requestStack.push({
				"id":this.parseUrl(res.responseUrl),
				"channelId":id
			})
			if (this.videoId == -1)
				this.checkVideo()
		})

		req.on("error",error=>{
			console.log('error post request:',error)
		})

		req.write(data)
		req.end()
	}

	parseUrl (url) {
		//return the speech key of url exemple:
		//http://talkobamato.me/synthesize.py?speech_key=eadb1fc16ea0c7fc584d78e148489565
		//will return eadb1fc16ea0c7fc584d78e148489565

		var argRegex = /([a-z_\-]+)=([a-z_\-%0-9]+)/g
		var args = url.match(argRegex)
		

		if (args == undefined){
			return false
		} else {
			for (var i = 0; i < args.length; i++){
				var values = args[i].split("=")
				if (values[0] == "speech_key"){
					return values[1]
				}
			}
		}
	}

	checkVideo (){
		if ((this.currentRequest.id == undefined || this.currentRequest.channelId==undefined) && this.requestStack.length > 0){
			//console.log('New request')
			this.currentRequest = this.requestStack.shift()
		}


		const options = {
			hostname:webSite,
			path:exist+this.currentRequest.id+file,
			method:"GET"
		}

		const req = http.request(options,res=>{
			//console.log(res.status)
			if (res.status != 404){
				this.emit("newVideo",{"url":res.responseUrl,"channelId":this.currentRequest.channelId})
				this.currentRequest = {}
			} 

			if (this.requestStack.length > 0 || res.status == 404)
				this.videoId = setTimeout(this.checkVideo, 10000)
			else
				this.videoId = -1
		})

		req.on("error",error=>{
			console.log('error get request:',error)
		})

		req.end()
	}
}

module.exports = obamaRequest
