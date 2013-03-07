// Collection component
enyo.kind({
	name: "Abcd.Collection",
	kind: "Abcd.Item",
	published: { index: "" },
	classes: "collection",
	components: [
		{ name: "spinner", kind: "Image", src: "images/spinner-light.gif", classes: "spinner-small"},	
		{ name: "contentBox", showing: false, components: [
			{ name: "itemImage", classes: "collectionImage", kind: "Image", onload: "imageLoaded" },
			{ name: "itemText", classes: "collectionText" }
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
		var collection = Abcd.collections[this.index];
		var entry = Abcd.entries[collection.img];
		var image = "images/database/"+entry.code+".png";
		var text = __$FC(collection.text);
		if (Abcd.context.upper)
			text = text.toUpperCase();
		this.$.itemImage.setAttribute("src", image);
		this.$.itemText.setContent(text);
		this.addClass("themeColor"+collection.theme);
	}
});	