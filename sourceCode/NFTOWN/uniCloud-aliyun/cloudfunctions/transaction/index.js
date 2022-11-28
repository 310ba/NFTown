'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {//买家buyer_id，卖家seller_id，物品product_id,product_price
	db.collection("uni-id-users").doc(event.buyer_id).update({
		money: dbCmd.inc(0-event.product_price),
		collection_list: dbCmd.push(event.product_id)
	})
	db.collection("uni-id-users").doc(event.seller_id).update({
		money: dbCmd.inc(event.product_price),
		collection_list: dbCmd.pull(event.product_id)
	})
	db.collection("nftItem").doc(event.product_id).update({
    isSaling: false,
		owner: event.buyer_name,
		owner_id: event.buyer_id
	})
};