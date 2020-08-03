'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"http://192.168.3.100:8002"',
  // API_ROOT: '"http://192.168.3.124:8002"',
  // API_ROOT: '"http://192.168.3.119:8002"',
  // API_ROOT: '"http://192.168.3.200:8002"',
  // API_ROOT:'"https://app.ymdb2b.com/api"',
  API_ROOT: '"http://192.168.3.152/api"',
})
