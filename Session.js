import { Game } from './Game.js'

export class Session {
	static status = 'idle'
	static gameQueue = []
	static currentGame = null
	static currentGameIndex = 0
	static clients = []
	static endGameTimeout = null

	static broadcast(exclusions = []) {
		for (const client of this.clients) {
			if (exclusions.includes(client)) continue
			client.sendJson({
				status: this.status,
				gameQueue: this.gameQueue,
				currentGame: this.currentGame,
				currentGameIndex: this.currentGameIndex,
			})
		}
	}

	static startSession(games) {
		this.status = 'running'
		games.forEach((game) => {
			this.gameQueue.push(new Game(game))
		})
		this.currentGame = this.gameQueue[0]
		console.log('New game queue created:', this.gameQueue)
	}
}
