'use strict'
let 
	userNum = 1
	,nickNames = {}
	,waitingList = []
	,roomNum = 1
	,roomMember = {}
	,userWhere = {}
	,userTriger = {}


module.exports = {
	// should be unique to give this number to individuals
	userNum: userNum,
	nickNames: nickNames,
	waitingList: waitingList,
	roomNum: roomNum,
	roomMember: roomMember,
	userWhere: userWhere,
	userTriger: userTriger,
}