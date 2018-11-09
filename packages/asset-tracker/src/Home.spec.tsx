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

import { mount, shallow } from 'enzyme';
import React from 'react';
import ReactModal from 'react-modal';
import { Home } from './Home';

describe('Home', () => {
  it('displays a bunch of text', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('p').length).toBeGreaterThan(1);
  });

  it('displays a button to create asset', () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('button#show-asset-create').length).toEqual(1);
  });

  it('lets users create new assets', () => {
    const mountRoot = document.createElement('div');
    mountRoot.setAttribute('id', 'root');
    document.body.appendChild(mountRoot);

    ReactModal.setAppElement('#root');
    const wrapper = mount(<Home />, { attachTo: mountRoot });

    // Clicking the button should show the modal.
    expect(wrapper.state('showModal')).toBeFalsy();
    wrapper.find('button').simulate('click');
    expect(wrapper.state('showModal')).toBeTruthy();

    // Set asset name and owner.
    wrapper
      .find('#asset-name')
      .simulate('change', { target: { value: 'My Asset' } });
    wrapper
      .find('#asset-owner')
      .simulate('change', { target: { value: 'carol' } });

    expect(wrapper.state('assetName')).toEqual('My Asset');
    expect(wrapper.state('assetOwner')).toEqual('carol');

    // Create asset should reset the state.
    wrapper.find('form').simulate('submit');

    expect(wrapper.state('showModal')).toBeFalsy();
    expect(wrapper.state('assetName')).toEqual('');
    expect(wrapper.state('assetOwner')).toEqual('alice');

    wrapper.detach();
    document.body.removeChild(mountRoot);
  });
});
