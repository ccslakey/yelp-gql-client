const YELP_KEY = "UZYpMfRGHoSrJz8uXKOi_ejyhXTEdROm3kKGnkF4_7ZTWghMWBFtuDzkblN36dC6-cS-INmPDy1tDJD1wYSyyYOkOB_7I2aucD5zUxC05SfnKRCwm0UhM6o4e9oJW3Yx";
const fetch = require('node-fetch');


const utils = {

  async fetchGQLResponse(query) {
    try {
      return await fetch("https://api.yelp.com/v3/graphql", {
        body: query,
        headers: {
          'content-type': 'application/graphql',
          'Authorization': `Bearer ${YELP_KEY}`
        },
        method: 'POST'
      }).then(res => res.json());
    } catch (e) {
      console.log("bzzzzt \n");
      console.log(e);
    }
  },

  querySearchString(term, location, limit, offset) {
    return `{
        search(term: "${term}", location: "${location}", limit: ${limit}, offset: ${offset}) {
            total
            business{
              name
              id
              photos
              rating
              review_count
              display_phone
              is_closed
              hours {
                open {
                  is_overnight
                  end
                  start
                  day
                }
              }
              location {
                  city
                  state
                  address1
                  address2
                  address3
                  zip_code
                  country
                  formatted_address
              }
              coordinates {
                latitude
                longitude
              }
              categories {
                title
                alias
              }
              reviews {
                text
                rating
                url
              }
            }
        }
    }`;
  },

  limitedQuerySearchString(term, location, limit, offset) {
    return `{
        search(term: "${term}", location: "${location}", limit: ${limit}, offset: ${offset}) {
            total
            business{
              name
              id
              photos
              rating
              review_count
              display_phone
              is_closed
              location {
                  formatted_address
              }
            }
        }
    }`;
  },

  coordsQS(id) {
    if (!id || typeof(id) !== "string") {
      return new Error("requires a yelp business id");
    }
    return `{
      business(id: "${id}") {
            name
            location {
                formatted_address
            }
            coordinates {
              latitude
              longitude
            }
          }
    }`
  },

  richBusinessInfoQS(id) {
    if (!id || typeof(id) !== "string") {
      return new Error("requires a yelp business id");
    }
    return `{
      business(id: "${id}") {
            name
            photos
            rating
            review_count
            display_phone
            is_closed
            hours {
              open {
                is_overnight
                end
                start
                day
              }
            }
            location {
                city
                state
                address1
                address2
                address3
                zip_code
                country
                formatted_address
            }
            coordinates {
              latitude
              longitude
            }
            categories {
              title
              alias
            }
            reviews {
              text
              rating
              url
            }
          }
    }`;
  },

  hoursQS(id) {
    if (!id || typeof(id) !== "string") {
      return new Error("requires a yelp business id");
    }
    return `{
      business(id: "${id}") {
            name
            display_phone
            is_closed
            hours {
              open {
                is_overnight
                end
                start
                day
              }
            }
          }`;
  }




}

module.exports = utils;
