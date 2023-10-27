import { createServer } from 'https'
import { readFileSync } from 'fs'
import { WebSocketServer } from 'ws'
import { parseIncoming } from './functions/parseIncoming.js'

const server = createServer({
	cert: readFileSync('../../etc/letsencrypt/live/server.smcmo.dev/fullchain.pem'),
	key: readFileSync('../../etc/letsencrypt/live/server.smcmo.dev/privkey.pem'),
})
const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws, request) => {
	console.log('A client has connected.')
	ws.ip = request.socket.remoteAddress.slice(7)
	ws.sendJson = function (data) {
		this.send(JSON.stringify(data))
	}

	ws.on('error', console.error)
	ws.on('message', (data) => parseIncoming(data, ws, wss))
})

server.listen(8080, () => console.log(`Server listening on port 8080`))
