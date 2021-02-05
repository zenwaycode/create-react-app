'use strict';

const path = require('path');
const cloneDeep = require('lodash/cloneDeep');
const LoadablePlugin = require('@loadable/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const paths = require('./paths');

// PostCSS plugins:
// - postcss-import, postcss-apply are our additions
// - postcss-preset-env: we use nesting and custom-media-queries.
// - postcss-custom-properties: preserve is turned off due to load it adds to web inspector
//   in dev environment.
const postcssPlugins = [
  require('postcss-import'),
  require('postcss-apply'),
  require('postcss-flexbugs-fixes'),
  require('postcss-preset-env')({
    autoprefixer: {
      flexbox: 'no-2009',
    },
    features: {
      "custom-properties": false,
      'nesting-rules': true, // stage 0
      'custom-media-queries': true, // stage 1
    },
    stage: 3,
  }),
];

// Check that webpack.config has known structure.
const checkConfigStructure = config => {
  // First validate the structure of the config to ensure that we mutate
  // the config with the correct assumptions.
  const hasRules =
    config &&
    config.module &&
    config.module.rules &&
    config.module.rules.length === 2;
  const hasOneOf =
    hasRules &&
    config.module.rules[1].oneOf &&
    config.module.rules[1].oneOf.length === 9;
  const hasCssLoader =
    hasOneOf &&
    config.module.rules[1].oneOf[4].test &&
    config.module.rules[1].oneOf[4].test.test('file.css');
  const hasPlugins = !!config.plugins;
  const hasOutput = !!config.output;
  const hasOptimization = !!config.optimization;

  const configStructureKnown = hasRules
        && hasOneOf
        && hasCssLoader
        && hasPlugins
        && hasOutput
        && hasOptimization;

  if (!configStructureKnown) {
    throw new Error(
      'create-react-app config structure changed, please check webpack.config.js and update to use the changed config'
    );
  }

  return configStructureKnown;
};

const applySharetribeConfigs = (config, options) => {
  const { target, isEnvProduction } = options;
  const isServer = target === 'node';
  checkConfigStructure(config);

  // Add LoadablePlugin to the optimization plugins
  const newConfig = cloneDeep(config);
  newConfig.plugins = [new LoadablePlugin(), ...config.plugins];

  if (isServer) {
    // Set name and target to node as this is running in the server
    newConfig.name = 'node';
    newConfig.target = 'node';

    // Add custom externals as server doesn't need to bundle everything
    newConfig.externals = [
      '@loadable/component',
      nodeExternals(), // Ignore all modules in node_modules folder
    ];

    // Use a 'node' subdirectory for the server build
    newConfig.output.path = isEnvProduction
      ? path.join(paths.appBuild, 'node')
      : undefined;

    // Set build output specifically for node
    newConfig.output.libraryTarget = 'commonjs2';
    newConfig.output.filename = '[name].[contenthash:8].js';
    newConfig.output.chunkFilename = '[name].[contenthash:8].chunk.js';

    // Disable runtimeChunk as it seems to break the server build
    newConfig.optimization.runtimeChunk = undefined;
  }

  return newConfig;
};

module.exports = {
  postcssPlugins,
  applySharetribeConfigs,
};
