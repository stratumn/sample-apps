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

import { Segment } from '@stratumn/js-chainscript';
import { MapExplorer, StoreMapLoader } from '@stratumn/react-map-explorer';
import { IStoreClient } from '@stratumn/store-client';
import React, { Component } from 'react';

export interface Props {
  store: IStoreClient;
  asset: string;
}

export class Tracker extends Component<Props> {
  public render() {
    return (
      <div>
        <MapExplorer
          mapId={this.props.asset}
          process='asset-tracker'
          mapLoader={new StoreMapLoader(this.props.store)}
          onSegmentSelected={this.onSegmentSelected}
        />
      </div>
    );
  }

  private onSegmentSelected = (s: Segment) => {
    console.log(JSON.stringify(s.toObject({ bytes: String })));
  }
}
