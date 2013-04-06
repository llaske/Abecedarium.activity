

// Go home button
enyo.kind({
	name: "Abcd.HomeButton",
	kind: enyo.Control,
	components: [
		{name: "home", kind: "Image", src: "images/home.png", classes: "backButton", ontap: "goHome"},
	],
	
	// Constructor
	rendered: function() {
		this.inherited(arguments);
	},

	// Go back home
	goHome: function() {
		Abcd.goHome();
	}	
});


// Switch case button
var caseVisibilityTab = [
	{switchToLower: false, switchToUpper: true, switchToScript: false},
	{switchToLower: false, switchToUpper: false, switchToScript: true},
	{switchToLower: true, switchToUpper: false, switchToScript: false}
];

enyo.kind({
	name: "Abcd.CaseButton",
	kind: enyo.Control,
	classes: "switchCase",
	components: [
		{name: "switchToUpper", kind: "Image", src: "images/case0.png", classes: "switchCaseButton", ontap: "localUpper"},			
		{name: "switchToScript", kind: "Image", src: "images/case1.png", showing: false, classes: "switchCaseButton", ontap: "localScript"},			
		{name: "switchToLower", kind: "Image", src: "images/case2.png", showing: false, classes: "switchCaseButton", ontap: "localLower"},			
	],
	
	// Constructor
	rendered: function() {
		this.inherited(arguments);
		Abcd.changeVisibility(this, caseVisibilityTab[Abcd.context.casevalue]);
	},
	
	// Change current case
	localUpper: function() {
		Abcd.changeVisibility(this, caseVisibilityTab[1]);
		Abcd.setCase(1);
	},
	
	localLower: function() {
		Abcd.changeVisibility(this, caseVisibilityTab[0]);
		Abcd.setCase(0);
	},
	
	localScript: function() {
		Abcd.changeVisibility(this, caseVisibilityTab[2]);	
		Abcd.setCase(2);
	}
});



// Switch language button
enyo.kind({
	name: "Abcd.LanguageButton",
	kind: enyo.Control,
	classes: "switchLang",
	components: [
		{name: "switchToFrench", kind: "Image", src: "images/us.png", showing: false, classes: "switchLangButton", ontap: "localFrench"},
		{name: "switchToEnglish", kind: "Image", src: "images/fr.png", classes: "switchLangButton", ontap: "localEnglish"}	
	],
	
	// Constructor
	rendered: function() {
		this.inherited(arguments);
		if (Abcd.context.lang == 'en')
			Abcd.changeVisibility(this, {switchToEnglish: false, switchToFrench: true});
		else
			Abcd.changeVisibility(this, {switchToEnglish: true, switchToFrench: false});
	},
	
	// Change current language
	localEnglish: function() {
		Abcd.changeVisibility(this, {switchToEnglish: false, switchToFrench: true});
		Abcd.setLocale(Abcd.enTexts);
	},
	
	localFrench: function() {
		Abcd.changeVisibility(this, {switchToEnglish: true, switchToFrench: false});
		Abcd.setLocale(Abcd.frTexts);
	}
});	