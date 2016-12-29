'use strict';

import React, { Component } from 'react';
import { ListGroupItem } from 'react-bootstrap';

export default class Bike extends Component {
  render() {
    const rides = this.props.activities;
    const distances = rides.map((r) => r.distance);
    const mtimes = rides.map((r) => r.moving_time);
    const kudoses = rides.map((r) => r.kudos_count);
    const elevations = rides.map((r) => r.total_elevation_gain);
    const kms = Math.round(distances.reduce((a, b) => a + b, 0) / 1000);
    const min = Math.round(distances.reduce((a, b) => Math.min(a, b)) / 1000);
    const max = Math.round(distances.reduce((a, b) => Math.max(a, b)) / 1000);
    const avg = Math.round(kms / rides.length);
    const ele = Math.round(elevations.reduce((a, b) => a + b, 0));
    const time = Math.round(mtimes.reduce((a, b) => a + b, 0) / 60 / 60);
    const kudos = Math.round(kudoses.reduce((a, b) => a + b, 0));
    return (
      <ListGroupItem header={this.props.bike.name}>
        Activities: {rides.length}<br/>
        Total distance: {kms} KM<br/>
        Average distance: {avg} KM<br/>
        Shortest ride: {min} KM<br/>
        Longest ride: {max} KM<br/>
        Elevation: {ele} Meters<br/>
        Moving time: {time} Hours<br/>
        Kudos: {kudos}
      </ListGroupItem>
    );
  }
}
