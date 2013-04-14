

// Filter popup
enyo.kind({
	name: "Abcd.FilterPopup",
	kind: "onyx.Popup",
	classes: "filter-popup",
	centered: true,
	modal: true,
	floating: true, 
	published: {
		filter: null,
	},
	events: {
		onFilterChanged: ""
	},	
	components: [
		{name: "box", classes: "filterBox", components: [
		]},
		{name: "trash", kind: "Image", src: "images/trashcan.png", classes: "trashButton", ontap: "trashTaped"},		
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.filterChanged();
	},
	
	rendered: function() {
		// Delete all
		var items = [];
		enyo.forEach(this.$.box.getControls(), function(item) {
			items.push(item);
		});		
		for (var i = 0 ; i < items.length ; i++) {
			items[i].destroy();
		}	
		
		// Display themes
		var length = Abcd.themes.length;
		for (var i = 0 ; i < length ; i++) {
			this.$.box.createComponent(
				{ kind: "Abcd.Theme", index: i, ontap: "displayCollections" },
				{ owner: this }
			).render();
		}	
		
		// Display letters
		for (var i = 0 ; i < 26 ; i++) {
			var letter = String.fromCharCode(65+i).toLowerCase();
			this.$.box.createComponent(
				{ kind: "Abcd.Letter", letter: letter,
				  selected: (this.filter != null&&this.filter.letter == letter), ontap: "filterOnLetter" },
				{ owner: this }
			).render();			
		}
	},
	
	filterChanged: function() {
		this.render();
	},
	
	// Trash taped, remove filter
	trashTaped: function() {
		this.hide();
		this.filter = null;
		this.doFilterChanged();
	},
	
	// Tap on a letter, filter on this letter
	filterOnLetter: function(l, e) {
		if (!Abcd.letters.hasOwnProperty(l.letter) || Abcd.letters[l.letter].length < 3)
			return;
		this.hide();
		this.filter = l;
		this.doFilterChanged();
	}
});