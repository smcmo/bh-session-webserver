export default {
	admin: null,
	setAdmin: function (client) {
		if (this.admin !== null) {
			if (this.admin === client) {
				return client.sendJson({
					success: false,
					error: 'This client is already acting as admin',
				})
			}

			return client.sendJson({
				success: true,
				error: 'There is already another client acting as admin',
			})
		}

		this.admin = client
		return client.sendJson({
			success: true,
		})
	},
}
