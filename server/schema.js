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
  weixin_order_info: {
    "order_id": "7197417460812533543",
    "order_status": 6,
    "order_total_price": 6,
    "order_create_time": 1394635817,
    "order_express_price": 5,
    "buyer_openid": "oDF3iY17NsDAW4UP2qzJXPsz1S9Q",
    "buyer_nick": "likeacat",
    "receiver_name": "张小猫",
    "receiver_province": "广东省",
    "receiver_city": "广州市",
    "receiver_address": "华景路一号南方通信大厦5楼",
    "receiver_mobile": "123456789",
    "receiver_phone": "123456789",
    "product_id": "pDF3iYx7KDQVGzB7kDg6Tge5OKFo",
    "product_name": "安莉芳E-BRA专柜女士舒适内衣蕾丝3/4薄杯聚拢上托性感文胸KB0716",
    "product_price": 1,
    "product_sku": "10000983:10000995;10001007:10001010",
    "product_count": 1,
    "product_img": "http://img2.paipaiimg.com/00000000/item-52B87243-63CCF66C00000000040100003565C1EA.0.300x300.jpg",
    "delivery_id": "1900659372473",
    "delivery_company": "059Yunda",
    "trans_id": "1900000109201404103172199813"
  },
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
