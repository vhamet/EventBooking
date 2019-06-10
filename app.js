const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event
        .find()
        .then(events => {
          console.log(events);
          return events.map(event => ({ ...event._doc, _id: event.id }));
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
    createEvent: args => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5cfe5220e924dc17f4782c38'
      });
      let createEvent;

      return event
        .save()
        .then(result => {
          createEvent = { ...result._doc, _id: event.id }
          return User.findById('5cfe5220e924dc17f4782c38')
        })
        .then(user => {
          if (!user) {
            throw new Error('User not found.');
          }
          user.createdEvents.push(event);

          return user.save();
        })
        .then(result => {
          return createEvent;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
    createUser: args => {
      return User.findOne({ email: args.userInput.email }).then(user => {
        if (user) {
          throw new Error('User exists already.');
        }
        
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        return { ...result._doc, password: null, _id: result.id }
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
    }
  },
  graphiql: true
}));

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-dpvze.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });
