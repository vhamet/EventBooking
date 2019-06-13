import React from "react";

import BookingItem from "../bookingItem/BookingItem";
import "./BookingList.css";

const bookingList = props => {
  const bookings = props.bookings.map(booking => (
    <BookingItem
      key={booking._id}
      title={booking.event.title}
      createdAt={booking.createdAt}
      onDelete={props.onDelete.bind(null, booking._id)}
    />
  ));

  return <ul className="booking__list">{bookings}</ul>;
};

export default bookingList;
