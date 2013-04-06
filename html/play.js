

// Learn app class
enyo.kind({
	name: "Abcd.Play",
	kind: enyo.Control,
	classes: "board",
	components: [
		{components: [
			{name: "home", kind: "Abcd.HomeButton"},
			{kind: "Abcd.CaseButton"},
			{kind: "Abcd.LanguageButton"}
		]}
	],
	
	// Constructor, save home
	create: function() {
		this.inherited(arguments);
	},
	
	// Localization changed
	setLocale: function() {
	},
	
	// Case changed
	setCase: function() {
	}	
});
