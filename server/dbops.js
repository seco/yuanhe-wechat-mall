//db.stores
db.stores.count({unfollow:false});
db.stores.find({unfollow: false}).limit(25).skip(0).sort({created_at: -1});
db.stores.find({_id: ObjectId(id)});
db.stores.update({_id: ObjectId(id)}, {'$set', updAttr});

var initStores = function() {
  for (var i = 0; i < 30; i++) {
    var store = {
      alias: 'gitcafe',
      store_name: 'gitcafe store',
      store_type: 'virtual',
      store_address: 'pudongdadao 111hao',
      telnum: '10086',
      contact_name: 'bobby',
      unfollow: false,
      openid: '12345',
      created_at: new Date()
    };

    store.store_name = store.store_name + ' ' + i;

    db.stores.insert(store);
  }
};

/**
 * generate scene_id
 *
 */
function getNextSequence(name) {
  var ret = db.counters.findAndModify({
    query: {_id: name},
    update: {$inc: {seq: 1}},
    new: true
  });

  return ret.seq;
}



/**
 * create member(openid/productid/storeid/viewed_at)
 * check view event
 * follow store(then add following_store_id)
 *
 */
db.members.insert({
  openid: '',
  unfollow: true,
  created_at: new Date()
});
db.viewevents.insert({
  member_id: ObjectId(''),
  product_id: ObjectId(''),
  store_id: ObjectId(''),
  viewed_at: new Date()
});

db.viewevents.find({member_openid: 'abc'}).sort({'viewed_at': -1}).limit(1);//return store_id that member visited recently
db.members.update({_id: ObjectId('')},
{
  $set: {
    unfollow: false,
    following_store_id: ObjectId(''),
    following_at: new Date(),
    member_at: new Date()
  }
});



/**
 * get order request, sending to weixin
 * callback and receive order detail
 * find member(donot care whether he follow yuanhe or not) latest view_events, check store/product id
 * create order
 *
 * syn weixin_order periodically, then update order: sales/member store and commission
 *
 */

db.viewevents.find({member_openid: ''}).sort(viewed_at: -1).limit(1);//return store_id that member visited recently
db.members.findOne({member_openid: ''});//return member following_store_id
db.orders.insert({
  order_status: 'create',
  weixin_order_id: '',
  weixin_order_detail: {},
  sales_store:{
    id: ObjectId(),
    store_name: ''
  },
  member_store: {
    id: ObjectId(),
    store_name: ''
  },
  payment: 19.98,
  product: {
    id: ObjectId(),
    price: 9.99,
    quantity: 2
  },
  created_at: new Date()
});

//syn
db.orders.findOne({weixin_order_id: ''});
db.orders.update({_id: ObjectId('')},
{
  $set: {
    'sales_store.commission': 20.99,
    'member_store.commission': 39.99
  }
});
