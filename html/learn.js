

// Collections size on the screen
var viewConst = {
	themes: { x: 60, y: 70, dx: 260},
	letters: { x: 90, y: 350, dx: 80, dy: 80, line: 12},
	collections: { x: 30, y: 50, dx: 280, dy: 100, line: 4},
	entries: { x: 70, y: 50, dx: 260, dy: 250, line: 4, screen: 8}
};


// Learn app class
enyo.kind({
	name: "Abcd.Learn",
	kind: enyo.Control,
	classes: "board",
	components: [
		{components: [
			{name: "colorBar", classes: "colorBar"},
			{name: "home", kind: "Image", src: "images/home.png", classes: "backButton", ontap: "goHome"},			
			{name: "startSlideshow", kind: "Image", src: "images/slideshow.png", showing: false, ontap: "startSlideshow", classes: "slideshow"},
			{name: "stopSlideshow", kind: "Image", src: "images/pause.png", showing: false, ontap: "stopSlideshow", classes: "slideshow"},
			{name: "switchToUpper", kind: "Image", src: "images/case0.png", ontap: "localUpper", classes: "switchCase"},			
			{name: "switchToScript", kind: "Image", src: "images/case1.png", showing: false, ontap: "localScript", classes: "switchCase"},			
			{name: "switchToLower", kind: "Image", src: "images/case2.png", showing: false, ontap: "localLower", classes: "switchCase"},			
			{name: "switchToFrench", kind: "Image", src: "images/us.png", showing: false, ontap: "localFrench", classes: "switchLang"},
			{name: "switchToEnglish", kind: "Image", src: "images/fr.png", ontap: "localEnglish", classes: "switchLang"}
		]},
		{components: [
			{name: "pageCount", content: "-/-", classes: "pageCount", showing: false},
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
		this.theme = this.collection = this.entry = -1;
		this.collections = [];
		this.playing = null;
		this.slideshowIndex = -1;
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
	
	// Case changed
	setCase: function() {
		// Redraw entry
		enyo.forEach(this.$.box.getControls(), function(entry) {
			if (entry.kind == 'Abcd.Letter')
				entry.letterChanged();
			else
				entry.indexChanged();
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
		this.$.home.show();
		this.$.back.hide();
		this.$.prev.hide();
		this.$.next.hide();
		this.$.pageCount.hide();
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
				if ( i == 23 ) x = x + (viewConst.letters.dx * 5);
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
		this.$.home.hide();		
		this.$.back.show();
		this.$.prev.hide();
		this.$.next.hide();
		this.$.pageCount.hide();		
		this.$.startSlideshow.hide();
		this.$.stopSlideshow.hide();		
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
		this.$.home.hide();		
		this.$.back.show();
		this.$.startSlideshow.show();
		this.$.stopSlideshow.hide();
		this.$.pageCount.show();		
		length = this.collections.length;
		for (var i = position ; i < length ; i++) {
			this.$.box.createComponent({ kind: "Abcd.Entry", index:this.collections[i], x: x, y: y, ontap: "play", onEntrySoundEnded: "soundEnd"}, {owner: this}).render();
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
		this.$.pageCount.setContent(Math.ceil(i/viewConst.entries.screen)+"/"+Math.ceil(length/viewConst.entries.screen));
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
	
	// Change current case
	localUpper: function() {
		this.$.switchToLower.hide();
		this.$.switchToUpper.hide();	
		this.$.switchToScript.show();	
		Abcd.setCase(1);
	},
	
	localLower: function() {
		this.$.switchToLower.hide();
		this.$.switchToUpper.show();	
		this.$.switchToScript.hide();	
		Abcd.setCase(0);
	},
	
	localScript: function() {
		this.$.switchToLower.show();
		this.$.switchToUpper.hide();	
		this.$.switchToScript.hide();	
		Abcd.setCase(2);
	},
	
	// Slideshow handling
	startSlideshow: function(inSender, inObject) {
		this.slideshowIndex = 0;
		this.$.startSlideshow.hide();
		this.$.stopSlideshow.show();
		var first = this.$.box.getControls()[this.slideshowIndex];		
		this.play(first);
	},

	stopSlideshow: function(inSender, inObject) {
		this.slideshowIndex = -1;
		this.$.startSlideshow.show();
		this.$.stopSlideshow.hide();		
	},
		
	// Play entry sound
	play: function(inSender, inObject) {
		if (this.playing != null)
			this.playing.abort();	
		this.playing = inSender;
		inSender.play(Abcd.sound);
	},
	
	soundEnd: function(inSender, inObject) {
		this.playing = null;
		if (this.slideshowIndex != -1) {
			var next = this.$.box.getControls()[++this.slideshowIndex];
			if (next !== undefined)
				this.play(next);
			else
				this.stopSlideshow();
		}
	},
	
	// Go back home
	goHome: function() {
		Abcd.goHome();
	}
});
