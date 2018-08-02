'use strict';

/**
 * Mouse and touch events attached to the global App class
 * @author Ruofei Du
 */

var MouseClass = function(){
	this.isUserInteracting			=	false; 
	this.isUserInteractingTime		=	Date.now();
	this.onPointerDownPointerY		=	0;
	this.onPointerDownPointerX		=	0;
	this.onPointerLon				=	0;
	this.onPointerLat				=	0;
	this.coord						=	{x:0, y:0};
}

App.mouse = new MouseClass();
App.events.containerEventsInited	=	false; 
 
App.initContainerEvents = function() {
	if (this.events.containerEventsInited) return; 
	this.events.containerEventsInited = true; 
	
	this.events.onContainerMouseDown	= this.onContainerMouseDown.bind(this);
	this.events.onContainerMouseMove	= this.onContainerMouseMove.bind(this);
	this.events.onContainerMouseUp		= this.onContainerMouseUp.bind(this);
	this.events.onContainerMouseWheel	= this.onContainerMouseWheel.bind(this);
	this.events.onContainerTouchStart	= this.onContainerTouchStart.bind(this);
	this.events.onContainerTouchEnd		= this.onContainerTouchEnd.bind(this);
	this.events.onContainerTouchMove	= this.onContainerTouchMove.bind(this);

	this.container.addEventListener( 'mousedown',	this.events.onContainerMouseDown, false );
	this.container.addEventListener( 'mousemove',	this.events.onContainerMouseMove, false );
	this.container.addEventListener( 'mouseup',		this.events.onContainerMouseUp, false );
	this.container.addEventListener( 'mousewheel',	this.events.onContainerMouseWheel, false );
	this.container.addEventListener( 'touchstart',	this.events.onContainerTouchStart, false );
	this.container.addEventListener( 'touchend',	this.events.onContainerTouchEnd, false );
	this.container.addEventListener( 'touchmove',	this.events.onContainerTouchMove, false );
}

App.removeContainerEvents = function() {
	this.events.containerEventsInited = false; 
	this.container.removeEventListener( 'mousedown', this.onContainerMouseDown );
	this.container.removeEventListener( 'mousemove', this.onContainerMouseMove );
	this.container.removeEventListener( 'mouseup', this.onContainerMouseUp );
	this.container.removeEventListener( 'mousewheel', this.onContainerMouseWheel );
	this.container.removeEventListener( 'touchstart', this.onContainerTouchStart );
	this.container.removeEventListener( 'touchend', this.onContainerTouchEnd );
	this.container.removeEventListener( 'touchmove', this.onContainerTouchMove );
}

App.onContainerMouseDown = function( event ) {
	event.preventDefault();
	this.mouse.isUserInteracting = true;
	this.mouse.isUserInteractingTime = Date.now();
	this.mouse.onPointerDownPointerY = event.clientY;
	this.mouse.onPointerDownPointerX = event.clientX;
	this.mouse.onPointerDownLon = Paras.camera.lon;
	this.mouse.onPointerDownLat = Paras.camera.lat;
	this.mouse.coord.x =   ( event.clientX / window.innerWidth  ) * 2 - 1;
	this.mouse.coord.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

App.onContainerMouseMove = function( event ) {
	event.preventDefault();
	if ( this.mouse.isUserInteracting ) {
		Paras.camera.lon = ( this.mouse.onPointerDownPointerX - event.clientX ) * 0.1 + this.mouse.onPointerDownLon;
		Paras.camera.lat = ( event.clientY - this.mouse.onPointerDownPointerY ) * 0.1 + this.mouse.onPointerDownLat;
	}
	this.mouse.coord.x =   ( event.clientX / window.innerWidth  ) * 2 - 1;
	this.mouse.coord.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	this.onSceneMouseMove();
}


App.onContainerMouseUp = function( event ) {
	this.mouse.isUserInteracting = false;
	if (Date.now() - this.mouse.isUserInteractingTime < 300 ) {
		this.onSceneClick();
	}
}

App.onContainerMouseWheel = function( event ) {
	this.camera.fov -= event.wheelDeltaY * 0.05;
	this.camera.fov = Math.min(120, Math.max(10, this.camera.fov));
	this.camera.updateProjectionMatrix();
}


App.onContainerTouchStart = function( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		this.mouse.isUserInteracting = true;
		this.mouse.isUserInteractingTime = Date.now();
		this.mouse.onPointerDownPointerY = event.touches[ 0 ].pageY;
		this.mouse.onPointerDownPointerX = event.touches[ 0 ].pageX;
		this.mouse.onPointerDownLon = Paras.camera.lon;
		this.mouse.onPointerDownLat = Paras.camera.lat;
		this.mouse.coord.x =   ( event.touches[0].pageX / window.innerWidth  ) * 2 - 1;
		this.mouse.coord.y = - ( event.touches[0].pageY / window.innerHeight ) * 2 + 1;
	}
}

App.onContainerTouchEnd = function( event ){
	this.isUserInteracting = false;
	if( Date.now()- this.mouse.isUserInteractingTime  < 300 ) {
		this.onSceneClick();
	}
}

App.onContainerTouchMove = function( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		Paras.camera.lon = ( this.onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + this.onPointerDownLon;
		Paras.camera.lat = ( event.touches[0].pageY - this.onPointerDownPointerY ) * 0.1 + this.onPointerDownLat;
		this.mouse.coord.x =   ( event.touches[0].pageX / window.innerWidth ) * 2 - 1;
		this.mouse.coord.y = - ( event.touches[0].pageY / window.innerHeight ) * 2 + 1;
	}
}

App.onSceneMouseMove = function() {
	
}


App.onSceneClick = function(){
	
}
