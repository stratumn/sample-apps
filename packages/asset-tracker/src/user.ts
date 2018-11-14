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

import { sig } from '@stratumn/js-crypto';

export class User {
  public name: string;
  public privateKey: any;

  constructor(name: string, encodedKey: string) {
    this.name = name;
    this.privateKey = new sig.SigningPrivateKey({
      pemPrivateKey: encodedKey
    });
  }
}

const alicePrivateKey = `
-----BEGIN ED25519 PRIVATE KEY-----
MFACAQAwBwYDK2VwBQAEQgRAc5mhD9f76Q2GV7fDkqXDH+2Jsfsn574cMUZBk6CE
OxpHceWVsJFGlQPtcqVfWeSBYWrmzbuerntZmCyImLB2wA==
-----END ED25519 PRIVATE KEY-----
`;

const bobPrivateKey = `
-----BEGIN ED25519 PRIVATE KEY-----
MFACAQAwBwYDK2VwBQAEQgRA4shtt8Qdyp8LZrd7EI3IqZB1OwTiXaGjLN0usTA0
QQN4VEmMHTKjGXmNbrESiLp6XydmypyzXF/HO4jT/QT9tg==
-----END ED25519 PRIVATE KEY-----
`;

const carolPrivateKey = `
-----BEGIN ED25519 PRIVATE KEY-----
MFACAQAwBwYDK2VwBQAEQgRAaocCI2Rru7H9SS+koq28DJsM/7ZyTG1hKW9824he
DgNRiQf5dDgEhKaiU/9cq88snWlY0AafXPreJCUWei1ezg==
-----END ED25519 PRIVATE KEY-----
`;

const alice = new User('alice', alicePrivateKey);
const bob = new User('bob', bobPrivateKey);
const carol = new User('carol', carolPrivateKey);

export const users = [alice, bob, carol];

export const getUser = (name: string): User => {
  switch (name) {
    case 'alice':
      return alice;
    case 'bob':
      return bob;
    case 'carol':
      return carol;
    default:
      throw new Error(`unknown user '${name}'`);
  }
};
