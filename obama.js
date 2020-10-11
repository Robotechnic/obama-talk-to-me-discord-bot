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
	currentRequest = ""
	videoId = -1

	constructor () {
		super()
	}

	newVideo(text){
		console.log(text)
		var texts = [text]
		while (texts[texts.length-1].length > maxCaracter){
			temp = texts[texts.length-1]
			texts[texts.length-1] = temp.slice(0,maxCaracter-1)
			texts.push(temp.slice(maxCaracter))
		}

		for (var i = 0; i<texts.length; i++){
			this.makeRequest(texts[i])
		}
	}

	makeRequest(text){
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
			//console.log(res.responseUrl)
			this.requestStack.push(this.parseUrl(res.responseUrl))
			if (this.videoId == -1)
				this.checkVideo()
		})

		req.on("error",error=>{
			console.log('error:',error)
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
		if (this.currentRequest == "" && this.requestStack.length > 0)
			this.currentRequest = this.requestStack.shift()

		//console.log('checkVideo',this.currentRequest)

		const options = {
			hostname:webSite,
			path:exist+this.currentRequest+file,
			method:"GET"
		}

		const req = http.request(options,res=>{
			console.log(res.status)
			if (res.status != 404){
				this.emit("newVideo",res.responseUrl)
				this.currentRequest = ""
			} 

			if (this.requestStack.length > 0 || res.status == 404)
				this.videoId = setTimeout(this.checkVideo, 10000)
			else
				this.videoId = -1
		})

		req.on("error",error=>{
			console.log('error:',error)
		})

		req.end()
	}
}

module.exports = obamaRequest

/*
output_dir = 'synth/output/';

flag_fname = 'video_created.txt';

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function reloadIfExists(speech_key)
{
	//hostname = location.hostname;
	flag_url = output_dir.concat("/",speech_key, "/", flag_fname);
	console.log(flag_url);
	var exists = UrlExists(flag_url);
	
	if (exists) {
		// reload the page
		location.reload(true);
	}
}*/