# Asset Tracker

This application showcases how you can use Chainscript and Stratumn technologies
to track the ownership of an asset.

The main page lets you create new assets. The list of all assets created can be
found on the navigation menu on the left.
Navigating to an asset page lets you see the ownership trail and transfer
ownership of the asset between three users (Alice, Bob and Carol).

To start the app, you first need some backend components (data storage and
fossilizer). We make it easy to run a sample backend from Docker images.
Simply run:

```bash
yarn backend:up
```

And you'll have a backend up and running.

Then you can start the app with:

```bash
yarn start
```

## Learning

You can find detailed documentation on our [developer website](https://developer.stratumn.com).

### Backend

By default the backend uses a simple in-memory storage.
That means that when you stop the backend and restart it, all your links will
be deleted.

Head over to the `docker-compose.yml` file to change this configuration.
You can uncomment the part that uses a PostgreSQL-backed store for a more
production-like setup (with persistent storage).

### Link Validation

The `validation` folder contains configuration for the validation rules that
are applied server-side.

You can find detailed documentation of the validation rules on our
[developer website](https://developer.stratumn.com).

#### Rules.json

The `rules.json` file validates many structural rules of the ownership transfer.

The `schema` fields ensure that links always have an `owner` field in their
`data`.

The `transition` field in the `create` step ensures that asset creation needs
to be the first step in your process.

The `transition` field in the `transfer` step ensures that asset transfer can
only be done on already created assets.

#### Custom Validation Script

You can provide arbitrary validation logic via go scripts.

Validating that a transfer contains the signature of the previous owner
leverages this feature. The script is in `validation/transferPlugin.go`.

It has been compiled with the following command:

```bash
yarn validation:update
```

The plugin details have then been added to the `rules.json` file.
This plugin will run for each new link submitted and if the `Validate` function
returns an error the link will be rejected.

Try changing the app's code to make all links signed by Alice (in the
`transferOwnership` method in `Tracker.tsx`).
Now try to transfer an asset from Bob to someone else: this should be rejected.

Try changing the validation script to require signatures from both the current
owner and the next owner.

Recompile it, update the `rules.json` file with the new plugin hash, restart
the backend and change the app's code to provide the required signatures.

### Adding more features

The best way to learn is by doing.
This section contains a list of features you can add to the application to get
used to working with Chainscript.

#### Admin User

Add an admin user (Faythe) whose signature is required for all ownership
transfers.

In `validation/rules.json` add Faythe's public key to the PKI section.
Update the `transfer` step section to add a `signatures` field:

```json
{
  "transfer": {
    "schema": {
      "type": "object",
      "properties": {
        "owner": {
          "type": "string"
        }
      },
      "required": ["owner"]
    },
    "transitions": ["create", "transfer"],
    "signatures": ["faythe"]
  }
}
```

Restart your backend:

```bash
yarn backend:down
yarn backend:up
```

All transfers should now be rejected because they don't have Faythe's
signature.

In `Tracker.tsx`'s `transferOwnership` method, add Faythe's signature to the
new link and everything should work properly.

#### Better UX for link display

The UX currently offers a very basic display when a link is selected.
The modal in `Tracker.tsx` can be improved to provide a better display of all
the information present in segments.

You can also add new information in the links (transfer date for example) in
the `transferOwnership` method.

#### Fine-grained signatures

We support a fine-grained control over what parts of a link are signed.
By default the whole link is signed, but in this application the only thing we
really need to sign is the `link.data` that contains the new owner.

In `Tracker.tsx`, you can change the call to `transferLink.sign()` to provide
a `payloadPath` (the second argument).

If you provide `'[version,data]'` only the link's `version` and its `data`
fields will be signed.

When the user's signature is required, it makes sense to only sign the data
produced by the user (in our case the next owner). The application can add
arbitrary data and metadata to the link and the user might not be willing to
sign that.

## App Bootstrap

This application was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
with the following command:

```bash
npx create-react-app asset-tracker --typescript
```

## Available Scripts

In the project directory, you can run:

### `yarn backend:up`

Starts all the necessary backend components (store and fossilizer).
This script uses [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/).

### `yarn backend:down`

Stops all the backend components and cleans up Docker resources.

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test:coverage`

Launches the test runner and collect coverage.

### `yarn build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
