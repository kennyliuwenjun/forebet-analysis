const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ForebetTest', (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDb server');
  const db = client.db('ForebetTest')

  db.collection('Leagues').findOneAndUpdate({
    _id: new ObjectID('5c06887934dbe33e209ab50d')
  },{
    $set: {
      finished: 'bbb'
    }
  },{
    returnOriginal: false
  }).then((result)=> {
    console.log(result)
  })

  // client.close();
});
