/**
 * weixin OAuth handler
 *
 * @author Minix Li
 */

var appPath = process.argv[1];

var async = require('async');
var dbProxy = require(appPath).get('dbProxy');
var oauth = require(appPath + '/../lib/weixin/oauth');
var utils = require(appPath + '/../lib/util/utils');
var YuanheMember = require(appPath + '/../models/yuanheMember');
var YuanheMemberEvent = require(appPath + '/../models/yuanheMemberEvent');

/**
 * OAuth response handler when visiting product page
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.product = function(req, res) {
  var storeId = req.params.store_id;
  var productId = req.params.product_id;

  oauth.getUserInfo(req, function(err, userInfo) {
    if (err) {
      res.status(500).end();
      return;
    }

    var openid = userInfo.openid;
    YuanheMember.getByOpenid(openid, function(err, member) {
      if (err) {
        res.status(500).end();
        return;
      }

      if (member) {
        var memberId = member.get('_id');
        async.waterfall([
          function(cb) {
            var memberEvent = new YuanheMemberEvent();
            memberEvent.set('member_id', memberId);
            memberEvent.set('member_openid', openid);
            memberEvent.set('object_id', storeId);
            memberEvent.set('annotation_id', productId);
            memberEvent.set('type', 'view');
            memberEvent.set('posted', new Date());
            memberEvent.save(cb);
          },
        ], function(err, result) {
          if (err) {
            res.status(500).end();
            return;
          }
        });
      } else {
        async.waterfall([
          function(cb) {
            var member = new YuanheMember();
            member.set('openid', openid);
            member.set('status', 'unfollow');
            member.save(cb);
          },
          function(member, cb) {
            var memberId = member.get('_id');
            var memberEvent = new YuanheMemberEvent();
            memberEvent.set('member_id', memberId);
            memberEvent.set('member_openid', openid);
            memberEvent.set('object_id', storeId);
            memberEvent.set('annotation_id', productId);
            memberEvent.set('type', 'view');
            memberEvent.set('posted', new Date());
            memberEvent.save(cb);
          }
        ], function(err, result) {
          if (err) {
            res.status(500).end();
            return;
          }
        });
      }
    });
  });
};
