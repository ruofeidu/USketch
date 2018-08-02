'use strict';
/**
 * Initialization of all components
 * @author Ruofei Du
 */
function addCanvas() {
	var canvas = document.getElementById('ipad');
	Paras.ctx = canvas.getContext('2d');
	Paras.ipad = canvas;
	function resizeCanvas() {}
	window.onresize = resizeCanvas;
	resizeCanvas();
	Paras.signaturePad = new SignaturePad(canvas);
	document.getElementById('undo').addEventListener('click', function () {
		var data = Paras.signaturePad.toData();
		if (data) {
			data.pop(); // remove the last dot or line
			Paras.signaturePad.fromData(data);
		}
	});
}

$(document).ready(function () {
	addCanvas();
	App.container = document.getElementById("apollo");
	App.canvas = document.getElementById("canvas");

	Paras.layout.init(); 
	Paras.layout.addDialog(); 
	// add events
	Paras.layout.addButtonEvents();

	// add UI candidates
	Paras.layout.addCandidates();
	Paras.layout.addSceneKeywords();
	Paras.layout.showReferenceBackground(); 

	$(document).tooltip();
	$("#tasks").hide(); 
	
	Paras.layout.load();
	
	debug("Init", "Create has been initialized.");
});
