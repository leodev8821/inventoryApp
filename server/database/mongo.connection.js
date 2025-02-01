import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017/'

export default {

  connectToMongo: async () => {
    const client = new MongoClient(url)
    await client.connect()

    return client
  },

  closeClient: async () => {
    const client = new MongoClient(url)
    await client.close()

    return client
  }
}