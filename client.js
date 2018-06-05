const { fetchGQLResponse,
        querySearchString,
        limitedQuerySearchString,
        richBusinessInfoQS,
        coordsQS,
        hoursQS
      } = require('./utils.js')

class YelpGQLClient {
  constructor() {
    // do something with args
  }


  async makeRichSearchQuery(term = "pizza", location = 95758, limit = 5, offset = 0) {
    const query = querySearchString(term, location, limit, offset);

    return fetchGQLResponse(query);
  }

  makeLimitedSearchQuery(term = "pizza", location = 95758, limit = 5, offset = 0) {
    const query = limitedQuerySearchString(term, location, limit, offset);

    return fetchGQLResponse(query);
  }

  getRichBusinessInfo(id) {
    const query = richBusinessInfoQS(id);
    //alias String	Alias of a category, when searching for business in certain categories, use alias rather than the title.
    return fetchGQLResponse(query);
  }

  getNameAndCoords(id) {
    const query = coordsQS(id);
    //alias String	Alias of a category, when searching for business in certain categories, use alias rather than the title.
    return fetchGQLResponse(query);
  }

  getHours(id) {
    const query = hoursQS(id);

    return fetchGQLResponse(query);
  }

  sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }


  async findNBusinessesLimited(term, location, n) {
    let requests = [];
    let businesses = [];
    let i = 0;
    let offset = i * 50
    let limit = 50;

    let req = await this.makeLimitedSearchQuery(term, location, limit, offset).then((value) => {return value});
    businesses = businesses.concat(req.data.search.business);

    const NUM_BUSINESSES = req.data.search.total;
    n = (n > NUM_BUSINESSES ?  NUM_BUSINESSES : n);
    let pages = Math.ceil(n / 50);

    if (pages === 1) {
      return ({total: n, businesses: req.data.search.business});
    }

    for (i; i < pages - 1; i++) {
      offset = i * 50;
      req = this.makeLimitedSearchQuery(term, location, limit, offset).then(sleeper(500));
      requests.push(req)
    }

    console.log(requests);

    Promise.all(requests).then(res => {
      console.log("yes");
      console.log(res);
    }).catch(err => {
      console.log("burburp");
      console.log(err);
    });


    // return {total: n, businesses: businesses};
  }

}







const gql = new YelpGQLClient();
gql.findNBusinessesLimited("pizza", "94118", 10000).then((res) => {
  console.log("yo");
  console.log(res);
}).catch(err => {
  console.log(err);
});


// .then(res => {
//   console.log(res);
// }).catch((err) => {console.log(err)})




// gql.makeRichSearchQuery().then((res) => {
//   // do stuff
//   console.log(res.data.search.business)
// }).catch((err) => {console.log(err);})
//
// gql.getRichBusinessInfo('h3r6Oclf7h6RDwH64jgT-g').then((res) => {
//   // do stuff
//   console.log(res.data.business)
// }).catch((err) => {console.log(err);})
//
//
// gql.getNameAndCoords('h3r6Oclf7h6RDwH64jgT-g').then((res) => {
//   // do stuff
//   console.log(res.data.business)
// }).catch((err) => {console.log(err);})

// module.exports = YelpGQLClient;
