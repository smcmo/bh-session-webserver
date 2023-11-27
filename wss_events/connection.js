import fs from 'fs'
import { Session } from '../Session.js'

export default {
	name: 'connection',
	async execute(websocket, request) {
		console.log(`A client has connected (${request.socket.remoteAddress.slice(7)})`)

		const eventFiles = fs.readdirSync('./wss_events/websocket_events').filter((file) => file.endsWith('.js'))
		for (const file of eventFiles) {
			const event = await import(`./websocket_events/${file}`)
			websocket.on(event.default.name, (...args) => event.default.execute(...args))
		}

		websocket.sendJson = function (data) {
			this.send(JSON.stringify(data))
		}

		Session.clients.push(websocket)

		Session.broadcast()
	},
}
