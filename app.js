'use strict'
const
	express = require('express'),
	logger = require('morgan'),
	http = require('http'),
	socketIo = require('socket.io'),
	session = require('express-session')


const
	app = express(),
	server = http.Server(app),
	io = socketIo(server)


// === app setting ===
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.static('public'));


// === 3rd party MiddleWare ===
app.use(logger('dev'));
app.use(session({
	secret: 'kwangho',
	resave: true,
	saveUninitialized: false,
}));


// === router ===
app.get('/', (req, res, next) => {req.io = io; next();}, require('./routes/chat'));


// === error handler ===
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err);
})


// === server running ===
server.listen(8000, () => {
	console.log('=== Server Running ===');
});