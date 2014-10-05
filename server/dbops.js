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
  created_at: new Date()
});
db.viewevents.insert({
  member_id: ObjectId(''),
  member_openid: 'abc',
  product_id: ObjectId(''),
  store_id: ObjectId(''),
  viewed_at: new Date()
});

db.viewevents.find({
  member_openid: 'abc'
}).sort({
  'viewed_at': -1
}).limit(1); //return store_id that member visited recently
db.members.update({
  _id: ObjectId('')
}, {
  $set: {
    unfollow: false,
    member_at: new Date(),
    following_store_id: ObjectId(''),
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

db.viewevents.find({
  member_openid: ''
}).sort(viewed_at: -1).limit(1); //return store_id that member visited recently
db.members.findOne({
  member_openid: ''
}); //return member following_store_id

db.orders.insert({
  order_status: 'create',
  weixin_order_id: '',
  weixin_order_detail: {},
  stores: [{
    id: ObjectId('5423072cf13de9f92dc68dae'),
    store_name: 'this is sales store name',
    store_type: 'sales_store'
  }, {
    id: ObjectId('5423072cf13de9f92dc68daf'),
    store_name: 'this is member store name',
    store_type: 'member_store'
  }],
  payment: 19.98,
  product: {
    id: ObjectId(),
    price: 9.99,
    quantity: 2
  },
  created_at: new Date()
});

//syn
db.orders.findOne({
  weixin_order_id: ''
});
db.orders.update({
  _id: ObjectId(''),
  //'stores.id': ObjectId(''),
  'stores.store_type': 'sales_store'
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
      store_id: "$stores.id",
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
      store_id: "$stores.id",
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
