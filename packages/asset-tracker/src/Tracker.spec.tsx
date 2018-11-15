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
import { MapExplorer } from '@stratumn/react-map-explorer';
import { IStoreClient } from '@stratumn/store-client';
import { mount, shallow } from 'enzyme';
import React from 'react';
import ReactModal from 'react-modal';
import { Tracker } from './Tracker';

describe('Tracker', () => {
  it('displays a map explorer', () => {
    const wrapper = shallow(
      <Tracker store={jest.fn<IStoreClient>()()} asset={'test-asset'} />
    );

    expect(wrapper.find(MapExplorer)).toHaveLength(1);
    expect(wrapper.find(MapExplorer).prop('mapId')).toEqual('test-asset');
    expect(wrapper.find(MapExplorer).prop('process')).toEqual('asset-tracker');
  });

  it('lets users transfer asset ownership', async () => {
    const mountRoot = document.createElement('div');
    mountRoot.setAttribute('id', 'root');
    document.body.appendChild(mountRoot);

    ReactModal.setAppElement('#root');

    const createLinkMock = jest.fn();
    const store = jest.fn<IStoreClient>(() => ({
      createLink: createLinkMock
    }))();

    const wrapper = mount(<Tracker store={store} asset={'test-asset'} />, {
      attachTo: mountRoot
    });

    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    expect(wrapper.state('showModal')).toBeFalsy();

    // Show transfer ownership modal.
    wrapper.setState({
      owner: 'alice',
      segmentHash: Uint8Array.from([42]),
      showModal: true
    });
    wrapper.update();

    expect(wrapper.find('select#asset-owner')).toHaveLength(1);

    // Transfer ownership to bob.
    createLinkMock.mockImplementationOnce((l: Link) => {
      expect(l.prevLinkHash()).toEqual(Uint8Array.from([42]));
      expect(l.data()).toEqual({ owner: 'bob' });
      expect(l.outDegree()).toEqual(1);
      expect(l.step()).toEqual('transfer');
      expect(l.tags()).toEqual(['alice', 'bob']);
      expect(l.signatures()).toHaveLength(1);

      return l.segmentify();
    });

    wrapper
      .find('select#asset-owner')
      .simulate('change', { target: { value: 'bob' } });
    expect(wrapper.state('nextOwner')).toEqual('bob');
    wrapper.find('button#transfer').simulate('click');

    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    expect(createLinkMock).toHaveBeenCalled();
    expect(wrapper.state('showModal')).toBeFalsy();

    wrapper.detach();
    document.body.removeChild(mountRoot);
  });
});
