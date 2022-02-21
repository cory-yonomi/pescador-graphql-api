const { GraphQLString, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLInt, GraphQLSchema, GraphQL, GraphQLFloat, GraphQLScalarType } = require('graphql')
const Water = require('../water')
const Station = require('../station')

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
      return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
      }
      return null; // Invalid hard-coded value (not an integer)
    },
})
  
// **** TYPE DEFINITIONS ****
const WaterType = new GraphQLObjectType({
  name: 'Water',
  fields: () => ({
    _id: {type: GraphQLID },
    name: {type: GraphQLString },
    type: {type: GraphQLString },
    stations: {type: new GraphQLList(StationType) }
  })
})

const StationType = new GraphQLObjectType({
  name: 'Station',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    usgsId: { type: GraphQLString },
    longitude: { type: GraphQLFloat },
    latitude: { type: GraphQLFloat },
    waterId: { type: GraphQLID }
  })
})

const TripType = new GraphQLObjectType({
  name: 'Trip',
  fields: () => ({
    _id: { type: GraphQLID },
    date: { type: dateScalar },
    stream: { type: GraphQLID },
    weather: { type: GraphQLString },
    description: { type: GraphQLString },
    fish: { type: GraphQLString }
  })
})

const FishType = new GraphQLObjectType({
  name: 'Fish',
  fields: () => ({
    _id: { type: GraphQLID },
    species: { type: GraphQLID },
    length: { type: GraphQLFloat },
    weight: { type: GraphQLFloat },
    description: { type: GraphQLString },
    caughtOn: { type: GraphQLString }
  })
})



// The root provides a resolver function for each API endpoint
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      waters: {
        type: new GraphQLList(WaterType),
        resolve(parent, args) {
          return Water.find({})
        }
      },
      water: {
        type: WaterType,
        args: { _id: { type: GraphQLID } },
        resolve(parent, { _id }) {
          return Water.findById(_id)
        }
      },
      stations: {
        type: new GraphQLList(StationType),
        resolve(parent, args) {
          return Station.find({})
        }
      },
      station: {
        type: StationType,
        args: { _id: { type: GraphQLID } },
        resolve(parent, { _id }) {
          return Station.findById(_id)
        }
      }
    }
})

// All possible data mutations: Creates, edits and deletes
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      //CREATIONS
      createWater: {
        type: WaterType,
        args: {
          name: {type: GraphQLString },
          type: {type: GraphQLString }
        },
        resolve(parent, args) {
          return Water.create({
            name: args.name,
            type: args.type
          })
        }
      },
      createStation: {
        type: StationType,
        args: {
          name: { type: GraphQLString },
          usgsId: { type: GraphQLString },
          longitude: { type: GraphQLFloat },
          latitude: { type: GraphQLFloat },
          waterId: { type: GraphQLID }
        },
        resolve(parent, args) {
          return (
            Water.findById(args.waterId)
              .then(foundWater => {
                foundWater.stations.push({
                  name: args.name,
                  usgsId: args.usgsId,
                  longitude: parseFloat(args.longitude),
                  latitude: parseFloat(args.latitude)
                })
                // this will not return the station created or even any station objects
                // the graphql - mongodb interaction is weird, or maybe I'm a bad coder
                // it's fine though, because I can just set off another query from the client
                // to update the whole list of stations there
                return foundWater.save()
                  
            })
          )
        }
      }
    }
})

module.exports = new GraphQLSchema({query: RootQuery, mutation: Mutation})