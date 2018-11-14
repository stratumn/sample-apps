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

import { LinkBuilder, Segment } from '@stratumn/js-chainscript';
import { MapExplorer, StoreMapLoader } from '@stratumn/react-map-explorer';
import { IStoreClient } from '@stratumn/store-client';
import React, { ChangeEvent, Component } from 'react';
import ReactModal from 'react-modal';
import { getUser, User, users } from './user';

export interface State {
  showModal: boolean;
  segmentHash: Uint8Array;
  owner: string;
  nextOwner: string;
}

export interface Props {
  store: IStoreClient;
  asset: string;
}

export class Tracker extends Component<Props, State> {
  public state = {
    nextOwner: '',
    owner: '',
    segmentHash: new Uint8Array(0),
    showModal: false
  };

  public render() {
    return (
      <div>
        <MapExplorer
          includeHash={Buffer.from(this.state.segmentHash).toString('hex')}
          mapId={this.props.asset}
          process='asset-tracker'
          mapLoader={new StoreMapLoader(this.props.store)}
          onSegmentSelected={this.onSegmentSelected}
        />
        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
        >
          <div style={{ textAlign: 'center' }}>
            <h2>{this.props.asset}</h2>
            <p>The current owner is {this.state.owner}</p>
            <label>
              Transfer to:
              <select
                id='asset-owner'
                name='owner'
                defaultValue={this.state.owner}
                onChange={this.handleNextOwnerChange}
                style={{ margin: '10px' }}
              >
                {users.map((u: User) => (
                  <option key={u.name} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <button id='transfer' onClick={this.transferOwnership}>
              Transfer
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }

  private onSegmentSelected = (s: Segment) => {
    this.setState({
      owner: s.link().data().owner,
      segmentHash: s.linkHash(),
      showModal: true
    });
  }

  private transferOwnership = async () => {
    const transferLink = new LinkBuilder('asset-tracker', this.props.asset)
      .withParent(this.state.segmentHash)
      .withData({ owner: this.state.nextOwner })
      .build();

    // To be accepted, a transfer of ownership needs to be signed by the
    // current owner.
    transferLink.sign(getUser(this.state.owner).privateKey.export(), '');

    try {
      const s = await this.props.store.createLink(transferLink);
      this.setState({ segmentHash: s.linkHash() });
    } catch (err) {
      alert(JSON.stringify(err, null, 2));
    }

    this.setState({ showModal: false });
  }

  private handleNextOwnerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ nextOwner: event.target.value });
  }

  private handleCloseModal = () => {
    this.setState({ showModal: false, nextOwner: '' });
  }
}
