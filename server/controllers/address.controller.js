import mongo from '../database/mongo.connection.js'

const client = await mongo.connectToMongo()
const close = await mongo.closeClient()

const mydb = 'inventoryDB'

export default {

	// @route   GET api/address-type
	// @desc    See all the address-type
	// @access  Public
	getTypeAddress: async (req, res) => {

		try {
			const db = client.db(mydb)
			const collection = db.collection('address-type')
			const result = await collection.find({}).toArray()

			res.json(result)

		} finally {
			close()
		}
	},
	// @route   GET api/towns-madrid 
	// @desc    See al the towns of Madrid
	// @access  Public
	getTowns: async (req, res) => {

		try {
			const db = client.db(mydb)
			const collection = db.collection('towns-madrid')
			const result = await collection.find({}).toArray()

			res.json(result)

		} finally {
			close()

		}
	}
}