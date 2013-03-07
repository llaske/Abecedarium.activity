// Moveable item
enyo.kind({
	name: "Abcd.Item",
	kind: enyo.Control,
	published: { x: 0, y: 0, z: 0 },
	
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
		this.applyStyle("margin-left", this.x+"px");
	},
	
	// Coordinate setup
	yChanged: function() {
		this.applyStyle("margin-top", this.y+"px");
	},
	
	// Coordinate setup
	zChanged: function() {
		this.applyStyle("z-index", this.z);
	},
	
	// Change position
	moveTo: function(x, y) {
		this.x = x;
		this.xChanged();
		this.y = y;
		this.yChanged();
	}
});