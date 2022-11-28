'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	let res = await db.collection("uni-id-users").doc(event.user_id).update({
						collection_list: dbCmd.push(event.pic_id)
					})
	return res;
};