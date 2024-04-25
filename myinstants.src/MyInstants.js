const path = require("path");
const Plugin = require(path.resolve('./src/classes/Plugin'));

class MIP extends Plugin {
    constructor() {
        super('MyInstants', 'Freedeck', 'myinstants', false);
        this.version = '1.0.1';
    }

    onInitialize () {
        console.log('Initialized MIPlugin')
        this.setJSServerHook("mi/server.js");
        this.registerNewType('MyInstants Sound', 'mi.sound', {url:'https://www.myinstants.com/en/instant/vine-boom-sound-70972/'});
        console.log('Initializing MIAPI')
        return true;
    }

}

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

const cheerio = require('cheerio');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.get('/*', function (req, res) {
    if(!req.path.includes('https://')) {
    res.send({})    
    return;
    }
    res.set({
        "Content-Type": "application/json",
    });
    let url = req.path.split('/')
    url.shift()
    url = url.join('/')
    console.log(url)
	fetch(url)
    .then(res=>res.text())
    .then(body => {

		$ = cheerio.load(body)
        // $ = cheerio.load(test);

		var respondeArray = {}

		//only one on the page
		$('#instant-page-button-element').each(function(i, elem) {
			const url = $(this).attr('data-url');
			const slashes = url.split('/')
			slashes.pop()
            const path = "http://localhost:5576/myinstants.com" + slashes.join('/');
			const file = url.split('/').slice(3).join('/'); 
			respondeArray = {path, file};
		}); 

		res.send(respondeArray);
	}).catch(err => {
        console.error(err)
    })

})

app.listen(5575, () => {
    console.log('MiAPI initialized')
})


var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 5576;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

module.exports = {
	exec: () => new MIP(),
 	class: MIP
}