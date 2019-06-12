import React, { Component } from "react";

import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from '../context/auth-context'

import "./Events.css";

class EventsPage extends Component {
  state = {
    creating: false,
    events: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    let requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then(res => {
      const events = res.data.events;
      this.setState({ events});
    })
    .catch(err => {
      console.log(err);
    });
  }

  startCreateEventHandler = () => this.setState({ creating: true });

  modalCancelHandler = () => this.setState({ creating: false });

  isEmptyString = s => s.trim().length === 0;

  modalConfirmHandler = () => {
    this.setState({ creating: false });

    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (this.isEmptyString(title) || price <= 0 || this.isEmptyString(date) || this.isEmptyString(description)) {
      return;
    }
    
    let requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
            _id
            title
            price
            date
            description
            creator {
              _id
              email
            }
          }
        }
      `
    };

    const token = this.context.token;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then(res => {
      this.fetchEvents();
    })
    .catch(err => {
      console.log(err);
    });
  };

  render() {
    const eventList = this.state.events.map(event => {
      return <li key={event._id} className="events__list-item">{event.title}</li>
    });

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Create Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef}/>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef}/>
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef}/>
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (<div className="events-control">
          <p>Share yout own Events !</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>)}
        <ul className="events__list">
          {eventList}
        </ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
