module.exports = routes;

var fs = require('fs');
function routes(app) {
    fs.readdirSync('./controller/').forEach(function (file) {
        if (file.substr(-3) === '.js' && file.toString() !== 'index.js') {
            var route = require('./' + file);
            route(app);
        }
    })
}
