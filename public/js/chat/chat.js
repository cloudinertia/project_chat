'use strict'
const socket = io();

$(document).ready(() => {
	$('#enter').click(() => {
		socket.emit('startChat');
		return false;
	})

})