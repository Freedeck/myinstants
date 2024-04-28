const path = require("path");
const Plugin = require(path.resolve('./src/classes/Plugin'));

class MIP extends Plugin {
    constructor() {
        super('MyInstants', 'Freedeck', 'myinstants', false);
        this.version = '2.0.0';
    }

    onInitialize() {
        console.log('Initialized MIPlugin')
        this.setJSServerHook("mi/server.js");
        this.registerNewType('MyInstants Sound', 'mi.sound', { url: 'https://www.myinstants.com/en/instant/vine-boom-sound-70972/' });
        return true;
    }

    onStopping() {
       fastify.close();
        corsServer.closeAllConnections();
        corsServer.close();
        console.log('MI:FD stopped!')
    }
}

const cheerio = require('cheerio');
// const turbo = require('turbo-http')

const fastify = require('fastify')();
// Declare a route
fastify.get('/*', async (req, res) => {

    if (!req.url) {
        res.send('invalid url')
        return;
    }
    if (!req.url.includes('https://')) {
        res.send('invalid url')
        return;
    }


    let url = req.url.toString().split('/')
    url.shift()
    url = url.join('/')
    return fetch(url)
        .then(res => res.text())
        .then(body => {
            $ = cheerio.load(body);
            var respondeArray = {}
            $('#instant-page-button-element').each(function (i, elem) {
                const url = $(this).attr('data-url');
                const slashes = url.split('/')
                slashes.pop()
                const path = "http://localhost:5576/myinstants.com" + slashes.join('/');
                const file = url.split('/').slice(3).join('/');
                respondeArray = { path, file };
            });
            res
                .header('Access-Control-Allow-Origin' ,'*')
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(respondeArray);
        })
})

const start = async () => {
    try {
        await fastify.listen({ port: 5575 });
        console.log('MiAPI2:FD initialized')
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }

start();

var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 5576;

var cors_proxy = require('cors-anywhere');
const corsServer = cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
}).listen(port, host, function () {
    console.log('MiAPI:CORS initialized');
});

module.exports = {
    exec: () => new MIP(),
    class: MIP
}