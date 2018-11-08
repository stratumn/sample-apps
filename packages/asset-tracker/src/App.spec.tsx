/*
  Copyright 2018 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { shallow } from 'enzyme';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import { Home } from './Home';
import { NavBar } from './NavBar';

describe('App', () => {
  it('renders a router component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Router)).toHaveLength(1);
  });

  it('renders a navigation menu', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(NavBar)).toHaveLength(1);
    expect(wrapper.find(NavBar).prop('assets')).toEqual(['asset1', 'asset2']);
  });

  it('renders a home component on root url', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Route)).toHaveLength(1);
    expect(wrapper.find(Route).prop('component')).toEqual(Home);
  });
});
