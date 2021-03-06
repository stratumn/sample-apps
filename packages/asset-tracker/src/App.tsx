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
import React, { Component } from 'react';
import {
  match,
  matchPath,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import { Home } from './Home';
import { NavBar } from './NavBar';
import { Tracker } from './Tracker';

interface RouterProps {
  asset: string;
}

export interface Props extends RouteComponentProps<RouterProps> {
  store: IStoreClient;
  fossilizer: IFossilizerClient;
}

export interface State {
  assets: string[];
}

class App extends Component<Props, State> {
  public state = { assets: [] };

  public async componentDidMount() {
    const assets = await this.props.store.getMapIDs('asset-tracker');
    this.setState({ assets });
  }

  public async componentDidUpdate() {
    const routerProps = matchPath<RouterProps>(this.props.location.pathname, {
      path: '/:asset'
    });
    if (!routerProps) {
      return;
    }
    if (this.state.assets.find((a: string) => a === routerProps.params.asset)) {
      return;
    }

    // If a new asset has been added, refresh the assets list.
    const assets = await this.props.store.getMapIDs('asset-tracker');
    this.setState({ assets });
  }

  public render() {
    const routerProps = matchPath<RouterProps>(this.props.location.pathname, {
      path: '/:asset'
    });

    return (
      <div
        style={{
          alignItems: 'stretch',
          display: 'flex',
          height: '100vh',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: '#3B058D',
            color: 'white',
            flexBasis: '20%'
          }}
        >
          <NavBar assets={this.state.assets} />
        </div>
        <div style={{ color: '#5246f7', flexBasis: '80%' }}>
          <Switch>
            <Route
              exact
              path='/'
              render={() => (
                <Home
                  store={this.props.store}
                  fossilizer={this.props.fossilizer}
                />
              )}
            />
            <Route
              exact
              path='/:asset'
              render={() => (
                <Tracker
                  store={this.props.store}
                  asset={(routerProps as match<RouterProps>).params.asset}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
