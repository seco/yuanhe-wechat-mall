// db.accounts
var act_admin = {
  act_name: 'yuanhe_sa',
  act_displayname: '元合超级管理员',
  act_password: 'yuanhe_201410',
  role_name: 'superadmin',
  created_at: new Date()
};

db.accounts.insert(act_admin);

var counter = {
  _id: 'scene_id',
  value: 0
};

db.counters.insert(counter);

var yuanhe_store = {
  openid: '',
  scene_id: -1,
  store_name: '元合服饰',
  store_type: 'physical',
  store_address: '',
  telnum: '64066323-866',
  alias: '',
  contact_name: '',
  created_at: new Date(),
  updated_at: new Date(),
  following_at: new Date(),
  unfollow: true
};

db.stores.insert(yuanhe_store);
