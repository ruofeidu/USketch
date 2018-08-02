'use strict';
if (typeof String.prototype.start_with != 'function') {
	String.prototype.start_with = function (str) {
		return this.slice(0, str.length) == str;
	};
}

Array.prototype.swap = function (x, y) {
	var b = this[x];
	this[x] = this[y];
	this[y] = b;
	return this;
}

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};
