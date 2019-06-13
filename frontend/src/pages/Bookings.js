import React, { Component } from "react";

import Spinner from "../components/spinner/Spinner";
import BookingList from "../components/bookings/bookingList/BookingList";
import AuthContext from "../context/auth-context";

class BookingsPage extends Component {
  state = {
    isLoading: true,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBooking();
  }

  fetchBooking = () => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
          }
        }
      `
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(res => {
        const bookings = res.data.bookings;
        this.setState({ bookings, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
    let requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
          }
        }
      `
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(res => {
        this.setState(prevState => { 
          const updatedBookings = prevState.bookings.filter(b => b._id !== bookingId);
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <BookingList
            bookings={this.state.bookings} 
            onDelete={this.deleteBookingHandler} />
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
