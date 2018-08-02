'use strict';
$(document).ready(function () {
	for (var i = 1; i <= Apollo.total; ++i) {
		if ($.inArray(i, Apollo.list) >= 0) {
			$("#markers").append("<div class='marker green' task='" + i + "'> </div>");
		} else
			if ($.inArray(i, Apollo.old_list) >= 0) {
				$("#markers").append("<div class='marker yellow' task='" + i + "'> </div>");
			} else {
				$("#markers").append("<div class='marker red' task='" + i + "'> </div>");
			}
	}

	$(".marker").click(function () {
		var task = $(this).attr("task");
		window.open(Apollo.baseUrl + "?task=" + task);
	});

	$(".green").hover(function () {
		var task = $(this).attr("task");
		$("#demo").attr("src", Apollo.baseUrl + "results1/" + task + ".png");
		$("#cid").html(task);
	});

	$(".red").hover(function () {
		var task = $(this).attr("task");
		$("#cid").html(task);
	});

	$(".yellow").hover(function () {
		var task = $(this).attr("task");
		$("#demo").attr("src", Apollo.baseUrl + "results1_old/" + task + ".png");
		$("#cid").html(task);
	});
});
