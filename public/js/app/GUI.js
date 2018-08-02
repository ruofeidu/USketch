var GUI = new dat.GUI();
GUI.start = function() {
	var c = GUI.addFolder('Visibility');
	c.add(App.models.hull, 'visible').name('hull');
	c.add(App.models.panel, 'visible').name('panel');
	c.add(App.models.graffiti, 'visible').name('graffiti');
	c.add(App.models.seats, 'visible').name('seats');
	
	c.open();
}