'use strict'
const
	router = require('express').Router()
	,chat = require('../libs/chat')
	,chatData = require('../models/chat')


router.get('/', (req, res, next) => {
	const io = req.io;
	io.to().once('connection', (socket) => {
		console.log('=== socket is connected ===');
		// assign a user name with number
		chat.assignNum(socket, io);

		// when client wants to start chatting.
		socket.on('startChat', () => {
			chat.matching(socket, io);
		});

		socket.on('message', (message) => {
			chat.messaging(socket, io, message);
		});

		// disconnect
		socket.on('disconnect', () => {
			chat.disconnect(socket, io);
			console.log(chatData);
		});
	});
	res.render('test');
})

module.exports = router;