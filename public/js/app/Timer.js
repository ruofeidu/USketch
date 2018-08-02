'use strict';
var Timer = function(s){
	this.val = 0;
	this.str = s; 
	this.start = function() {
		this.val = +new Date();
	}
	this.end = function() {
		var e = +new Date();
		this.val = e - this.val; 
	}
	this.report = function() {
		debug('Stat', this.str + ' ' + this.val + ' ms');
	}
}
