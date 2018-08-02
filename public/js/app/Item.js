'use strict';
/**
 * Singleton class of parameters
 * @author Ruofei Du
 */
var Item = function (_oid, _category, _src, _z, _obj = null) {
	if (_obj === null) {
		this.oid = _oid;
		this.category = _category;
		this.src = _src;
		this.zIndex = _z;
		this.top = 0;
		this.left = 0;
		this.width = 0; 
		this.height = 0; 
		this.transform = 0;
		this.checked = false; 
	} else {
		this.oid = _obj.oid;
		this.category = _obj.category;
		this.src = _obj.src;
		this.zIndex = _obj.z;
		
		this.top = _obj.top;
		this.left = _obj.left;
		this.width = _obj.width; 
		this.height = _obj.height; 
		this.transform = _obj.transform; 
		this.checked = _obj.checked; 
	}
	debug('Item', 'Create ' + this.oid);
}

// get the jQuery objects
Item.prototype.get = function() {
	return $("#" + this.oid);
}

// get the jQuery wrapper
Item.prototype.getWrapper = function() {
	return $("#" + this.oid + "-wrapper");
}

// get jQuery
Item.prototype.getJid = function () {
	return "#" + this.oid;
}

// get the jQuery ID of the wrapper
Item.prototype.getWid = function () {
	return "#" + this.oid + "-wrapper";
}

Item.prototype.update = function (id = -1) {
	if (id >= 0) {
		this.updateZindex(id); 
	}
	this.top = this.get().css("top");
	this.left = this.get().css("left");
	this.width = this.get().css("width");
	this.height = this.get().css("height");
	this.zIndex = this.get().css("z-index");
	this.transform = this.get().css("transform");
}

Item.prototype.layout = function() {
	this.get().css("top", this.top);
	this.get().css("left", this.left);
	this.get().css("width", this.width);
	this.get().css("height", this.height);
	this.get().css("z-index", this.zIndex);
	this.get().css("transform", this.transform);
}

Item.prototype.updateZindex = function(id) {
	id += 1; 
	this.setZindex(id); 
}

Item.prototype.setZindex = function(_z) {
	this.zIndex = _z;
	this.get().css('z-index', _z);
	this.getWrapper().css('z-index', _z);
}

Item.prototype.updateCheckButton = function() {
	if (this.checked) {
		this.check(); 
	} else {
		this.uncheck(); 
	}
}

Item.prototype.render = function() {
	this.get().css({
		"background-image": "url(" + this.src + ")",
		"background-size": "100% 100%",
	});
}

Item.prototype.check = function() {
	this.checked = true; 
	$("#check").addClass("done");
	$("#check").removeClass("todo");
}


Item.prototype.uncheck = function() {
	this.checked = false;
	$("#check").removeClass("done");
	$("#check").addClass("todo");
}

Item.prototype.toggleChecked = function() {
	this.checked = !this.checked;
	this.updateCheckButton(); 
}


Item.prototype.attachControllers = function() {
	for (const dir of Paras.layout.resizableDirections) {
		var resizeHandle = $("<div>", {
			class: "ui-resizable-handle ui-resizable-" + dir,
			id: this.oid + "-resizable-" + dir,
		});
		this.get().append(resizeHandle);
	}
}

Item.prototype.generateDiv = function() {
	var s = 
		"<div class='box-wrapper' id='" + this.oid + "-wrapper'>" +
		"<div class='box " + this.category +
		"' id='" + this.oid +
		"' style=\"background:url('" +
		this.src + "'); background-size: 100% 100%;\"></div>" +
		"</div>";
	return s; 
}

Item.prototype.flip = function() {
	var p = this.src.lastIndexOf("_flip");
	var q = this.src.lastIndexOf(".");
	if (p >= 0) {
		this.src = this.src.substr(0, p) + this.src.substr(q, 4); 
	} else {
		this.src = this.src.substr(0, q) + "_flip" + this.src.substr(q, 4); 
	}
	this.render(); 
}

