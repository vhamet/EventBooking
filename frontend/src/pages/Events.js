import React, { Component } from "react";

import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";

import "./Events.css";

class EventsPage extends Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => this.setState({ creating: true });

  modalCancelHandler = () => this.setState({ creating: false });

  modalConfirmHandler = () => {};

  render() {
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
            <p>Modal content</p>
          </Modal>
        )}
        <div className="events-control">
          <p>Share yout own Events !</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
