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

import { mount } from 'enzyme';
import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('displays a link to the home page', () => {
    const wrapper = mount(
      <MemoryRouter>
        <NavBar assets={[]} />
      </MemoryRouter>
    );
    expect(wrapper.find(Link)).toHaveLength(1);

    const homeLink = wrapper.find(Link).first();
    expect(homeLink.props().to).toEqual('/');
    expect(homeLink.text()).toEqual('Home');
  });

  it('displays links to each asset', () => {
    const wrapper = mount(
      <MemoryRouter>
        <NavBar assets={['asset1', 'asset2']} />
      </MemoryRouter>
    );
    expect(wrapper.find(Link)).toHaveLength(3);

    const lastLink = wrapper.find(Link).at(2);
    expect(lastLink.props().to).toEqual('/asset2');
    expect(lastLink.text()).toEqual('asset2');
  });
});
