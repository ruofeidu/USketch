'use strict';

function debug(module, str) {
	console.log('[' + module + ']\t' + str);
}

/**
 * Singleton class of parameters
 * @author Ruofei Du
 */
var Parameters = function () {
	this.debugMode = true;
	this.numCandidates = 12;

	this.items = [];
	this.categoryCounts = {};
	this.categoryGeneratedInstances = {};
	this.keywords = [];
	this.currentOid = null;

	this.penOn = false;
	this.eraserOn = false;

	this.candidatesFolder = Apollo.publicUrl + 'images/' + Apollo.catefolder + '/';

	this.isSaving = false;
	this.isLoading = false;
	this.hasChanged = false;
};

Parameters.prototype.getItemId = function (queryId) {
	var found = -1;
	for (var i = 0; i < Paras.items.length; ++i) {
		var item = Paras.items[i];
		if (item.oid === queryId) {
			found = i;
			break;
		}
	}
	return found;
}

Parameters.prototype.getCurrentItemId = function () {
	return (this.currentOid === undefined) ? -1 : this.getItemId(Paras.currentOid);
}

Parameters.prototype.getCurrentItem = function () {
	return (this.currentOid === undefined) ? null : this.items[this.getCurrentItemId()];
}

Parameters.prototype.updateItems = function () {
	for (var i = 0; i < this.items.length; ++i) {
		this.items[i].update(i);
	}
}

Parameters.prototype.redirect = function (task) {
	if (task < 0 || task > 1e5)
		return;
	window.location.href = Apollo.baseUrl + "?task=" + task;
}

Parameters.prototype.countdownRedirect = function (countdown) {
	setTimeout(function () {
		$("#countdown").html(countdown);
		if (countdown === 0) {
			Paras.redirect(Apollo.task + 1);
		}
	}, 1000 * (3 - countdown));
}

Parameters.prototype.redirectNextIfSaving = function () {
	if (this.isSaving)
		return;
	for (var i = 0; i <= 3; ++i) {
		this.countdownRedirect(i);
	}
	$("#dialog-success").dialog("open");
}

Parameters.prototype.swapItems = function (i, j) {
	if (Math.min(i, j) < 0 || Math.max(i, j) >= this.items.length)
		return;
	this.items.swap(i, j);
	this.items[i].updateZindex(i);
	this.items[j].updateZindex(j);
}

Parameters.prototype.allowSave = function () {
	var num = 0;
	for (const cate of this.allCategories) {
		if (this.categoryCounts[cate] > 0)
			++num;
	}
	console.log(this.categoryCounts); 
	return num >= 3;
}

var Paras = new Parameters();
