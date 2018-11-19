var dev = require('./dev.site.js');
var prod = require('./prod.site.js');

if (process.env.NODE_ENV === 'development') {
  module.exports = dev
} else {
  module.exports = prod
}