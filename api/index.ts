import { GraphQLServer } from 'graphql-yoga';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { typeDefs } from './model/prisma-schema';
import { prisma } from './model';
import Query from './query';
import Mutation from './mutation';
import Resolver from './resolver';

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

server.express.use(bodyParser.json());
server.express.use(cookieParser());
server.express.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
server.express.use(passport.initialize());
server.express.use(passport.session());

passport.serializeUser((profile: Profile, done) => {
  done(null, profile.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await prisma.user({ userName: id });
  done(null, user);
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: '/googleOAuthCallback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userExisted = await prisma.user({ userName: profile.id });
      if (userExisted) {
        done(null, userExisted);
      }

      await prisma.createUser({
        userName: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName
      })

      const user = await prisma.updateUser({
        data: {
          avatar: {
            create: {
              name: profile.photos[0].value,
              file: {
                create: {
                  name: profile.photos[0].value,
                  path: profile.photos[0].value,
                  uploadBy: {
                    connect: {
                      userName: profile.id
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          userName: profile.id
        }
      })
      done(null, profile);
    } catch (error) {
      done(error, null);
      throw new Error('#ERR_FFF');
    }
  }
));

server.express.get('/googleOAuth', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
server.express.get('/googleOAuthCallback', passport.authenticate('google'), (req, res) => {
  res.redirect('https://mslib.tw')
});

server.start({ port: process.env.API_PORT }, () => console.log(`Server is running on http://localhost:${process.env.API_PORT}`));
