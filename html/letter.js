// Theme component
enyo.kind({
	name: "Abcd.Letter",
	kind: "Abcd.Item",
	published: { letter: "", selected: false },
	classes: "itemLetter",
	showing: false,
	components: [
		{ name: "itemImage", kind: "Image", onload: "imageLoaded" }
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.letterChanged();
		this.selectedChanged();
	},
	
	// Display only when image is load
	imageLoaded: function() {
		if (this.letter !== "")
			this.show();
	},
	
	// Localization changed, nothing to do 
	setLocale: function() {
	},
	
	// Letter setup
	letterChanged: function() {
		if (this.letter !== "") {
			this.letter = this.letter.toLowerCase();	
			this.$.itemImage.setAttribute("src", "images/letters/"+this.letter+Abcd.context.casevalue+".png");
		}
	},
	
	selectedChanged: function() {
		if (this.selected)
			this.addClass("itemLetter-selected");
		else
			this.removeClass("itemLetter-selected");
	},
	
	// Play sound for this letter
	play: function(media) {	
		media.play("audio/"+Abcd.context.lang+"/database/upper_"+this.letter.toUpperCase());
	}	
});	