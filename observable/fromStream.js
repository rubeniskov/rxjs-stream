const duplex = require('../operators/duplex');

module.exports = stream => duplex(stream)(null);
