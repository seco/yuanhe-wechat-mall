// db.stores
var store = {
  _id: ObjectId(''),
  openid: '',
  scene_id: 100000,
  store_name: '',
  store_type: '',
  store_address: '',
  telnum: '',
  alias: '',
  contact_name: '',
  created_at: new Date(),
  updated_at: new Date(),
  following_at: new Date(),
  unfollow: false
};

// db.members
var member = {
  _id: ObjectId(''),
  openid: '',
  channel_store_id: ObjectId(''),
  created_at: new Date(),
  updated_at: new Date(),
  following_at: new Date(),
  unfollow: false
};

// db.member_events
var member_event = {
  _id: ObjectId(''),
  // could be 'view', 'subscribe', etc.
  type: '',
  // member openid
  member_openid: '',
  // be used as store open id if it's a view event
  store_id: ObjectId(''),
  // be used as product id if it's a view event
  weixin_product_id : '',
  created_at: new Date(),
  updated_at: new Date()
};

// db.products
var product = {
  _id: ObjectId(''),
  weixin_product_id: '',
  weixin_product_info: {
    'product_id': '',
    'product_base': {
      // product name
      'name': '',
      // url array
      'img': ['', '']
    }
  },
  redirect_url: '',
  created_at: new Date(),
  updated_at: new Date()
};

// db.orders
var order = {
  _id: ObjectId(''),
  weixin_order_id: '',
  weixin_order_info: {},
  stores: [{
    store_id: ObjectId(''),
    store_name: '',
    store_type: 'sales',
    commission: 0.00
  }, {
    store_id: ObjectId(''),
    store_name: '',
    store_type: 'channel',
    commission: 0.00
  }],
  member: {
    member_openid: '',
    member_name: ''
  },
  created_at: new Date(),
  updated_at: new Date(),
  // could be 'created' or 'settled'
  state: ''
};

// db.counters
// scend id document used to generate QR code
var counter = {
  _id: 'scene_id',
  value: 0
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
