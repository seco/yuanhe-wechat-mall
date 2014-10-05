//db.stores
db.stores.count({
  unfollow: false
});
db.stores.find({
  unfollow: false
}).limit(25).skip(0).sort({
  created_at: -1
});
db.stores.find({
  _id: ObjectId(id)
});
db.stores.update({
  _id: ObjectId(id)
}, {
  '$set', updAttr
});

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
      created_at: new Date(),
      updated_at: new Date()
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
    query: {
      _id: name
    },
    update: {
      $inc: {
        seq: 1
      }
    },
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
  created_at: new Date(),
  updated_at: new Date()
});
db.view_events.insert({
  member_openid: 'abc',
  store_id: ObjectId(''),
  weixin_product_id: ObjectId(''),
  created_at: new Date(),
  updated_at: new Date()
});

db.view_events.find({
  member_openid: 'abc'
}).sort({
  'created_at': -1
}).limit(1); //return store_id that member visited recently

db.members.update({
  _id: ObjectId('')
}, {
  $set: {
    unfollow: false,
    channel_store_id: ObjectId(''),
    following_at: new Date()
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

db.view_events.find({
  member_openid: ''
}).sort(viewed_at: -1).limit(1); //return store_id that member visited recently
db.members.findOne({
  openid: ''
}); //return member channel_store_id

db.orders.insert({
  weixin_order_id: '',
  weixin_order_info: {},
  stores: [{
    store_id: ObjectId('5423072cf13de9f92dc68dae'),
    store_name: 'this is sales store name',
    store_type: 'sales_store'
  }, {
    store_id: ObjectId('5423072cf13de9f92dc68daf'),
    store_name: 'this is member store name',
    store_type: 'member_store'
  }],
  created_at: new Date(),
  updated_at: new Date(),
  state: 'created'
});

//syn
db.orders.findOne({
  weixin_order_id: ''
});
//insert store source
db.orders.update({
  _id: ObjectId('')
}, {
  "$push": {
    "stores": {
      "$each": [{
        store_id: ObjectId('5423072cf13de9f92dc68dae'),
        store_name: 'this is sales store name',
        store_type: 'sales_store'
      }, {
        store_idd: ObjectId('5423072cf13de9f92dc68daf'),
        store_name: 'this is member store name',
        store_type: 'member_store'
      }]
    }
  }
});
//update commission
db.orders.update({
  _id: ObjectId(''),
  //'stores.store_id': ObjectId(''),
  'stores.store_type': 'sales' // sales or channel
}, {
  $set: {
    'stores.$.commission': 20.99
    //'stores.$.store_name': 'this is sales store name'
  }
});

//calculate commission
db.orders.aggregate([{
  $unwind: "$stores"
}, {
  $group: {
    _id: {
      store_id: "$stores.store_id",
      store_name: "$stores.store_name"
    },
    total_commission: {
      $sum: "$stores.commission"
    }
  }
}, {
  $sort: {
    "_id.store_id": 1
  }
}, {
  $skip: 0
}, {
  $limit: 25
}]);

//calculate count of commission
db.orders.aggregate([{
  $unwind: "$stores"
}, {
  $group: {
    _id: {
      store_id: "$stores.store_id",
      store_name: "$stores.store_name"
    },
    total_commission: {
      $sum: "$stores.commission"
    }
  }
}, {
  $group: {
    _id: null,
    count: {
      $sum: 1
    }
  }
}]);
