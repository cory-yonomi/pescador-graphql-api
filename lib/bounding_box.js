// We need to take a set of decimal degree coords and turn them into a bounding box
// that can be sent to USGS to collect all data sites within that box.

// convert decimal degrees to radians
// take cosine of radians and multiply by 69.172
// gives number of miles to one degree of longitude at given latitude

// USGS takes coords in order of west, north, south, east

function boundingBox(lat, long) {
    return({
        west: long - .5,
        east: long + .5,
        north: lat + .5,
        south: lat - .5
    })
}

module.exports = boundingBox