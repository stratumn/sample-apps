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

import {
  FossilizedEvent,
  FossilizerHttpClient
} from '@stratumn/fossilizer-client';
import { StoreEvent, StoreHttpClient } from '@stratumn/store-client';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

const storeClient = new StoreHttpClient(
  'http://localhost:5000',
  (e: StoreEvent) => {
    // tslint:disable-next-line:no-console
    console.log(`New store event: ${JSON.stringify(e)}`);
  }
);
const fossilizerClient = new FossilizerHttpClient(
  'http://localhost:5001',
  async (e: FossilizedEvent) => {
    // The fossilizer produces some evidence that a given link exists at some
    // point in time. We store that evidence in our Chainscript store.
    const linkHash = e.data;
    await storeClient.addEvidence(linkHash, e.evidence);
  }
);

// Bind all modals to the root element.
ReactModal.setAppElement('#root');

ReactDOM.render(
  <Router>
    <App store={storeClient} fossilizer={fossilizerClient} />
  </Router>,
  document.getElementById('root')
);
