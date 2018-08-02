'use strict';
$(document).ready(function () {
	// add tool tips
	console.log("Admin has been initialized.");
});

$(document).tooltip();

$(".hi").mouseover(function () {
	var task = $(this).attr("task");
	$(this).attr("src", Apollo.baseUrl + "results2/" + task + ".png");
});

$(".hi").mouseout(function () {
	var task = $(this).attr("task");
	$(this).attr("src", Apollo.baseUrl + "results1/" + task + ".png");
});
