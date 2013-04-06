// Moveable item
enyo.kind({
	name: "Abcd.Item",
	kind: enyo.Control,
	published: { x: -1, y: -1, z: -1 },
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.xChanged();
		this.yChanged();
		this.zChanged();
	},
	
	// Localization changed, update 
	setLocale: function() {
		this.render();
	},
	
	// Coordinate setup
	xChanged: function() {
		if (this.x != -1) this.applyStyle("margin-left", this.x+"px");
	},
	
	// Coordinate setup
	yChanged: function() {
		if (this.y != -1) this.applyStyle("margin-top", this.y+"px");
	},
	
	// Coordinate setup
	zChanged: function() {	
		if (this.z != -1) this.applyStyle("z-index", this.z);
	},
	
	// Change position
	moveTo: function(x, y) {
		this.x = x;
		this.xChanged();
		this.y = y;
		this.yChanged();
	}
});