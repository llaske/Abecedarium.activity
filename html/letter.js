// Theme component
enyo.kind({
	name: "Abcd.Letter",
	kind: "Abcd.Item",
	published: { letter: "" },
	classes: "itemLetter",
	showing: false,
	components: [
		{ name: "itemImage", kind: "Image", onload: "imageLoaded" }
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.letterChanged();
	},
	
	// Display only when image is load
	imageLoaded: function() {
		if (this.letter !== "")
			this.show();
	},
	
	// Localization changed, nothing to do 
	setLocale: function() {
	},
	
	// Card setup
	letterChanged: function() {
		this.letter = this.letter.toLowerCase()	
		this.$.itemImage.setAttribute("src", "images/letters/"+this.letter+Abcd.context.casevalue+".png");
	}
});	