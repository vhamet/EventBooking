import React from "react";

import "./EventItem.css";

const eventItem = props => (
  <li key={props.eventId} className="event__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>€{props.price} - {new Date(props.date).toLocaleDateString()}</h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p>You're the owner !</p>
      ) : (
        <button className="btn" onClick={props.onDetail.bind(null, props.eventId)}>View details</button>
      )}
    </div>
  </li>
);

export default eventItem;
