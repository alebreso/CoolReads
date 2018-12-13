import { Author, Book } from './store'
const { ApolloServer, gql, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

const typeDefs = gql`
  type Author {
    id: Int!
    first_name: String!
    last_name: String!
    books: [Book]!
  }

  type Book {
    id: Int!
    title: String!
    cover_image_url: String!
    average_rating: Float!
    author: Author!
  }

  type Query {
    books: [Book!]!
    book(id: Int!): Book!
    author(id: Int!): Author!
    authors: [Author!]!
  }

  type Mutation {
    addBook(title: String!, cover_image_url: String!, average_rating: Float!, authorId: Int!): Book!
  }
`;

const resolvers = {
  Query: {
    books: () => Book.findAll(),
    book: (_, args) => Book.find({where:args}),
    authors: () => Author.findAll(),
    author: (_,args) => Author.find({where:args})
  },

  Author: {
    books: (author) => author.getBooks()
  },

  Book: {
    author: (book) => book.getAuthor()
  },

  Mutation: {
    addBook: async (_, {title, cover_image_url, average_rating, authorId }, { user }) => {
      try {
        const email = await user;
        const book = await Book.create({
          title,
          cover_image_url,
          average_rating,
          authorId
        })
        return book
      } catch(e){
        throw new AuthenticationError('You must be logged in to do this')
      }
    }
  },
};

const client = jwksClient({
  jwksUri: `hhtp://breso.eu.auth0.com/.well-known/jwks.json`
})

const getKey = () => {
  client.getSigningKey(header.kid, (err, key) => {
    let signingKey = key.publicKey || key.rsaPublicKey
    cb(null, signingKey)
  })
}

const options = {
  audience: 'https://breso.eu.auth0.com/userinfo',
  issuer: `https://breso.eu.auth0.com/`,
  algorithms: ['RS256']
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization
    const user = new Promise((resolve,reject) => {
      jwt.verify(token, getKey, options, (err, decoded) => {
        if(err) return reject(err)
        resolve(decoded.email)
      })
    })
    return { user }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});