// Express docs: http://expressjs.com/en/api.html
const { default: axios } = require('axios')
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
const schema = require('../models/Schemas/index')
const { graphqlHTTP } = require('express-graphql')
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Filter objects by site name
function uniqBy(a, key) {
    var seen = {};
    return a.filter(item => {
        var k = key(item.sourceInfo.siteName);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

// Send a request to the USGS Instantaneous Water Values service and send that response back to client
router.get('/waterData/site/:siteId', (req, res, next) => {
	// axios req with params filled in, will be extracted from client request
	axios({
		method: 'get',
		url: 'http://waterservices.usgs.gov/nwis/iv/',
		params: {
			format: 'json',
			sites: req.params.siteId,
			siteStatus: 'active'
		}
	})
		.then(resp => {
			res.send(resp.data.value.timeSeries[0].sourceInfo.siteName)
			// timeSeries breaks down days and stations if multiples are selected. If requesting a specific id and no date range
			// only current values will be sent with a single item in the timeSeries array
		})
		.catch(next)
})

router.get('/waterData/county/:countyCode', (req, res, next) => {
	axios({
		method: 'get',
		url: 'http://waterservices.usgs.gov/nwis/iv/',
		params: {
			format: 'json',
			countyCd: req.params.countyCode,
			siteType: 'LK,ST',
			siteStatus: 'active'
		}
	})
		.then(resp => {
			const sites = uniqBy(resp.data.value.timeSeries, JSON.stringify)
			res.send(sites)
		})
		.catch(next)
})

router.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true,
}))

module.exports = router