// check siteType
// separate into new object	
        // potentially pare down array size
        // value for each measurement array
        // extracting dateTime and value

function streamSort(data) {
    const sorted = {
        gageHeight: [],
        flowRate: []
    }

    data.forEach(obj => {
        obj.values[0].value.forEach((value, i) => {
            let newObject = {date: value.dateTime, value: value.value}
            if (obj.variable.variableCode[0].value === "00060"){
                sorted.flowRate.push(newObject)
            } else {
                sorted.gageHeight.push(newObject)
            }
        })
    })

    return sorted
}

function lakeSort(data) {
    console.log('inside lake sort:', data)
    const sorted = {
        level: []
    }

    data[0].values[0].value.forEach(value => {
        let newObject = {date: value.dateTime, value: value.value}
        sorted.level.push(newObject)
    })
    return sorted
}

function stationSort(data) {
    console.log('data:', data)
    if(data[0].sourceInfo.siteProperty[0].value === "ST"){
        return streamSort(data)
    } else {
        return lakeSort(data)
    }
}

module.exports = stationSort