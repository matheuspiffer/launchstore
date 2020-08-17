const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes')
const session = require('../src/app/config/session')
const server = express();

server.use(session)
const methodOverride = require('method-override')
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);

server.set('view engine', 'html');
nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
});

// server.use((req, res) => {
//     res.status(404).render('not-found');
// });
server.listen(5000, function () {
    console.log('server is running');
});