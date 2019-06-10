const { transformEvent } = require('./merge');

const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => transformEvent(event));
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
      const createdEvent = transformEvent(result);

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
  }
}