const { MongoClient, ObjectID } = require('mongodb');




MongoClient.connect('mongodb://localhost:27017/ForebetTest', (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDb server');
  const db = client.db('ForebetTest')

  // db.collection('Matches').insertOne({
  //   league: 'Fr1',
  //   homeTeam: 'Amiens SC',
  //   awayTeam: 'AS Monaco',
  //   homWinProb: 0.29,
  //   draw: 0.38,
  //   awayProb: 0.33,
  //   forebetPick: 0,
  //   odds: 3.3
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert Matches', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  // db.collection('Leagues').insertOne({
  //   country: 'France',
  //   name: '1 liga'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert Leagues', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })




  client.close();
});
