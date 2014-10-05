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
  store_name: '',
  // be used as product id if it's a view event
  weixin_product_id: '',
  created_at: new Date(),
  updated_at: new Date()
};

// db.products
var product = {
  _id: ObjectId(''),
  weixin_product_id: '',
  weixin_product_info: {
    "product_id": "pDF3iY6Kr_BV_CXaiYysoGqJhppQ",
    "product_base": {
      "name": "testaddproduct",
      "category_id": [
        537074298
      ],
      "img": [
        "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2iccsvYbHvnphkyGtnvjD3ulEKogfsiaua49pvLfUS8Ym0GSYjViaLic0FD3vN0V8PILcibEGb2fPfEOmw/0"
      ],
      "property": [{
        "id": "品牌",
        "vid": "Fujifilm/富士"
      }, {
        "id": "屏幕尺寸",
        "vid": "1.8英寸"
      }, {
        "id": "防抖性能",
        "vid": "CCD防抖"
      }],
      "sku_info": [{
        "id": "1075741873",
        "vid": [
          "1079742386",
          "1079742363"
        ]
      }],
      "buy_limit": 10,
      "main_img": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2iccsvYbHvnphkyGtnvjD3ulEKogfsiaua49pvLfUS8Ym0GSYjViaLic0FD3vN0V8PILcibEGb2fPfEOmw/0",
      "detail_html": "<div class=\"item_pic_wrp\" style=\"margin-bottom:8px;font-size:0;\"><img class=\"item_pic\" style=\"width:100%;\" alt=\"\" src=\"http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2iccsvYbHvnphkyGtnvjD3ulEKogfsiaua49pvLfUS8Ym0GSYjViaLic0FD3vN0V8PILcibEGb2fPfEOmw/0\" ></div><p style=\"margin-bottom:11px;margin-top:11px;\">test</p><div class=\"item_pic_wrp\" style=\"margin-bottom:8px;font-size:0;\"><img class=\"item_pic\" style=\"width:100%;\" alt=\"\" src=\"http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2iccsvYbHvnphkyGtnvjD3ul1UcLcwxrFdwTKYhH9Q5YZoCfX4Ncx655ZK6ibnlibCCErbKQtReySaVA/0\" ></div><p style=\"margin-bottom:11px;margin-top:11px;\">test again</p>"
    },
    "sku_list": [{
      "sku_id": "1075741873:1079742386",
      "price": 30,
      "icon_url": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl2iccsvYbHvnphkyGtnvjD3ulEKogfsiaua49pvLfUS8Ym0GSYjViaLic0FD3vN0V8PILcibEGb2fPfEOmw/0",
      "quantity": 800,
      "product_code": "testing",
      "ori_price": 9000000
    }, {
      "sku_id": "1075741873:1079742363",
      "price": 30,
      "icon_url": "http://mmbiz.qpic.cn/mmbiz/4whpV1VZl28bJj62XgfHPibY3ORKicN1oJ4CcoIr4BMbfA8LqyyjzOZzqrOGz3f5KWq1QGP3fo6TOTSYD3TBQjuw/0",
      "quantity": 800,
      "product_code": "testingtesting",
      "ori_price": 9000000
    }],
    "attrext": {
      "isPostFree": 0,
      "isHasReceipt": 1,
      "isUnderGuaranty": 0,
      "isSupportReplace": 0,
      "location": {
        "country": "中国",
        "province": "广东省",
        "city": "广州市",
        "address": "T.I.T创意园"
      }
    },
    "delivery_info": {
      "delivery_type": 1,
      "template_id": 103312920
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

// db.accounts
var account = {
  _id: ObjectId('542a1ef1a5ee873861df8c6c'),
  act_name: 'yuanhe_sa',
  act_displayname: '元合超级管理员',
  act_password: 'yuanhe_201410',
  role_name: 'superadmin',
  created_at: new Date()
};
