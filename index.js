import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', function connection(ws) {
	console.log('A client has connected.')
	ws.on('error', console.error)

	ws.on('message', function message(data) {
		let json
		try {
			json = JSON.parse(data)
		} catch (error) {
			console.error(error)
		}

		if (json) {
			return handleMessage(json, ws)
		}
	})
})

function handleMessage(message, ws) {
	if (!message.type) {
		ws.send(
			JSON.stringify({
				success: false,
				reason: 'Failed to provide a valid message type property',
			})
		)
	} else {
		switch (message.type) {
			case 'admin_request':
				return appointSessionAdmin(ws)
			case 'begin_session':
				return initializeSession(message.data, ws)
			default:
				ws.send(
					JSON.stringify({
						success: false,
						reason: 'The provided message type does not exist',
					})
				)
		}
	}
}

let admin = null
function appointSessionAdmin(client) {
	if (admin !== null) {
		client.send(
			JSON.stringify({
				success: false,
				reason: 'There is already another client designated as admin',
			})
		)
	} else {
		admin = client
		admin.send(
			JSON.stringify({
				success: true,
			})
		)
	}
}

let sessionData = {}
function initializeSession(data, client) {
	if (client !== admin) {
		return client.send(
			JSON.stringify({
				success: false,
				reason: 'You are not allowed to perform that action as you are not the current session admin',
			})
		)
	}

	if (!data) {
		return client.send(
			JSON.stringify({
				success: false,
				reason: 'Message is missing data property',
			})
		)
	}

	sessionData = data
	return admin.send(
		JSON.stringify({
			success: true,
		})
	)
}
