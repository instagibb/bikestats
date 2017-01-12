'use strict';

import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';

export default class Bike extends Component {
  render() {
    let content;
    if(this.props.activities.length > 0) {
      const rides = this.props.activities;
      const distances = rides.map((r) => r.distance);
      const mtimes = rides.map((r) => r.moving_time);
      const avgspeeds = rides.map((r) => r.average_speed);
      const kudoses = rides.map((r) => r.kudos_count);
      const elevations = rides.map((r) => r.total_elevation_gain);
      const kms = Math.round(distances.reduce((a, b) => a + b, 0) / 1000);
      const min = Math.round(distances.reduce((a, b) => Math.min(a, b)) / 1000);
      const max = Math.round(distances.reduce((a, b) => Math.max(a, b)) / 1000);
      const avg = Math.round(kms / rides.length);
      const ele = Math.round(elevations.reduce((a, b) => a + b, 0));
      const time = Math.round(mtimes.reduce((a, b) => a + b, 0) / 60 / 60);
      const avgspeed = Math.round(((avgspeeds.reduce((a, b) => a + b, 0) / rides.length) * 60 * 60 / 1000));
      const kudos = Math.round(kudoses.reduce((a, b) => a + b, 0));

      content = (<span> 
        Activities: {rides.length}<br/>
        Total distance: {kms} KM<br/>
        Average distance: {avg} KM<br/>
        Shortest ride: {min} KM<br/>
        Longest ride: {max} KM<br/>
        Elevation: {ele} Meters<br/>
        Moving time: {time} Hours<br/>
        Average Average speed: {avgspeed} KPH<br/>
        Kudos: {kudos}
      </span>);
    }
    else {
      content = (<span>No activities for this bike/shoe... time to sell</span>);
    }
    
    return (
      <ListGroupItem header={this.props.bike.name}>
        {content}
      </ListGroupItem>
    );
  }
}
