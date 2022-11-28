'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	return await db.collection("nftItem").doc(event._id).update({
		isSaling: event.isSaling
	})
};