// Utility functions

// Force Enyo to process ondragover event
document.ondragover = enyo.dispatch;


// Namespace
Abcd = {};

// Game context handling
Abcd.context = {
	screen: null,
	lang: "fr",
	casevalue: 0,
};
Abcd.saveContext = function() {
	Abcd.sugar.sendMessage(
		"save-context",	{});
};
Abcd.loadContext = function(context) {
};


// Init Sugar interface
Abcd.setLocale = function(texts) {
	__$FC_l10n_set(texts);
	Abcd.letters = Abcd[Abcd.context.lang+"Letters"];
	if (Abcd.context.screen != null)
		Abcd.context.screen.setLocale();
}
Abcd.setCase = function(casevalue) {
	Abcd.context.casevalue = casevalue;
	if (Abcd.context.screen != null)
		Abcd.context.screen.setCase();
}
Abcd.sugar = new Sugar();
Abcd.sugar.connect("localization", Abcd.setLocale);
Abcd.sugar.connect("save-context", Abcd.saveContext);
Abcd.sugar.connect("load-context", Abcd.loadContext);
Abcd.log = function(msg) {
	Abcd.sugar.sendMessage("console-message", msg);
	console.log(msg);
};
