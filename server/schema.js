//db.stores
var store = {
  _id: ObjectId('542270a9f13de9f92dc68d92'),
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
//db.products
var product = {
  _id: 77
};
//db.orders
var order = {
  _id: 1,
  sales_store: {
    id: ObjectId('542270a9f13de9f92dc68d92'),
    store_name: '',
    commission: 15.00
  },
  member_store: {
    id: ObjectId('542270a9f13de9f92dc68d92'),
    store_name: '',
    commission: 5.00
  },
  member: {
    id: 88,
    member_name: ''
  },
  payment: 10.00,
  product: {
    id: 1,
    price: 10.00,
    quantity: 2
  },
  created_at: new Date()
};
//db.members
var member = {
  _id: 88,
  openid: '',
  unfollow: false,
  store: {
    id: ObjectId('542270a9f13de9f92dc68d92'),
    store_name: ''
  },
  products: [{
    id: 77,
    viewed_at: new Date()
  }],
  created_at: new Date()
};
