# sharetribe-scripts

This is a fork of the
[react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts)
package from the
[facebook/create-react-app](https://github.com/facebook/create-react-app)
monorepo.
You can refer to its documentation:

- [Getting Started](https://github.com/facebook/create-react-app/blob/master/README.md#getting-started) – How to create a new app.
- [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md) – How to develop apps bootstrapped with Create React App.

This package is published as
[sharetribe-scripts](https://www.npmjs.com/package/sharetribe-scripts)
in NPM.

See the `description` field in [package.json](package.json) to see
which version of `react-scripts` this fork is built from.

## Differences to `react-scripts`

- Use [CSS Modules](https://github.com/css-modules/css-modules)
- Use [cssnext](http://cssnext.io/)
- Use [postcss-import](https://github.com/postcss/postcss-import)
- Build an UMD module in production mode to support server side rendering

## Development

### Setup

To update the fork to use a new version of the upstream repository:

1. If you haven't already, configure the upstream repository as a remote:

   ```
   git remote add upstream https://github.com/facebookincubator/create-react-app
   ```

1. [Sync the fork](https://help.github.com/articles/syncing-a-fork/)
   to a branch, making sure you merge from a specific version/tag that
   you want to base your changes on

   ```
   git fetch upstream
   git checkout master
   git checkout -b update-from-upstream
   git merge <tag_to_be_merged_here_eg_v1.1.2>
   ```

1. Make your changes, test them (see below), make a PR, release

### Making changes and testing

To test your local changes, link the local repository to the application:

1. In the `create-react-app/packages/react-scripts` directory, install
   dependencies and make a link of the package:

   ```
   yarn install # ignore the yarn.lock file
   yarn link
   ```

   **NOTE:** if other packages have changed too, you might need to run
   `yarn install # ignore the yarn.lock file` on the root folder too.

1. In the application remove the old `sharetribe-scripts` package and
   use the linked version ([read more](https://yarnpkg.com/lang/en/docs/cli/link/)):

   ```
   yarn remove sharetribe-scripts
   yarn link sharetribe-scripts
   ```

1. Now you changes to the fork are usable as a symlicked dependency in
   the application

### Publishing

1. Make sure you have updated the version also in the `description`
   field in [package.json](package.json). Try to sync the package
   version with the original package, if possible.

1. Publish to NPM:

   ```
   npm login
   # Check credentials from password manager
   npm publish
   ```

1. Tag the commit with released version: `sharetribe-scripts@x.x`
