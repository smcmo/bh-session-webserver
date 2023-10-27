export default {
	gameState: {
		status: 'idle',
		gameTitle: 'DOMINATION',
		gameDescription: 'Both teams must attempted to capture as many control point cubes as possible, in order to dominate the other team.',
		totalControlPoints: 0,
		blueControlPoints: 0,
		redControlPoints: 0,
	},
	send: function (client) {
		return client.sendJson(this.gameState)
	},
	update: function (data, server, sendingClient) {
		this.gameState.status = 'running'
		this.gameState.totalControlPoints = data.totalControlPoints
		this.gameState.blueControlPoints = data.blueControlPoints
		this.gameState.redControlPoints = data.redControlPoints

		server.clients.forEach((client) => {
			if (client !== sendingClient) {
				client.sendJson(this.gameState)
			}
		})
	},
}
