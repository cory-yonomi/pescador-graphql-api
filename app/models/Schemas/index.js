const { GraphQLString, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLFloat, GraphQLScalarType } = require('graphql')


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

// The root provides a resolver function for each API endpoint
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
       
    }
})

// All possible data mutations: Creates, edits and deletes
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        
    }
})

module.exports = new GraphQLSchema({query: RootQuery, mutation: Mutation})