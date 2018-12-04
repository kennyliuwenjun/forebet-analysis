const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ForebetTest', (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDb server');
  const db = client.db('ForebetTest')

  // deleteMany
  db.collection('Leagues').deleteMany({country:'France'}).then((result)=>{
    console.log(result);
  })

  // deleteOne

  // findOneAndDelete

  client.close();
});
