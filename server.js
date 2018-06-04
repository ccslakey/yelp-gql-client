const express = require('express');
const app = express();
const request = require('superagent');
const YelpGQLClient = require('./client.js');
const gql = new YelpGQLClient()

// this middleware will set cors permissions for one Website
// TODO --------> abstract and enable a list of domains with permissions : i.e. prod, dev, preprod etc
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// ex. query
// GET domain/business/h3r6Oclf7h6RDwH64jgT
app.get('/business/:id', (req, res) => {
  // res.send('Hello World!');
  const id = req.params.id || 'h3r6Oclf7h6RDwH64jgT-g'

  gql.getRichBusinessInfo(id).then((response) => {
    res.send(response)
  }).catch((err) => {
    console.log("bzzzzt\n");
    console.log(err);
  })
});


// ex. query
// GET domain/search?term=pork%20store&location=san%20francisco
app.get('/search', (req, res) => {
  try {
    let term = req.query.term;
    let location = req.query.location;
    let limit = req.query.limit;
    let offset = req.query.offset;

    gql.makeLimitedSearchQuery(term, location, limit, offset).then((response) => {
      console.log(`making limited search with: ${term}, ${location}, ${limit}, ${offset}`);
      res.send(response.data.search)
    }).catch((err) => {
      console.log("bzzzzt\n");
      console.log(err);
    })
  } catch (e) {
    console.error(e);
  }
});

app.listen(8000, () => console.log('Example app listening on port 8000!'));
