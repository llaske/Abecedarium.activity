﻿

// Collections size on the screen
var viewConst = {
	themes: { x: 20, y: 50, dx: 260},
	letters: { x: 50, y: 330, dx: 80, dy: 80, line: 12},
	collections: { x: 20, y: 50, dx: 260, dy: 100, line: 4},
	entries: { x: 70, y: 50, dx: 260, dy: 250, line: 4, screen: 8}
};


// Main app class
enyo.kind({
	name: "Abcd.App",
	kind: enyo.Control,
	classes: "board",
	components: [
		{components: [
			{name: "colorBar", classes: "colorBar"},
			{name: "switchToFrench", kind: "Image", src: "images/us.png", showing: false, ontap: "localFrench", classes: "switchLang"},
			{name: "switchToEnglish", kind: "Image", src: "images/fr.png", ontap: "localEnglish", classes: "switchLang"}
		]},
		{components: [
			{name: "back", kind: "Image", src: "images/back.png", showing: false, classes: "backButton", ontap: "backTaped"},
			{name: "prev", kind: "Image", src: "images/previous.png", showing: false, classes: "prevButton", ontap: "displayPrevEntries"},
			{name: "next", kind: "Image", src: "images/next.png", showing: false, classes: "nextButton", ontap: "displayNextEntries"}
		]},
		{name: "box", components: [
		]}
	],
	
	// Constructor, save home
	create: function() {
		this.inherited(arguments);
		this.displayThemes();
		Abcd.context.screen = this;
		this.theme = this.collection = this.entry = -1;
		this.collections = [];
	},
	
	// Localization changed
	setLocale: function() {
		// If on an entry, redisplay from the beginning to avoid displaying non translated text
		var current = this.$.box.getControls()[0];
		if (current.kind == "Abcd.Entry") {
			if (this.collection.kind === undefined)
				this.displayEntries({index: Abcd.entries[current.index].coll});
			else
				this.displayLetters(this.collection);
			return;
		}
		
		// Change entry localization if any
		enyo.forEach(this.$.box.getControls(), function(entry) {
			entry.setLocale();
		});	
	},
	
	// Display themes and letters
	displayThemes: function() {
		// Display themes
		this.theme = -1;
		var length = Abcd.themes.length;
		var x = viewConst.themes.x;
		var y = viewConst.themes.y;
		this.cleanBox();
		this.$.back.hide();
		this.$.prev.hide();
		this.$.next.hide();
		this.$.colorBar.addClass("themeColor"+this.theme);
		for (var i = 0 ; i < length ; i++) {
			this.$.box.createComponent(
				{ kind: "Abcd.Theme", index: i, x: x, y: y, ontap: "displayCollections" },
				{ owner: this }
			).render();
			x = x + viewConst.themes.dx;
		}	
		
		// Display letters
		x = viewConst.letters.x;
		y = viewConst.letters.y;
		var count = 0;
		for (var i = 0 ; i < 26 ; i++) {
			this.$.box.createComponent(
				{ kind: "Abcd.Letter", x: x, y: y, letter: String.fromCharCode(65+i), ontap: "displayLetters" },
				{ owner: this }
			).render();
			x = x + viewConst.letters.dx;
			if (++count % viewConst.letters.line == 0) {
				y = y + viewConst.letters.dy;
				x = viewConst.letters.x;
			}			
		}
	},
	
	// Display all collection
	displayCollections: function(inSender, inEvent) {
		this.theme = inSender.index;	
		var length = Abcd.collections.length;
		var x = viewConst.collections.x;
		var y = viewConst.collections.y;
		var count = 0;
		this.cleanBox();
		this.$.back.show();
		this.$.prev.hide();
		this.$.next.hide();
		this.$.colorBar.removeClass("themeColor-1");		
		this.$.colorBar.addClass("themeColor"+this.theme);		
		for (var i = 0 ; i < length ; i++) {
			if (Abcd.collections[i].theme != this.theme) continue;
			this.$.box.createComponent({ kind: "Abcd.Collection", index: i, x: x, y: y, ontap: "displayEntries"}, {owner: this}).render();
			x = x + viewConst.collections.dx;
			if (++count % viewConst.collections.line == 0) {
				y = y + viewConst.collections.dy;
				x = viewConst.collections.x;
			}
		}
	},
	
	// Display entries in a collection
	displayEntries: function(inSender, inEvent) {
		// Get items in collection
		var index = inSender.index;		
		this.collection = Abcd.collections[index];
		this.collections = [];
		var length = Abcd.collections[index].entries.length;
		for (var i = 0 ; i < length ; i++) {
			var entry = Abcd.collections[index].entries[i];
			if (Abcd.entries[entry][Abcd.context.lang] == 1)
				this.collections.push(entry);
		}

		// Display it
		this.displayEntriesFrom(0);
	},
		
	// Display entries from a letter
	displayLetters: function(inSender, inEvent) {
		// Get items with this letters
		if (Abcd.letters[inSender.letter] === undefined)
			return;
		this.collection = inSender;
		this.collections = Abcd.letters[inSender.letter];

		// Display it
		this.theme = 4;
		this.$.colorBar.addClass("themeColor"+this.theme);		
		this.displayEntriesFrom(0);
	},	
	
	displayEntriesFrom: function(position) {
		var x = viewConst.entries.x;
		var y = viewConst.entries.y;
		var count = 0;
		this.cleanBox();
		this.$.back.show();
		length = this.collections.length;
		for (var i = position ; i < length ; i++) {
			this.$.box.createComponent({ kind: "Abcd.Entry", index:this.collections[i], x: x, y: y, ontap: "play"}, {owner: this}).render();
			x = x + viewConst.entries.dx;
			if (++count % viewConst.entries.line == 0) {
				y = y + viewConst.entries.dy;
				x = viewConst.entries.x;
			}
			this.entry = i;			
			if (count == viewConst.entries.screen)
				break;
		}	
		if (position != 0) 
			this.$.prev.show();
		else
			this.$.prev.hide();
		if (this.entry+1 < length)
			this.$.next.show();	
		else
			this.$.next.hide();	
	},
	
	displayNextEntries: function() {
		if (this.entry+1 < this.collections.length) {
			this.displayEntriesFrom(this.entry+1);
		}
	},
	
	displayPrevEntries: function() {
		this.displayEntriesFrom(Math.max(0,this.entry-viewConst.entries.screen-this.entry%viewConst.entries.screen));
	},
	
	backTaped: function() {
		var current = this.$.box.getControls()[0];
		if (current.kind == "Abcd.Entry" && this.collection.kind === undefined) {
			this.displayCollections({index: this.theme});
			return;
		}
		this.$.colorBar.removeClass("themeColor"+this.theme);		
		this.displayThemes();	
	},
	
	// Delete all the box content
	cleanBox: function() {
		var items = [];
		enyo.forEach(this.$.box.getControls(), function(item) {
			items.push(item);
		});		
		for (var i = 0 ; i < items.length ; i++) {
			items[i].destroy();
		}	
	},
	
	// Change current language
	localEnglish: function() {
		this.$.switchToEnglish.hide();
		this.$.switchToFrench.show();
		Abcd.setLocale(Abcd.enTexts);
	},
	
	localFrench: function() {
		this.$.switchToEnglish.show();
		this.$.switchToFrench.hide();
		Abcd.setLocale(Abcd.frTexts);
	},
	
	// Play entry sound
	play: function(inSender, inObject) {
		inSender.play(Abcd.sound);
	}
});
