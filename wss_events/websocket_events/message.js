import { StringDecoder } from 'string_decoder'
import { Game } from '../../Game.js'
import { Session } from '../../Session.js'

const decoder = new StringDecoder('utf8')

export default {
	name: 'message',
	async execute(data) {
		const message = JSON.parse(decoder.write(data))

		console.log(`Recieved data:`, message)

		switch (message.command) {
			case 'add_game_to_queue':
				/**
				 * Incoming message format
				 * {
				 * 		"command": "add_game_to_queue",
				 * 		"game": "Domination"
				 * }
				 */
				Session.gameQueue.push(new Game(message.game))
				break
			case 'next_game':
				/**
				 * Incoming message format
				 * {
				 * 		"command": "next_game"
				 * }
				 */
				if (Session.currentGameIndex + 1 > Session.gameQueue.length - 1) {
					// do nothing
				} else {
					Session.currentGameIndex++
					Session.currentGame = Session.gameQueue[Session.currentGameIndex]
				}
				Session.broadcast()
				break
			case 'update_current_game_data':
				/**
				 * Incoming message format
				 * {
				 * 		"command": "update_current_game_data",
				 * 		"data": {
				 * 				...
				 * 		}
				 * }
				 */
				Session.currentGame.properties = { ...Session.currentGame.properties, ...message.data }
				console.log(`Current game data is now:`, Session.currentGame.properties)
				Session.broadcast()
				break
			case 'start_session':
				/**
				 * Incoming message format
				 * {
				 * 		"command": "start_game"
				 * 		"games": []
				 * }
				 */
				Session.startSession(message.games)
				break
			case 'end_session':
				/**
				 * Incoming message format
				 * {
				 * 		"command": "end_session"
				 * }
				 */
				Session.status = 'idle'
				Session.gameQueue = []
				Session.currentGame = null
				Session.currentGameIndex = 0
				Session.broadcast()
				break
		}
		return Session.broadcast()
	},
}
