'use strict';

import axios from 'axios';
import _ from 'lodash';
import appConstants from '../constants/appConstants';


export const requestBuilder = (config) => {
  const defaultConfig = {
    method: 'get',
    baseURL: appConstants.endpoint
  };

  return axios(_.defaults(config, defaultConfig));
};

export const doRequest = (req, success, failure) => {
  req.then((response) => {
    if(response.data) {
      success(response.data);
    }
  }).catch((response) => {
    console.log(response);
    if(failure) {
      failure(response);
    }
  });
};
