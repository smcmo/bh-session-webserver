import { StringDecoder } from 'node:string_decoder'
import session from '../manager.js'
import gameState from '../status.js'

const decoder = new StringDecoder('utf8')

function parseIncoming(data, client, server) {
	try {
		let parsedData = null
		parsedData = decoder.write(data)

		const message = JSON.parse(parsedData)

		if (!message.type) {
			return client.sendJson({
				success: false,
				error: 'Message does not contain a valid type',
			})
		}

		switch (message.type) {
			case 'admin_request':
				return session.setAdmin(client)
			case 'update_game_state':
				return gameState.update(message, server, client)
			case 'request_game_state':
				return gameState.send(client)
			default:
				return client.sendJson({
					success: false,
					error: `Message type '${message.type}' does not exist`,
				})
		}
	} catch (error) {
		console.log(error)
		return null
	}
}

export { parseIncoming }
