//db.stores
var store = {
  _id: ObjectId('542270a9f13de9f92dc68d92'),
  alias: 'gitcafe',
  store_name: 'gitcafe store',
  store_type: 'virtual',
  store_address: 'pudongdadao 111hao',
  telnum: '10086',
  contact_name: 'bobby',
  unfollow: false,
  openid: '12345',
  scene_id: 100000,
  created_at: new Date()
};
//db.counters
var counter = {
  _id: 'scene_id',
  seq: 0
};
//db.products
var product = {
  _id: 77,
  promotion_url: 'http://www.taobao.com'
};
//db.orders
var order = {
  _id: ObjectId('542532bda5ee873861df8c67'),
  order_status: 'create',
  weixin_order_id: '',
  weixin_order_detail: {},
  sales_store: {
    id: ObjectId('542270a9f13de9f92dc68d92'),
    store_name: 'this is sales store name',
    commission: 15.00
  },
  member_store: {
    id: ObjectId('542270a9f13de9f92dc68d92'),
    store_name: 'this is member store name',
    commission: 5.00
  },
  member: {
    id: ObjectId('5425316ca5ee873861df8c65'),
    member_name: 'this is member nane'
  },
  payment: 9.99,
  product: {
    id: 1,
    price: 10.00,
    quantity: 2
  },
  created_at: new Date()
};
//db.members
var member = {
  _id: ObjectId('5425316ca5ee873861df8c65'),
  openid: 'abc',
  unfollow: true,
  created_at: new Date(),
  member_at: new Date(),
  following_store_id: ObjectId('542270a9f13de9f92dc68d92'),
  following_at: new Date()
};
//db.viewevents
var viewevent = {
  _id: ObjectId(''),
  member_id: ObjectId('5425316ca5ee873861df8c65'),
  member_openid: 'abc',
  product_id: ObjectId(''),
  store_id: ObjectId('542270a9f13de9f92dc68d92'),
  viewed_at: new Date()
};
