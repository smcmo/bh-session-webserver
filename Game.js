import games from './games.json' assert { type: 'json' }

export class Game {
	name
	description
	properties

	constructor(name) {
		const game = games.find((item) => item.name === name)

		this.name = game.name
		this.description = game.description ?? 'No description available'
		this.properties = { ...game.properties, gameStage: 'BRIEFING' } ?? {}
	}
}

/**
 * gameStage
 * BRIEFING = when the game briefing is ongoing
 * PREP = when FMs are setting up game before it starts
 * ONGOING = when the game is currently being played
 * DONE = when the game has ended (time ran out, a team won, etc)
 */
