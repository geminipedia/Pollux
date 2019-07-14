import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { typeDefs } from './model/prisma-schema';
import { prisma } from './model';
import Query from './query';
import Mutation from './mutation';
import Resolver from './resolver';

passport.serializeUser((profile: Profile, done) => {
  done(null, profile.id);
});

passport.deserializeUser((id, done) => {

});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: '/googleOAuthCallback'
  },
  (accessToken, refleshToken, profile) => {
    console.log(accessToken, refleshToken, profile);
  }
));

const server = new GraphQLServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    ...Resolver
  },
  context: context => ({
    ...context,
    prisma
  })
});

server.express.use(cors({
  credentials: true,
  origin: 'https://mslib.tw'
}));

server.express.get('/googleOAuth', passport.authenticate('google', {
  scope: ['profile', 'email']
}))
server.express.get('/googleOAuthCallback', passport.authenticate('google'))

server.express.use(bodyParser.json());
server.express.use(cookieParser());
server.start({ port: process.env.API_PORT }, () => console.log(`Server is running on http://localhost:${process.env.API_PORT}`));
