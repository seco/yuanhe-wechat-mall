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
  weixin_product_info: {
    'product_base': {
      "name": "testaddproduct",
      "img": ["http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2iccsvYbHvnphkyGtnvjD3ulEKogfsiaua49pvLfUS8Ym0GSYjViaLic0FD3vN0V8PILcibEGb2fPfEOmw/0"]
    },
    'product_id': 'pDF3iY6Kr_BV_CXaiYysoGqJhppQ'
  },
  redirect_url: 'http://www.taobao.com'
};
//db.orders
var order = {
  order_status: 'created',
  weixin_order_id: '',
  weixin_order_info: {},
  stores: [{
    id: ObjectId('5423072cf13de9f92dc68dae'),
    store_name: 'this is sales store name',
    store_type: 'sales_store',
    commission: 15.00
  }, {
    id: ObjectId('5423072cf13de9f92dc68daf'),
    store_name: 'this is member store name',
    store_type: 'member_store',
    commission: 5.00
  }],
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
  _id: ObjectId(''),
  openid: '',
  channel_store_id: ObjectId(''),
  time_following: new Date(),
  time_created: new Date(),
  time_updated: new Date(),
  status: 'following'
};

// db.member_events
var memberEvent = {
  _id: ObjectId(''),
  type: '',
  member_openid: '',
  object_id: ObjectId(''),
  annotation_id: ObjectId(''),
  posted: new Date(),
};

//db.accounts
var account = {
  _id: ObjectId('542a1ef1a5ee873861df8c6c'),
  act_name: 'yuanhe_sa',
  act_displayname: '元合超级管理员',
  act_password: 'yuanhe_201410',
  role_name: 'superadmin',
  created_at: new Date()
};

////////////////////////////////////////////////////////////////////////////////////////////////////

// db.stores
var store = {
  _id: ObjectId(''),
  openid: '',
  scene_id: 100000,
  name: '',
  alias: '',
  type: '',
  address: '',
  telnum: '',
  contact_name: '',
  time_created: new Date(),
  time_updated: new Date(),
  // could be 'following' or 'unfollow'
  status: ''
};

// db.members
var member = {
  _id: ObjectId(''),
  openid: '',
  channel_store_id: ObjectId(''),
  time_created: new Date(),
  time_updated: new Date(),
  following_at: new Date(),
  // could be 'following' or 'unfollow'
  status: ''
};

// db.products
var product = {
  _id: ObjectId(''),
  weixin_product_id: '',
  weixin_product_info: {
    'product_id': ''
    'product_base': {
      // product name
      'name': '',
      // url array
      'img': ['', '']
    }
  },
  redirect_url: ''
};

// db.member_events
var memberEvent = {
  _id: ObjectId(''),
  // could be 'view', 'subscribe', etc.
  type: '',
  // member openid
  member_openid: '',
  // be used as store open id if it's a view event
  store_id: ObjectId(''),
  // be used as product id if it's a view event
  weixin_product_id : '',
  time_created: new Date(),
  time_updated: new Date()
};

// db.orders
var order = {
  _id: ObjectId(''),
  weixin_order_id: '',
  weixin_order_info: {},
  stores: [{
    id: ObjectId(''),
    name: '',
    type: 'sales',
    commission: 0.00
  }, {
    id: ObjectId(''),
    name: '',
    type: 'channel',
    commission: 0.00
  }],
  time_created: new Date(),
  time_updated: new Date(),
  // could be 'settled' or 'unsettled'
  status: ''
};

// db.global_counters
// scend id document used to generate QR code
var global_counter = {
  _id: 'scene_id',
  value: 0,
};
