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

import React, { SFC } from 'react';

export const Home: SFC = () => (
  <div style={{ textAlign: 'center' }}>
    <h1>Asset Tracker</h1>
    <p>Welcome to the Asset Tracker Demo App.</p>
    <p>
      Assets that you have already created can be viewed by clicking on their
      name on the left menu.
    </p>
    <p>
      See the README for details about the store and the scenario that you can
      try.
    </p>
  </div>
);
