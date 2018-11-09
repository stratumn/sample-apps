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

import React, { ChangeEvent, Component } from 'react';
import ReactModal from 'react-modal';

export interface State {
  showModal: boolean;
  assetName: string;
  assetOwner: string;
}

export class Home extends Component<{}, State> {
  public state = {
    assetName: '',
    assetOwner: 'alice',
    showModal: false
  };

  public render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Asset Tracker</h1>
        <p>Welcome to the Asset Tracker Demo App.</p>
        <p>
          Assets that you have already created can be viewed by clicking on
          their name on the left menu.
        </p>
        <p>
          See the README for details about the store and the supported scenario.
        </p>
        <button id='show-asset-create' onClick={this.handleOpenModal}>
          Create Asset
        </button>
        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
        >
          <div style={{ textAlign: 'center' }}>
            <h1>Create New Asset</h1>
            <form onSubmit={this.handleCreateAsset}>
              <div>
                <label>
                  Name:
                  <input
                    id='asset-name'
                    type='text'
                    value={this.state.assetName}
                    onChange={this.handleAssetNameChange}
                    style={{ margin: '10px' }}
                  />
                </label>
              </div>
              <div>
                <label>
                  Owner:
                  <select
                    id='asset-owner'
                    name='owner'
                    defaultValue={this.state.assetOwner}
                    onChange={this.handleAssetOwnerChange}
                    style={{ margin: '10px' }}
                  >
                    <option value='alice'>alice</option>
                    <option value='bob'>bob</option>
                    <option value='carol'>carol</option>
                  </select>
                </label>
              </div>
              <div>
                <input id='create-asset' type='submit' value='Create' />
              </div>
            </form>
          </div>
        </ReactModal>
      </div>
    );
  }

  private handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  private handleCloseModal = () => {
    this.setState({
      assetName: '',
      assetOwner: 'alice',
      showModal: false
    });
  }

  private handleAssetNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ assetName: event.target.value });
  }

  private handleAssetOwnerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ assetOwner: event.target.value });
  }

  private handleCreateAsset = () => {
    this.handleCloseModal();
  }
}
