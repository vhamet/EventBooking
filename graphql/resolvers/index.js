const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
  try {

    const events = await Event.find({ _id: {$in: eventIds} });
    return events.map(event => {
      return { 
        ...event._doc, 
        _id: event.id, 
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator) 
      };
    });
  } catch(err) {
    throw err;
  };
}

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return { 
      ...user._doc, 
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch(err) {
    throw err;
  }
}

module.exports = {
  events: async () => {
    try {

      const events = await Event.find();
      return events.map(event => ({ 
        ...event._doc, 
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
      }));
    } catch(err) {
      throw err;
    }
  },
  createEvent: async args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5cfe5220e924dc17f4782c38'
    });
    
    try {
      const result = await event.save();
      const createdEvent = { 
        ...result._doc, 
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result.creator)
      };

      const creator = await User.findById('5cfe5220e924dc17f4782c38')
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();
      
      return createdEvent;
    } catch(err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error('User exists already.');
      }
        
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const hashedUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await hashedUser.save();
      
      return { ...result._doc, password: null, _id: result.id }
    } catch(err) {
      throw err;
    }
  }
}