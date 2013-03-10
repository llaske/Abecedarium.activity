// Entry component with image, text and sound
enyo.kind({
	name: "Abcd.Entry",
	kind: "Abcd.Item",
	published: { index: "" },
	classes: "entry",
	components: [
		{ name: "spinner", kind: "Image", src: "images/spinner-light.gif", classes: "spinner"},	
		{ name: "contentBox", showing: false, components: [
			{ name: "itemImage", classes: "entryImage", kind: "Image", onload: "imageLoaded" },
			{ name: "soundIcon", kind: "Image", src: "images/sound_icon.png", classes: "entrySoundIcon" },
			{ name: "itemText", classes: "entryText" }
		]},
		{kind: "Signals", onEndOfSound: "endOfSound"}		
	],
	events: {
		onEntrySoundEnded: ""
	},
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.sound = null;
		this.indexChanged();
	},
	
	// Display only when image is load
	imageLoaded: function() {
		if (this.index !== "") {
			this.$.spinner.hide();
			this.$.contentBox.show();
		}
	},
	
	// Localization changed, update text & sound 
	setLocale: function() {
		this.indexChanged();
		this.inherited(arguments);
	},
	
	// Card setup
	indexChanged: function() {
		// Get content
		var entry = Abcd.entries[this.index];
		var image = "images/database/"+entry.code+".png";
		var text = __$FC(entry.text);
		if (Abcd.context.casevalue == 1)
			text = text.toUpperCase();
			
		// Get sound
		if (entry[Abcd.context.lang]) {
			this.sound = "audio/"+Abcd.context.lang+"/database/"+entry.code;
			this.$.soundIcon.setSrc("images/sound_off.png");
		} else {
			this.sound = null;
			this.$.soundIcon.setSrc("images/sound_none.png");
		}
		
		// Display all
		this.$.itemImage.setAttribute("src", image);
		this.$.itemText.removeClass("entryText0");
		this.$.itemText.removeClass("entryText1");
		this.$.itemText.removeClass("entryText2");
		this.$.itemText.addClass("entryText"+Abcd.context.casevalue);
		this.$.itemText.setContent(text);
	},
	
	// Play sound using the media
	play: function(media) {
		if (this.sound != null) {
			this.$.soundIcon.setSrc("images/sound_on.png");	
			media.play(this.sound);
		}
	},
	
	endOfSound: function(e, s) {
		if (s == this.sound) {
			this.doEntrySoundEnded();
			this.$.soundIcon.setSrc("images/sound_off.png");
		}
	},

	abort: function() {
		 if (this.$.soundIcon !== undefined)
			this.$.soundIcon.setSrc("images/sound_off.png");	
	}
});