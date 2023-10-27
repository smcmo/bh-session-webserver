import { WebSocketServer } from 'ws'
import { parseIncoming } from './functions/parseIncoming.js'

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
