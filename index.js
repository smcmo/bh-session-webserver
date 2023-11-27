import http from 'http'
import https from 'https'
import fs from 'fs'
import { WebSocketServer } from 'ws'

let server, port
if (process.env.NODE_ENVIRONMENT === 'production') {
	server = https.createServer({
		cert: fs.readFileSync('../../etc/letsencrypt/live/server.smcmo.dev/fullchain.pem'),
		key: fs.readFileSync('../../etc/letsencrypt/live/server.smcmo.dev/privkey.pem'),
	})
	port = 443
} else {
	server = http.createServer()
	port = 8080
}

const wss = new WebSocketServer({ server })

const eventFiles = fs.readdirSync('./wss_events').filter((file) => file.endsWith('.js'))
for (const file of eventFiles) {
	const event = await import(`./wss_events/${file}`)
	wss.on(event.default.name, (...args) => event.default.execute(...args))
}

server.listen(port, () => console.log(`Server listening on port ${port}`))
