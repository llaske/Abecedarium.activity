// Theme component
enyo.kind({
	name: "Abcd.Theme",
	kind: "Abcd.Item",
	published: { index: "" },
	classes: "theme",
	components: [	
		{ name: "spinner", kind: "Image", src: "images/spinner-light.gif", classes: "spinner"},	
		{ name: "contentBox", showing: false, components: [		
			{ name: "itemImage", classes: "themeImage", kind: "Image", onload: "imageLoaded" },
			{ name: "itemText", classes: "themeText" }
		]}
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);
		this.indexChanged();
	},
	
	// Display only when image is load
	imageLoaded: function() {
		if (this.index !== "") {
			this.$.spinner.hide();
			this.$.contentBox.show();
		}
	},
	
	// Localization changed, update text 
	setLocale: function() {
		this.indexChanged();
		this.inherited(arguments);
	},
	
	// Card setup
	indexChanged: function() {
		var theme = Abcd.themes[this.index];
		var entry = Abcd.entries[theme.img];
		var image = "images/database/"+entry.code+".png";
		var text = __$FC(theme.text);
		if (Abcd.context.upper)
			text = text.toUpperCase();
		this.$.itemImage.setAttribute("src", image);
		this.$.itemText.setContent(text);
		this.addClass("themeColor"+this.index);
	}
});	