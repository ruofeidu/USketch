'use strict';

function onWindowResize() {
	App.camera.aspect = window.innerWidth / window.innerHeight;
	if (Paras.control.enableOrth) {
		App.cameraOrtho.left = - window.innerWidth / 2;
		App.cameraOrtho.right = window.innerWidth / 2;
		App.cameraOrtho.top = window.innerHeight / 2;
		App.cameraOrtho.bottom = - window.innerHeight / 2;
		App.cameraOrtho.updateProjectionMatrix();
	}
	App.camera.updateProjectionMatrix();
	App.renderer.setSize( window.innerWidth, window.innerHeight );
	if (vvr.effect) vvr.effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	var delta = App.clock.getDelta();
	requestAnimationFrame( animate );
	App.stats.begin(); 
	render( delta );
	App.stats.end(); 
	// if (Paras.debugMode) stats.update();
}

function render( delta ) {
	if (vvr.controls) {
		vvr.controls.update();
	}
	
	if (Paras.control.inited) App.control.update(); 
	
	App.renderer.clear();
	
	App.sphere.updateUniforms(); 
	
	if (vvr.isEnabled()) {
		vvr.effect.render(App.scene, vrcam);
	} else {
		App.cameraManager.updatePosition( App.objects ); 
		//Paras.camera.update(); 
		//App.camera.lookAt( Paras.camera.target );
		
		App.renderer.render(App.scene, App.camera); 
	}

}
