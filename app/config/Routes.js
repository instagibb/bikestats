'use strict';

import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import BikeList from '../BikeList';

export default (
  <Router history={browserHistory}>
    <Route path="/(:strava_auth)" component={BikeList} />
  </Router>
);
