'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	//user_id获取user信息，可能存在权限问题，返回的是用户对象
	let res = await db.collection("uni-id-users").doc(event.user_id).get();
	return res;
};