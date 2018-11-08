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
import { Link } from 'react-router-dom';

export interface NavBarProps {
  assets: string[];
}

export const NavBar: SFC<NavBarProps> = ({ assets }) => (
  <div>
    <nav>
      <ul>
        <li key='home'>
          <Link to='/'>Home</Link>
        </li>
        {assets.map((asset: string) => (
          <li key={asset}>
            <Link to={`/${asset}`}>{asset}</Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);
