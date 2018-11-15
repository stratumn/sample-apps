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

import { Link } from '@stratumn/js-chainscript';
import { IStoreClient } from '@stratumn/store-client';
import { mount, shallow } from 'enzyme';
import React from 'react';
import ReactModal from 'react-modal';
import { MemoryRouter, Route } from 'react-router';
import { Home } from './Home';

describe('Home', () => {
  const storeMock = jest.fn<IStoreClient>(() => ({
    createLink: jest.fn()
  }));

  it('displays a bunch of text', () => {
    const wrapper = shallow(<Home store={new storeMock()} />);
    expect(wrapper.find('p').length).toBeGreaterThan(1);
  });

  it('displays a button to create asset', () => {
    const wrapper = shallow(<Home store={new storeMock()} />);
    expect(wrapper.find('button#show-asset-create').length).toEqual(1);
  });

  it('lets users create new assets', async () => {
    const store = new storeMock();

    const mountRoot = document.createElement('div');
    mountRoot.setAttribute('id', 'root');
    document.body.appendChild(mountRoot);

    ReactModal.setAppElement('#root');
    const wrapper = mount(
      <MemoryRouter>
        <div>
          <Route exact path='/' component={() => <Home store={store} />} />
          <Route
            path='/my-asset'
            component={() => <div id='asset-created' />}
          />
        </div>
      </MemoryRouter>,
      { attachTo: mountRoot }
    );

    const home = wrapper.find(Home);

    // Clicking the button should show the modal.
    expect(home.state('showModal')).toBeFalsy();
    home.find('button').simulate('click');
    expect(home.state('showModal')).toBeTruthy();

    // Set asset name and owner.
    wrapper
      .find('#asset-name')
      .simulate('change', { target: { value: 'my-asset' } });
    wrapper
      .find('#asset-owner')
      .simulate('change', { target: { value: 'carol' } });

    expect(home.state('assetName')).toEqual('my-asset');
    expect(home.state('assetOwner')).toEqual('carol');

    store.createLink = jest.fn((l: Link) => {
      expect(l.mapId()).toEqual('my-asset');
      expect(l.process().name).toEqual('asset-tracker');
      expect(l.outDegree()).toEqual(1);
      expect(l.step()).toEqual('create');
      expect(l.tags()).toEqual(['carol']);
    });

    wrapper.find('button#create-asset').simulate('click');
    expect(store.createLink).toHaveBeenCalled();

    // Flush all async handlers.
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    // We should have been redirected.
    expect(wrapper.find(Home)).toHaveLength(0);
    expect(wrapper.find('#asset-created')).toHaveLength(1);

    wrapper.detach();
    document.body.removeChild(mountRoot);
  });
});
