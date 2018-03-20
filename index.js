'use strict';

const path = require('path');
const MergeTrees = require('broccoli-merge-trees');
const Rollup = require('broccoli-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  name: 'ember-showdown-highlight',

  included(app) {
    this._super.included.apply(this, arguments);

    while (typeof app.import !== 'function' && app.app) {
      console.log("app.import does not equal a function!");
      app = app.app
    }

    this.app = app;

    const vendor = this.treePaths.vendor;

    app.import(vendor + '/showdown-highlight/lib/index.js', {
      using: [
        {
          transformation: 'amd',
          as: 'showdown-highlight'
        }
      ]
    });

    return app;
  },

  treeForVendor(vendorTree) {
    let showdownHighlightPath = path.dirname(require.resolve('showdown-highlight'));

    let rollupTree = new Rollup(showdownHighlightPath, {
      rollup: {
        input: 'index.js',
        plugins: [
          resolve(),
          commonjs()
        ],
        output: {
          file: 'showdown-highlight/lib/index.js',
          format: 'amd',
          name: 'showdown-highlight'
        }
      }
    });

    let trees = [rollupTree];

    if (vendorTree) {
      trees.push(vendorTree);
    }

    return new MergeTrees(trees);
  },
};
