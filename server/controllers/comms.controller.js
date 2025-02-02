import mongo from '../database/mongo.connection.js'

const client = await mongo.connectToMongo()
const close = await mongo.closeClient()

const mydb = 'inventoryDB'

export default {

	// @route   GET api/comms 
	// @desc    See all the notifications
	// @access  Public
	getComms: async (req, res) => {

		try {
			const db = client.db(mydb)
			const collection = db.collection('communications')
			const result = await collection.find({}).toArray()

			res.json(result)
		} finally {
			/* close() */
            console.log('supuesto cierre de BBDD')

		}
	},

	// @route   POST api/comms 
	// @desc    Send a notification
	// @access  Public
	// Añadido dato queja a la base de datos
	postComms: async (req, res) => {
		const { email, text, complaints } = req.body

		try {
			const db = client.db(mydb)
			const collection = db.collection('communications')
			const result = await collection.insertOne({ email, text, complaints })

			res.json(`Documento insertado con ID: ${result.insertedId}`)

		} finally {
			/* close() */
            console.log('supuesto cierre de BBDD')

		}
	},

	lopdGet: async (req, res) => {

		try {
			const db = client.db(mydb)
			const collection = db.collection('lopd')
			const result = await collection.find({}).toArray()

			res.json(result)
		} finally {
			/* close() */
            console.log('supuesto cierre de BBDD')

		}
	}
}