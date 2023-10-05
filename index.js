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
				error: true,
				reason: 'Failed to provide a valid message type property',
			})
		)
	} else {
		switch (message.type) {
			case 'admin_request':
				return appointSessionAdmin(ws)
			case 'begin_session':
			default:
				ws.send(
					JSON.stringify({
						error: true,
						reason: 'The provided message type does not exist',
					})
				)
		}
	}
}

let admin = null
function appointSessionAdmin(ws) {
	if (admin !== null) {
		ws.send(
			JSON.stringify({
				requestAccepted: false,
				reason: 'There is already another client designated as admin',
			})
		)
	} else {
		admin = ws
		admin.send(
			JSON.stringify({
				requestAccepted: true,
			})
		)
	}
}
