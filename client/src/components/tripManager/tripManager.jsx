import React from 'react';
import Popup from 'react-popup';
import TripPopup from './tripPopup.jsx';
import TripEntry from './tripEntry.jsx';
import reducer from '../../Reducers';

import { connect } from 'react-redux';
import $ from 'jquery';

import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Table } from 'react-bootstrap';

const SERVER_URL = HOSTNAME;



class Dashboard extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
      showPopup: false,
			trips: [],
			joinTrip: ''
    };

    this.togglePopup = this.togglePopup.bind(this);
    this.joinTrip = this.joinTrip.bind(this);
	}

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

	selectTrip(trip){
		this.props.dispatch(reducer.changeTrip(trip));
		this.props.dispatch(reducer.changeView('TripDashboard'));
	}

	handleChange(e){
		this.setState({joinTrip:e.target.value})
	}

	joinTrip() {
		let obj = {
      accessCode: this.state.joinTrip,
      userId: this.props.user.id
		};
		let context = this;
    $.ajax({
      url: SERVER_URL + '/jointrip',
      method: 'POST',
      data: obj,
      success: function(body) {
        console.log('POST was a success ', body);
        context.props.fetchLists();
      },
      error: function(err) {
      	console.log(err)
      }
    })
	}

	render() {
		return(
			<div>
        <Row className="create manager-main">
          <Col md={6} mdOffset={3}>
            <Button bsSize="large" block id="createtripbutton" onClick={this.togglePopup}>Create New Trip</Button>
          </Col>
        </Row>

        <Row className="join manager-main">
          <Col md={4} mdOffset={2}>
            <h3 className="welcome">Join Trip</h3>
            <div>
            <input value={this.state.joinTrip} onChange={e => this.handleChange(e)} type="text" name="code" placeholder="add code here"/>

            <Button className="button" onClick={this.joinTrip} type="submit" value="join">Submit</Button>
            </div>
          </Col>
        </Row>

        <Row className="trip-history manager-main">
          <Col md={8} mdOffset={2}>
      			<h3>Trip History</h3> 
            <Table striped className="historytable">
              <tbody>
                <tr>
                  <th> Trip Name </th>
                  <th> Trip Location </th>
                  <th> Start Date </th>
                  <th> End Date </th>
                  <th> Access Code </th>
                </tr>
                {(this.props.trips.map((ele) => {
    		    				return <TripEntry trip={ele} key={ele.id} onClick={() => this.selectTrip(ele)}/>
    				    }))}
    					</tbody>
            </Table>
          </Col>
        </Row>

        {this.state.showPopup ?
          <TripPopup
            closePopup={this.togglePopup}
            fetchLists={this.props.fetchLists}
          />
          : null
        }
      </div>
		)
	}
}

let mapStateToProps = ({ user }) => {
	return { user };
}

export default connect(mapStateToProps)(Dashboard);
