'use strict';
var Layout = function () {
	this.canvas = null;
	this.resizableDirections = ["ne", "se", "sw", "nw", "n", "e", "s", "w"];
};

Layout.prototype.init = function () {
	this.canvas = $("#canvas");
	this.subjects = $("#subjects");
	this.nextbtn = $("#next");
	this.previousbtn = $("#previous");
	this.reference = $("#reference");
	this.moveupbtn = $("#moveup");
	this.movedownbtn = $("#movedown");
	this.penbtn = $("#pen");
	this.eraserbtn = $("#eraser");
	this.resetbtn = $("#reset");
	this.removebtn = $("#remove");
	this.ipadcanvs = $("#ipad");
	this.candidatesContainer = $("#candidates-container");
	this.candidatesNotFoundMessage = $("#candidates-nothing");
	this.panelWidth = $("#panel").width();
	this.savebtn = $("#save");
	this.loadbtn = $("#load");
	this.flipbtn = $("#flip");
	this.layers = $("#layers");
	this.selectRoadButton = $("#select-road");
	this.historyPics = $("#dialog-history-pics");
	this.candidatesRefreshButton = $("#candidates-refresh");
}

Layout.prototype.addDialog = function () {
	$("#dialog-confirm").dialog({
		resizable: false,
		autoOpen: false,
		height: "auto",
		width: 500,
		modal: true,
		draggable: false,
		buttons: {
			"Save and Move Forward": function () {
				Paras.layout.submit();
				$(this).dialog("close");
			},
			"Do NOT save and Next": function () {
				Paras.redirect(Apollo.task + 1);
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		}
	});
	$("#dialog-saved").dialog({
		modal: true,
		autoOpen: false,
		width: 500,
		draggable: false,
		buttons: {
			"OK And Next": function () {
				Paras.redirect(Apollo.task + 1);
				$(this).dialog("close");
			},
			"OK": function () {
				$(this).dialog("close");
			}
		}
	});
	$("#dialog-success").dialog({
		modal: true,
		autoOpen: false,
		width: 500,
		draggable: false,
		buttons: {
			"Move forward": function () {
				Paras.redirect(Apollo.task + 1);
				$(this).dialog("close");
			}
		}
	});
	$("#dialog-history").dialog({
		modal: true,
		autoOpen: false,
		width: 1200,
		draggable: false,
		buttons: {
			"Load": function () {
				Paras.isLoading = true;
				Paras.layout.load(Apollo.history);
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		}
	});
	$("#dialog-fail,#dialog-insuffucient,#dialog-loading").dialog({
		modal: true,
		autoOpen: false,
		width: 500,
		draggable: false,
		buttons: {
			Ok: function () {
				$(this).dialog("close");
			}
		}
	});
}

Layout.prototype.newImage = function (oid, category, src) {
	src = src.toLowerCase();
	var item = new Item(oid, category, src, Paras.items.length);
	Paras.items.push(item);

	Paras.currentOid = item.oid;
	this.canvas.append(item.generateDiv());
	item.attachControllers();
	Paras.updateItems();
	this.activeRotateResize();

	item.get().simulate('drag', {
		dx: Math.random() * 550,
		dy: Math.random() * 550
	});

	this.updateLayers();
	Paras.hasChanged = true;
}

// third, save the debug modes
Layout.prototype.submit3 = function () {
	Paras.layout.showReferenceBackground(false);
	$('.box').show();

	html2canvas(document.querySelector("#canvas")).then(canvas => {
		var resizedCanvas = document.createElement("canvas");
		var resizedContext = resizedCanvas.getContext("2d");
		resizedCanvas.height = "200";
		resizedCanvas.width = "200";
		var context = canvas.getContext("2d");
		resizedContext.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

		var postData = {
			task: Apollo.task,
			save: 3,
			suffix: Apollo.suffix,
			img_val: resizedCanvas.toDataURL("image/png")
		};
		$.ajax({
			type: "POST",
			url: Apollo.baseUrl,
			data: postData,
			success: function (data, status, jqXHR) {
				
			var d = new Date();
				$("#saved-pic").html('<img class="hisimg" src="' + Apollo.baseUrl + 'results1/' + Apollo.task + '.png'
				+ '?ts=' + d.toLocaleTimeString().replaceAll(":", "_") + '"/>');
				$("#dialog-saved").dialog("open");
				Paras.redirectNextIfSaving();
				Paras.hasChanged = false;
				Paras.isSaving = false;
			},
			error: function (data, status, jqXHR) {
				debug("Submit3", "Fail with " + data);
				$("#saved-pic").html('<img class="hisimg" src="' + Apollo.baseUrl + 'results1/' + Apollo.task + '.png'
				+ '?ts=' + d.toLocaleTimeString().replaceAll(":", "_") + '"/>');
				$("#dialog-saved").dialog("open");
				Paras.redirectNextIfSaving();
				Paras.hasChanged = false;
				Paras.isSaving = false;
			},
		});
	});
}

// second, save the strokes, only the strokes
Layout.prototype.submit2 = function () {
	this.hideReferenceBackground(false);
	$('.box').hide();

	html2canvas(document.querySelector("#canvas")).then(canvas => {
		var postData = {
			task: Apollo.task,
			save: 2,
			suffix: Apollo.suffix,
			img_val: canvas.toDataURL("image/png")
		};
		$.ajax({
			type: "POST",
			url: Apollo.baseUrl,
			data: postData,
			success: function (data, status, jqXHR) {
				Paras.layout.submit3();
			},
			error: function (data, status, jqXHR) {
				debug("Submit2", "Fail with " + data);
				$("#dialog-fail").dialog("open");
			},
		});
	});
}

// first save the most important thing: the json and sketches
Layout.prototype.submit = function () {
	$(".ui-rotatable-handle").hide();
	$(".ui-resizable-handle").hide();
	this.hideReferenceBackground(false);

	Paras.updateItems();

	var d = new Date();
	Apollo.suffix = d.toLocaleDateString().replaceAll("/", "_") + "_" + d.toLocaleTimeString().replaceAll(":", "_").replaceAll(" ", "");

	html2canvas(document.querySelector("#canvas")).then(canvas => {
		var postData = {
			task: Apollo.task,
			save: 1,
			suffix: Apollo.suffix,
			json: JSON.stringify(Paras.items),
			xml: Paras.signaturePad.toDataURL('image/svg+xml'),
			img_val: canvas.toDataURL("image/png")
		};
		$.ajax({
			type: "POST",
			url: Apollo.baseUrl,
			data: postData,
			success: function (data, status, jqXHR) {
				Paras.layout.submit2();
			},
			error: function (data, status, jqXHR) {
				debug("Submit1", "Fail with " + data);
				$("#dialog-fail").dialog("open");
			},
		});
	});
};

Layout.prototype.load = function (_task = -1) {
	this.reset();
	this.showReferenceBackground(true);
	var _backup = 0;

	if (_task == -1) {
		_task = Apollo.task;
		Apollo.backup = null;
	} else {
		_backup = 1;
		Apollo.backup = _task;
	}

	var postData = {
		load: 1,
		task: _task,
		backup: _backup
	};
	$.ajax({
		type: "POST",
		url: Apollo.baseUrl,
		data: postData,
		success: function (data, status, jqXHR) {
			Paras.hasChanged = false;
			if (data === "0")
				return;
			var list = JSON.parse(data);
			if (list.length == 0)
				return;

			Paras.hasChanged = true;
			for (const obj of list) {
				Paras.items.push(new Item(0, 0, 0, 0, obj));
			}

			for (let item of Paras.items) {
				Paras.layout.canvas.append(item.generateDiv());
				++Paras.categoryCounts[item.category];
				Paras.categoryGeneratedInstances[item.category] =
					Math.max(parseInt(item.oid.substr(item.category.length)), Paras.categoryGeneratedInstances[item.category]);
				item.layout();
				item.attachControllers();
			}
			Paras.layout.activeRotateResize();
			for (let item of Paras.items) {
				item.get().trigger('click');
			}
			Paras.updateItems();

			var img = new Image;
			img.onload = function () {
				var modified = false;
				if (img.width != 750) {
					console.log("resize the image");
					Paras.ipad.width = img.width;
					Paras.ipad.height = img.height;
				}
				Paras.ctx.drawImage(img, 0, 0);
				var pixels = Paras.ctx.getImageData(0, 0, img.width, img.height);
				for (var i = 0, len = pixels.data.length; i < len; i += 4) {
					var r = pixels.data[i],
					g = pixels.data[i + 1],
					b = pixels.data[i + 2];
					if (r >= 255 && g >= 255 && b >= 255) {
						pixels.data[i + 3] = 0;
					} else {
						modified = true;
					}
				}
				Paras.ctx.putImageData(pixels, 0, 0);
				if (img.width != 750) {
					HERMITE.resample_single(Paras.ipad, 750, 750, true);
				}
				if (modified) {
					++Paras.categoryCounts["road"];
				}
			};
			var d = new Date();
			if (Apollo.backup !== null) {
				img.src = Apollo.baseUrl + "backup2/" + Apollo.backup + ".png";
			} else {
				img.src = Apollo.baseUrl + "results2/" + Apollo.task + ".png" + "?ts=" + d.toLocaleTimeString().replaceAll(":", "_");
			}
			$(".ui-rotatable-handle").hide();
			$(".ui-resizable-handle").hide();
			Paras.layout.updateLayers();
			Paras.hasChanged = false;
		},
		error: function (data, status, jqXHR) {
			if (Paras.isLoading) {
				$("#dialog-fail").dialog("open");
			}
		},
	});
	$('.box').show();
}
Layout.prototype.activeHistoryPics = function () {
	$(".hisimg").click(function () {
		$(".hisimg").removeClass("selected");
		$(this).addClass("selected");
		Apollo.history = $(this).attr("his");
		$("#hispan").html(Apollo.history);
	});
}

Layout.prototype.history = function () {
	var postData = {
		history: Apollo.task,
	};
	$.ajax({
		type: "GET",
		url: Apollo.baseUrl,
		data: postData,
		success: function (data, status, jqXHR) {
			if (data === "0")
				return;
			console.log(data);
			var list = JSON.parse(data);
			if (list.length == 0)
				return;
			var html = "";

			for (const obj of list) {
				console.log(obj);
				html += '<div class="hispics">' +
				'<img class="hisimg" his="' +
				obj
				 + '" src="' +
				Apollo.baseUrl + 'backup1/' + obj + '.png"/></div>'
			}

			Paras.layout.historyPics.html(html);
			Paras.layout.activeHistoryPics();
			$("#dialog-history").dialog("open");
		},
		error: function (data, status, jqXHR) {
			if (Paras.isLoading) {
				$("#dialog-fail").dialog("open");
			}
		},
	});
}

Layout.prototype.addButtonEvents = function () {
	this.nextbtn.click(function () {
		if (!Paras.hasChanged) {
			return Paras.redirect(Apollo.task + 1);
		}
		if (!Paras.allowSave()) {
			$("#dialog-insuffucient").dialog("open");
		} else {
			Paras.isSaving = false;
			$("#dialog-confirm").dialog("open");
		}
	});

	this.previousbtn.click(function () {
		Paras.redirect(Apollo.task - 1);
	});

	this.savebtn.click(function () {
		if (!Paras.allowSave()) {
			$("#dialog-insuffucient").dialog("open");
		} else {
			if (Paras.isSaving) return;
			Paras.isSaving = true;
			Paras.layout.submit();
		}
	});

	this.loadbtn.click(function () {
		//Paras.isLoading = true;
		//Paras.layout.load();
		Paras.layout.history();
	});

	this.candidatesRefreshButton.click(function () {
		Paras.layout.updateCandidates(Paras.layout.subjects.val());
	});

	this.selectRoadButton.click(function () {
		Paras.layout.subjects.val("road").selectmenu("refresh");
		Paras.layout.updateCandidates("road");
	});

	this.selectRoadButton.dblclick(function () {
		Paras.layout.subjects.val("others").selectmenu("refresh");
		Paras.layout.updateCandidates("others");
	});

	this.reference.click(function () {
		if ($(this).hasClass("todo")) {
			$(this).addClass("done");
			$(this).removeClass("todo");
			$(".ui-rotatable-handle").show();
			$(".ui-resizable-handle").show();
			Paras.layout.showReferenceBackground();
		} else {
			$(this).addClass("todo");
			$(this).removeClass("done");
			$(".ui-rotatable-handle").hide();
			$(".ui-resizable-handle").hide();
			Paras.layout.hideReferenceBackground();
		}
	});

	$("#check").click(function () {
		var item = Paras.getCurrentItem();
		if (item == null)
			return;
		item.toggleChecked();
	});

	this.penbtn.click(function () {
		if ($(this).hasClass("todo")) {
			Paras.layout.enablePen();
		} else {
			Paras.layout.disablePad();
		}
	});

	this.eraserbtn.click(function () {
		if ($(this).hasClass("todo")) {
			Paras.layout.enableEraser();
		} else {
			Paras.layout.disablePad();
		}
	});

	this.flipbtn.click(function () {
		var item = Paras.getCurrentItem();
		if (item === null)
			return;
		item.flip();
	});

	this.removebtn.click(function () {
		var found = Paras.getCurrentItemId();
		if (found < 0)
			return;
		--Paras.categoryCounts[Paras.items[found].category];
		Paras.items.splice(found, 1);
		$("#" + Paras.currentOid).remove();
		Paras.updateItems();
		Paras.hasChanged = true;
	});

	this.resetbtn.click(function () {
		Paras.layout.clearCanvas();
	});

	this.moveupbtn.click(function () {
		var id = Paras.getCurrentItemId();
		Paras.swapItems(id, id + 1);
		Paras.layout.updateLayers();
		Paras.hasChanged = true;
	});

	this.movedownbtn.click(function () {
		var id = Paras.getCurrentItemId();
		Paras.swapItems(id, id - 1);
		Paras.layout.updateLayers();
		Paras.hasChanged = true;
	});
}

Layout.prototype.reset = function () {
	this.clearCanvas();
	var n = Paras.items.length;
	for (var i = 0; i < n; ++i) {
		Paras.currentOid = Paras.items[0].oid;
		$("#remove").trigger("click");
	}
};

Layout.prototype.clearCanvas = function () {
	Paras.signaturePad.clear();
	Paras.hasChanged = true;
};

Layout.prototype.setAnchorPosition = function (oid, width, height) {
	$('#' + oid + "-resizable-n").css('left', (width / 2 - 4) + 'px');
	$('#' + oid + "-resizable-e").css('top', (height / 2 - 4) + 'px');
	$('#' + oid + "-resizable-s").css('left', (width / 2 - 4) + 'px');
	$('#' + oid + "-resizable-w").css('top', (height / 2 - 4) + 'px');
};

Layout.prototype.setCurrentAnchor = function () {
	this.setAnchorPosition(Paras.currentOid, Paras.getCurrentItem().get().css("width"), Paras.getCurrentItem().get().css("height"));
};

Layout.prototype.setPosition = function (width, height) {
	$('.ui-resizable-n').css('left', (width / 2 - 4) + 'px');
	$('.ui-resizable-e').css('top', (height / 2 - 4) + 'px');
	$('.ui-resizable-s').css('left', (width / 2 - 4) + 'px');
	$('.ui-resizable-w').css('top', (height / 2 - 4) + 'px');
};

Layout.prototype.disablePad = function () {
	this.penbtn.addClass("todo");
	this.penbtn.removeClass("done");
	this.eraserbtn.addClass("todo");
	this.eraserbtn.removeClass("done");

	Paras.penOn = false;
	Paras.eraserOn = false;

	this.ipadcanvs.removeClass("penpad");
	this.ipadcanvs.removeClass("eraserpad");

	Paras.signaturePad.enabled = false;

	Paras.ctx.globalCompositeOperation = 'source-over';
}

Layout.prototype.enablePen = function () {
	this.penbtn.removeClass("todo");
	this.penbtn.addClass("done");
	this.eraserbtn.addClass("todo");
	this.eraserbtn.removeClass("done");

	Paras.penOn = true;
	Paras.eraserOn = false;

	this.ipadcanvs.addClass("penpad");
	this.ipadcanvs.removeClass("eraserpad");

	Paras.signaturePad.enabled = true;
	Paras.signaturePad.minWidth = 1.5;
	Paras.signaturePad.maxWidth = 2.5;
	Paras.hasChanged = true;
	Paras.ctx.globalCompositeOperation = 'source-over';
}

Layout.prototype.enableEraser = function () {
	this.eraserbtn.removeClass("todo");
	this.eraserbtn.addClass("done");
	this.penbtn.addClass("todo");
	this.penbtn.removeClass("done");

	Paras.eraserOn = true;
	Paras.penOn = true;

	this.ipadcanvs.addClass("eraserpad");
	this.ipadcanvs.removeClass("penpad");

	Paras.signaturePad.enabled = true;
	Paras.signaturePad.minWidth = 5;
	Paras.signaturePad.maxWidth = 5;
	Paras.hasChanged = true;

	Paras.ctx.globalCompositeOperation = 'destination-out';
}

Layout.prototype.activeRotateResize = function () {
	$(".box").click(function (event, ui) {
		Paras.layout.selectOid($(this).attr("id"));
		var width = $(event.target).width();
		var height = $(event.target).height();
		Paras.layout.setAnchorPosition(Paras.currentOid, width, height);
	});

	$(".box").draggable({
		grid: [10, 10],
		cancel: ".ui-rotatable-handle",
		containment: "#rightwards",
		drag: function (event, ui) {
			var width = $(event.target).width();
			var height = $(event.target).height();
			Paras.layout.setAnchorPosition(Paras.currentOid, width, height);
			Paras.hasChanged = true;
		},
		start: function (event, ui) {
			Paras.layout.selectOid($(this).attr("id"));
		}
	});

	$(".box").resizable({
		handles: {
			'n': '.ui-resizable-n',
			'e': '.ui-resizable-e',
			's': '.ui-resizable-s',
			'w': '.ui-resizable-w',
			'ne': '.ui-resizable-ne',
			'se': '.ui-resizable-se',
			'sw': '.ui-resizable-sw',
			'nw': '.ui-resizable-nw'
		},
		grid: [10, 10],
		//helper: "ui-resizable-helper",
		create: function (event, ui) {
			Paras.layout.selectOid($(this).attr("id"));
		},
		resize: function (event, ui) {
			Paras.layout.selectOid($(this).attr("id"));
			var width = $(event.target).width();
			var height = $(event.target).height();
			Paras.layout.setAnchorPosition(Paras.currentOid, width, height);
			Paras.hasChanged = true;
		}
	}).rotatable({
		// Callback fired on rotation start.
		start: function (event, ui) {
			Paras.currentOid = ui.element.attr("id");
		},
		// Callback fired during rotation.
		rotate: function (event, ui) {},
		// Callback fired on rotation end.
		stop: function (event, ui) {
			Paras.currentOid = ui.element.attr("id");
		},
	});

	for (let item of Paras.items) {
		var rotateJid = item.getJid() + " div[class*='ui-rotatable-handle-']";
		$(rotateJid).bind("mousedown", function (e) {
			$(item.getJid()).rotatable("instance").startRotate(e);
		});
	}
}

Layout.prototype.addCandidates = function () {
	for (var i = 0; i < Paras.numCandidates; ++i) {
		this.candidatesContainer.append("<div class='candidate' id='candidate" + i + "'></div>");
	}
}

// update the candidates images with the given category
Layout.prototype.updateCandidates = function (category) {
	this.candidatesContainer.hide();
	this.candidatesNotFoundMessage.hide();
	Paras.signaturePad.penColor = Paras.cateColors[category];
	if (category == "road")
		++Paras.categoryCounts["road"];

	if ($.inArray(category, Paras.missingCates) >= 0) {
		this.candidatesNotFoundMessage.show();
		Paras.layout.enablePen();
		Paras.hasChanged = true;
		return;
	} else {
		Paras.layout.disablePad();
	}
	var postData = {
		query: category
	};
	$.ajax({
		type: "POST",
		url: Apollo.baseUrl,
		data: postData,
		success: function (data, status, jqXHR) {
			Paras.layout.candidatesContainer.slideDown();
			data = JSON.parse(data);
			for (var i = 0; i < Paras.numCandidates; ++i) {
				$("#candidate" + i).css({
					"background-image": "url('" + Paras.candidatesFolder + data[i] + "')",
					"background-size": "100% 100%",
					"width": Paras.layout.panelWidth / 4.4,
					"height": Paras.layout.panelWidth / 4.4,
				});
				$("#candidate" + i).attr('category', category.replaceAll(" ", "_"));
				$("#candidate" + i).attr('src', Paras.candidatesFolder + data[i]);
			}
		}
	});
}

Layout.prototype.updateLayers = function () {
	this.layers.html("");
	for (var i = 0; i < Paras.items.length; ++i) {
		this.layers.append("<option>" + Paras.items[i].oid + "</option>");
	}
	this.layers.val(Paras.currentOid).selectmenu("refresh");
	this.setCurrentAnchor();
}

Layout.prototype.selectOid = function (oid) {
	Paras.currentOid = oid;
	this.layers.val(oid).selectmenu("refresh");
	$(".ui-rotatable-handle").hide();
	$(".ui-resizable-handle").hide();
	$('#' + Paras.currentOid + '> .ui-rotatable-handle').show();
	$('#' + Paras.currentOid + '> .ui-resizable-handle').show();
	Paras.getCurrentItem().updateCheckButton();
	Paras.layout.disablePad();
	this.setCurrentAnchor();
}

Layout.prototype.addSceneKeywords = function () {
	// -- todo: remove the tasks --
	Paras.keywords = Apollo.scene.split(",");
	for (var i = 0; i < Paras.keywords.length; ++i) {
		var word = Paras.keywords[i];
		$("#tasks").append(
			'<button class="tbutton task todo" id="task-' +
			i +
			'">' +
			word.trim() +
			'</button>');
	}

	for (const category of Paras.allCategories) {
		this.subjects.append("<option>" + category + "</option>");
		var cate = category.replaceAll(" ", "_");
		Paras.categoryCounts[cate] = 0;
		Paras.categoryGeneratedInstances[cate] = 0;
	}

	this.subjects.selectmenu({
		change: function (event, data) {
			Paras.layout.updateCandidates(data.item.value);
		}
	});

	this.layers.selectmenu({
		change: function (event, data) {
			Paras.layout.selectOid(data.item.value);
		}
	});

	$('.task').click(function () {
		$('.task').removeClass("doing");
		$(this).addClass("doing");
		Paras.layout.subjects.val($(this).html()).selectmenu("refresh");
		Paras.layout.updateCandidates($(this).html());
	});

	// trigger the click event of the first task
	$('#task-0').trigger("click");

	$('.candidate').click(function () {
		var src = $(this).attr('src');
		var category = $(this).attr('category');
		++Paras.categoryCounts[category];
		++Paras.categoryGeneratedInstances[category];
		Paras.layout.newImage(category + Paras.categoryGeneratedInstances[category], category, src);
	});
}

Layout.prototype.showReferenceBackground = function (border = true) {
	this.canvas.addClass("reference-on");
	var rootFolder = Apollo.publicUrl + 'images/references/';

	this.canvas.css({
		"background-image": "url(" + rootFolder + Apollo.reference + ")",
		"background-size": "100% 100%",
	});
	if (border) {
		this.canvas.addClass("with-order");
	} else {
		this.canvas.removeClass("with-order");
	}
	$(".ui-rotatable-handle").hide();
	$(".ui-resizable-handle").hide();
}

Layout.prototype.hideReferenceBackground = function (border = true) {
	this.canvas.removeClass("reference-on");

	if (border) {
		this.canvas.addClass("with-order");
	} else {
		this.canvas.removeClass("with-order");
	}
	this.canvas.css("background", "none");
	$(".ui-rotatable-handle").hide();
	$(".ui-resizable-handle").hide();
}

Layout.prototype.toggleReferenceBackground = function () {
	$("#canvas").click(function () {
		if ($("#canvas").hasClass("reference-on")) {
			Paras.layout.hideReferenceBackground();
		} else {
			Paras.layout.showReferenceBackground();
		}
	});
}

Paras.layout = new Layout();
