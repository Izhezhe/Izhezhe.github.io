var $ = require('jquery');

var crypto = function() {
	// require('/static/js/reqService');
};

crypto.prototype.sjclKey = function(isAsync, callback) {
	var url = reqConfig.getInterface('sjclKey');
	var key;
	$.ajax({
		url: url,
		type: 'get',
		async: isAsync,
		cache: false
	}).done(function(result) {
		if (result.code == 0) {
			callback(result.data);
			key = result.data;
		} else {
			console.error(result);
		}
	})
	return key;
};

crypto.prototype.encrypt = function(content, callback) {
	var key = this.sjclKey(!!callback, function(key) {
		var jsonString = sjcl.encrypt(sjcl.codec.hex.toBits(key), content);
		// var json = sjcl.json.decode(jsonString);
		var json = $.parseJSON(jsonString);
		callback && callback({
			ck: key,
			// ct: sjcl.codec.hex.fromBits(json.ct),
			ct: sjcl.codec.hex.fromBits(sjcl.codec.base64.toBits(json.ct)),
			// iv: sjcl.codec.hex.fromBits(json.iv)
			iv: sjcl.codec.hex.fromBits(sjcl.codec.base64.toBits(json.iv))
		})
	})
	// sync
	if (!callback) {
		var jsonString = sjcl.encrypt(sjcl.codec.hex.toBits(key), content);
		var json = sjcl.json.decode(jsonString);
		return {
			ck: key,
			ct: sjcl.codec.hex.fromBits(json.ct),
			iv: sjcl.codec.hex.fromBits(json.iv)
		}
	}
};

module.exports = crypto;