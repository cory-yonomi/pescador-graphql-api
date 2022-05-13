// Express docs: http://expressjs.com/en/api.html
const { default: axios } = require('axios')
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
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
const fips = require('../../lib/fips_lookup_by_state')
const states = Object.values(fips)

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Filter objects by site name
const uniqBy = (a, key) => {
    let seen = {};
    return a.filter(item => {
        let k = key(item.sourceInfo.siteName);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

// transform state abbreviation and county name into FIPS county code
const getCountyCode = (s, n) => {
	let code
	states.forEach(state => {
		if (s === state._abbrev) {
			let foundState = Object.entries(state)
			foundState.forEach(county => {
				if (county[0].includes(n)) {
					code = county[1]
				}
			})
		}
	})
	return code
}

const seedStates = () => {
	
	states.forEach(state => {
		const newState = {}

		newState.name = state._name
		newState.stateFips = state._fips
		newState.abbrev = state._abbrev
		newState.counties = []

		
		let foundState = Object.entries(state)
		foundState.forEach(county => {
			if (county[0] !== '_name' || county[0] !== '_fips' || county[0] !== '_abbrev') {
				newState.counties.push({
					county: county[0],
					fips: county[1]
				})	
			}
		})
		
		
	})
	return code
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
			siteStatus: 'active',
			period: 'P3D'
		}
	})
		.then(resp => {
			res.send(resp.data.value.timeSeries)
			// timeSeries breaks down days and stations if multiples are selected. If requesting a specific id and no date range
			// only current values will be sent with a single item in the timeSeries array
		})
		.catch(next)
})

// Get a list of sites within a county code
router.get('/waterData/county', (req, res, next) => {	
	// First we get the county code from the JSON file
	let countyCode = getCountyCode(req.query.state, req.query.countyName)
	// Then we query USGS for all sites in that county
	console.log("countyCode:\n", countyCode)
	if(countyCode){
		axios({
			method: 'get',
			url: 'http://waterservices.usgs.gov/nwis/iv/',
			params: {
				format: 'json',
				countyCd: countyCode,
				siteType: 'LK,ST',
				siteStatus: 'active'
			}
		})
		.then(resp => {
			const sites = uniqBy(resp.data.value.timeSeries, JSON.stringify)
			console.log("sites:\n", sites)
			const siteData = sites.map(site => {
				return {
					siteId: site.sourceInfo.siteCode[0].value,
					siteName: site.sourceInfo.siteName,
					siteLong: site.sourceInfo.geoLocation.geogLocation.longitude,
					siteLat: site.sourceInfo.geoLocation.geogLocation.latitude,
				}
			})
			res.send(siteData)
		})
			.catch(next)
	} else {
		res.send(null)
	}
	
})

module.exports = router