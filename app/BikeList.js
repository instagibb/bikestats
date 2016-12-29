'use strict';

import React, { Component } from 'react';
import Bike from './components/Bike';
import { requestBuilder, doRequest } from './utils/requestUtils';
import { ListGroup, Panel } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import pwrd from './images/pwrd_by_strava.png';
import authz from './images/auth_with_strava.png';
import moment from 'moment';

export default class BikeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      bikes: [],
      authorized: false,
      athlete: null
    };
  }
  componentDidMount() {
    console.log('Mounted...checking auth');
    this.setState({
      authorized: (this.props.location.query.code && this.props.location.query.state === 'strava_auth')
    });
  }
  authorize() {
    const code = this.props.location.query.code;
    console.log('Authorizing... using code: ' + code);
    
    const req = requestBuilder({ 
      url:'http://0.0.0.0:8002/oauth/token', 
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      data: { code: code } 
    });

    doRequest(req, (athlete) => {
      console.log(athlete);
      this.getActivities(athlete);
    });
  }
  getActivities(athlete) {
    console.log('Retrieving bikes...');
    // Default start dates
    const activities = [];
    let start = moment.utc().startOf('year').unix();
    let end = moment.utc().endOf('year').unix();
    console.log(start);
    console.log(end);
    this.getAllTheActivities(athlete, activities, start, end, 1);
  }
 
  getAllTheActivities(athlete, activities, s, e, p) {
    doRequest(requestBuilder({ url:`activities?after=${s}&before=${e}&per_page=200&page=${p}&access_token=${athlete.access_token}` }),
    (acts) => {
      activities = activities.concat(acts);
      if(acts.length == 200) {
        console.log(`Retrieving page: ${p} of activities`);
        this.getAllTheEfforts(activities, s, e, ++p);
      }
      else {
        console.log('All activities retrieved. Splitting by gear id');
        const splitActs = {};
        activities.map((a) => {
          const bikeId = a.gear_id;
          if(bikeId != null) {
            if(splitActs[bikeId]) {
              splitActs[bikeId].push(a);
            }
            else {
              splitActs[bikeId] = [];
            }
          }
        });

        const bikes = [];
        Object.keys(splitActs).map((k) => {
          if(k != null) {
            doRequest(
              requestBuilder({ url: `gear/${k}?access_token=${athlete.access_token}` }),
              (bike) => {
                bikes.push(bike);
                if(bikes.length === Object.keys(splitActs).length) {
                  this.setState({ 
                    bikes: bikes,
                    activities: splitActs,
                    athlete: athlete
                  });
                }
              }
            );
          }
        });
      }
    });
  }
  render() {
    let bikes;

    if(this.state.authorized) {
      if( this.state.bikes.length > 0) {
        bikes = this.state.bikes.map((b) => {
          return <Bike key={b.id} bike={b} activities={this.state.activities[b.id]} />;
        });
      }
      else {
        this.authorize();
      }
    }

    let content;
    let header;
    if(this.state.authorized) {
      if(bikes) {
        content = <ListGroup>{bikes}</ListGroup>;
        header = `${this.state.athlete.athlete.firstname} ${this.state.athlete.athlete.lastname} - `;
      }
      else {
        content = (<div className="connect"><FontAwesome
          name="spinner"
          size="2x"
          spin
        /></div>);
        header = 'Retrieving ';
      }
    }
    else {
      content = (<div className="connecting"><a href="https://www.strava.com/oauth/authorize?client_id=7868&response_type=code&redirect_uri=http://localhost:8000&approval_prompt=auto&state=strava_auth"><img className="authz" src={authz} /></a></div>);
    }
    const hs = '2016 Bike Statistics';
    header = header ? (header + hs) : hs;

    return (
      <div className="content">
        <Panel header={header} bsStyle="info"> 
          {content} 
        </Panel>
        <img className="pwrd" src={pwrd} />
      </div>
    );
  }
}