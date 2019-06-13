import React from "react";

import "./BookingItem.css";

const bookingItem = props => (
  <li key={props.bookingId} className="booking__list-item">
    <div className="booking__list-item-data">
      {props.title} - {new Date(props.createdAt).toLocaleDateString()}
    </div>
    <div>
    <button className="btn" onClick={props.onDelete}>Cancel</button>
    </div>
  </li>
);

export default bookingItem;
