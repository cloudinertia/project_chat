'use strict'
const
	chatData = require('../models/chat');

// initial setting
chatData.roomMember[1] = [];

// decide how many members in each room
let howMany = 2;




/**
 *		=== when user enter the page, we give him/her a unique name 
 **/
exports.assignNum = (socket, io) => {
	// just in case that userNum is too big...
	if(chatData.userNum > 1000) chatData.userNum = 1;

	// assign a name and prepare for next user(increasing the number)
	chatData.nickNames[socket.id] = `Gest${chatData.userNum}`;
	chatData.userNum ++;

	// changeRoom process deactivate
	chatData.userTriger[socket.id] = false;

	// LOBBY
	chatData.userWhere[socket.id] = 'LOBBY';
};


/**
 * 		=== when user start chat
 */
exports.matching = (socket, io) => {

	// to prevent duplicate user in waitingList 
	if(chatData.waitingList.indexOf(socket.id) === -1){
		// move user to the chat room
		socket.join(chatData.roomNum);
		let prevRoom = chatData.userWhere[socket.id];
		chatData.userWhere[socket.id] = chatData.roomNum;
		chatData.roomMember[chatData.roomNum].push(socket.id);
		console.log(`${socket.id} is in room number ${chatData.roomNum}`);

		
		// if user wants to change his room ((if user already in the active room))
		if((chatData.userTriger[socket.id] === true) && (chatData.roomMember[prevRoom].length === howMany)){
			console.log('here')
			// leave current Room
			socket.leave(prevRoom);
			chatData.roomMember[prevRoom] = [];

			// let him and others know that room is Boomed!!!
			socket.emit('boom');
			socket.broadcast.to(chatData.userWhere[socket.id]).emit('boom');
		}



		// put user on the waiting list
		chatData.waitingList.push(socket.id);

		

		// wait until other user join
		if(chatData.waitingList.length < howMany){

			// let user know waiting another user
			socket.emit('waiting');
			console.log('=== waiting ===');
		}else{ // we have enough user to let them start chat!!
			
			// changeRoom process activate
			chatData.userTriger[socket.id] = true;

			// let user know time to start chatting.
			socket.emit('startChat');
			console.log('=== starting ===');

			// remove all users from the waiting List
			chatData.waitingList.splice(0)

			// prepare for next room
			if(chatData.roomNum > 100){
				chatData.roomNum = 1;
			}else{
				chatData.roomNum += 1;
				chatData.roomMember[chatData.roomNum] = [];
			}
		}

	}else if(chatData.waitingList.indexOf(socket.id) != -1){ // user already in the waiting list
		console.log('=== already in the waiting  === ')
		socket.emit('notice'); // you are already in the waiting list
	
	}else{ // user wants to change his room

	}
	console.log(chatData)
};


/**
 *		=== Start Chatting
 */
exports.messaging = (socket, io, message) => {
	socket.broadCast.to()
};


/**
 *     ==== when user leaves the page
 **/
exports.disconnect = (socket, io) => {
	console.log('=== socket is disconnected ===');

	chatData.roomMember[chatData.userWhere[socket.id]]

	lowDelete(socket);
	highDelete(socket);
};




const lowDelete = (socket) => {

	// check if user on the waiting list.
	if(chatData.waitingList.indexOf(socket.id) != -1){
		chatData.waitingList.splice(chatData.waitingList.indexOf(socket.id), 1);
	}

	// delete the user information
	if(chatData.userWhere[socket.id] != 'LOBBY') {
		chatData.roomMember[chatData.userWhere[socket.id]] = [];
	}
	delete chatData.userWhere[socket.id];

	return;
};

const highDelete = (socket) => {

	delete chatData.userTriger[socket.id];
	delete chatData.nickNames[socket.id];
};
