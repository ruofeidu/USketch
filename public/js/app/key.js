'use strict';

Mousetrap.bind(['backspace', 'del'], function () {
	$("#remove").trigger("click");
}, 'keyup');

Mousetrap.bind(['backspace', 'del'], function () {
	$("#remove").trigger("click");
}, 'keyup');

Mousetrap.bind(['pageup', '-'], function () {
	$("#moveup").trigger("click");
}, 'keyup');

Mousetrap.bind(['pagedown', '='], function () {
	$("#movedown").trigger("click");
}, 'keyup');

Mousetrap.bind('1', function () {
	$("#task-0").trigger("click");
}, 'keyup');

Mousetrap.bind('2', function () {
	$("#task-1").trigger("click");
}, 'keyup');

Mousetrap.bind('3', function () {
	$("#task-2").trigger("click");
}, 'keyup');

Mousetrap.bind('4', function () {
	$("#task-3").trigger("click");
}, 'keyup');

Mousetrap.bind('5', function () {
	$("#task-4").trigger("click");
}, 'keyup');

Mousetrap.bind('6', function () {
	$("#task-5").trigger("click");
}, 'keyup');

Mousetrap.bind('7', function () {
	$("#task-6").trigger("click");
}, 'keyup');

Mousetrap.bind('8', function () {
	$("#task-7").trigger("click");
}, 'keyup');

Mousetrap.bind('9', function () {
	$("#task-8").trigger("click");
}, 'keyup');

Mousetrap.bind('0', function () {
	$("#task-9").trigger("click");
}, 'keyup');

Mousetrap.bind(['shift+backspace', 'shift+del'], function () {
	$("#reset").trigger("click");
}, 'keyup');

Mousetrap.bind('shift+s', function () {
	$("#save").trigger("click");
}, 'keyup');

Mousetrap.bind('shift+l', function () {
	$("#load").trigger("click");
}, 'keyup');

Mousetrap.bind('shift+z', function () {
	$("#undo").trigger("click");
}, 'keyup');

Mousetrap.bind('ctrl+enter', function () {
	$("#next").trigger("click");
}, 'keyup');

Mousetrap.bind(['/', '\\'], function () {
	$("#flipo").trigger("click");
}, 'keyup');

Mousetrap.bind('enter', function () {
	$("#candidates-refresh").trigger("click");
}, 'keyup');

Mousetrap.bind('tab', function () {
	$("#eraser").trigger("click");
}, 'keyup');

Mousetrap.bind('`', function () {
	$("#pen").trigger("click");
}, 'keyup');

Mousetrap.bind('space', function () {
	$("#check").trigger("click");
}, 'keyup');

Mousetrap.bind('capslock', function () {
	$("#reference").trigger("click");
}, 'keyup');


Mousetrap.bind('alt+q', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate0").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+w', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate1").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+e', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate2").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+r', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate3").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+a', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate4").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+s', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate5").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+d', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate6").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+f', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate7").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+z', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate8").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+x', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate9").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+c', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate10").trigger("click");
	}
}, 'keyup');

Mousetrap.bind('alt+v', function () {
	if ($("#candidates-container").is(":visible")) { 
		$("#candidate11").trigger("click");
	}
}, 'keyup');
