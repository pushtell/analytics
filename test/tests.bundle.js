var ctx = require.context('.', true, /.+\.test\.jsx?$/);
require.context('.', true, /.+\.test\.js$/).keys().forEach(ctx);
module.exports = ctx;