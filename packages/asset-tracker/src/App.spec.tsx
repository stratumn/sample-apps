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

import { IFossilizerClient } from '@stratumn/fossilizer-client';
import { IStoreClient } from '@stratumn/store-client';
import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter, Switch } from 'react-router-dom';
import App from './App';
import { Home } from './Home';
import { NavBar } from './NavBar';
import { Tracker } from './Tracker';

describe('App', () => {
  const storeMock = jest.fn<IStoreClient>(() => ({
    getMapIDs: () => ['asset1', 'asset2']
  }));
  const fossilizerMock = jest.fn<IFossilizerClient>(() => ({}));

  it('renders a route switch component', () => {
    const wrapper = mount(
      <MemoryRouter>
        <App store={new storeMock()} fossilizer={new fossilizerMock()} />
      </MemoryRouter>
    );
    expect(wrapper.find(Switch)).toHaveLength(1);
  });

  it('renders a navigation menu', async () => {
    const mockGetMapIds = jest.fn();
    mockGetMapIds.mockReturnValue(['asset1', 'asset2']);

    const store = new storeMock();
    store.getMapIDs = mockGetMapIds;

    const wrapper = mount(
      <MemoryRouter>
        <App store={store} fossilizer={new fossilizerMock()} />
      </MemoryRouter>
    );
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    expect(mockGetMapIds).toHaveBeenCalledWith('asset-tracker');

    expect(wrapper.find(NavBar)).toHaveLength(1);
    expect(wrapper.find(NavBar).prop('assets')).toEqual(['asset1', 'asset2']);
  });

  it('renders a home component on root url', () => {
    const wrapper = mount(
      <MemoryRouter>
        <App store={new storeMock()} fossilizer={new fossilizerMock()} />
      </MemoryRouter>
    );
    expect(wrapper.find(Switch)).toHaveLength(1);
    expect(wrapper.find(Home)).toHaveLength(1);
  });

  it('renders the tracker component', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/asset1']}>
        <App store={new storeMock()} fossilizer={new fossilizerMock()} />
      </MemoryRouter>
    );
    expect(wrapper.find(Switch)).toHaveLength(1);
    expect(wrapper.find(Tracker)).toHaveLength(1);
    expect(wrapper.find(Tracker).prop('asset')).toEqual('asset1');
  });
});
