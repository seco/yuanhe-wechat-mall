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
      telnum: 10086,
      contact_name: 'bobby',
      unfollow: false,
      openid: '12345',
      created_at: new Date()
    };

    store.store_name = store.store_name + ' ' + i;

    db.stores.insert(store);
  }
};
