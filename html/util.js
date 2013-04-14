// Utility functions


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


// Home handling
Abcd.goHome = function() {
	if (Abcd.context.home != null) {
		Abcd.context.home.renderInto(document.getElementById("body"));
		Abcd.context.home.playTheme();
	}
};


//--- Utilities

// Change visibility of a set of controls
Abcd.changeVisibility = function(object, items) {
	for(var item in items) {
		if (items[item])
			object.$[item].show();
		else
			object.$[item].hide();
	}
}

// Randomly get an entry in the current language
Abcd.randomEntryIndex = function(excludes, filter) {
	// Choose a letter
	var firstlen = 0;
	var firstindex = -1;
	for(var key in Abcd.letters) {
		if (filter != null && filter.letter == key) {
			firstindex = firstlen;
			break;
		}
		if (Abcd.letters.hasOwnProperty(key)) firstlen++;
	}
	if (firstindex == -1)
		firstindex = Math.floor(Math.random()*firstlen);
	
	// Choose an index
	var i = 0;
	var value = null;
	for(var key in Abcd.letters) {
		if (i++ == firstindex) {
			value = Abcd.letters[key]; 
			break;
		}
	}
	
	// Copy without excludes
	var array = [];
	for (i = 0 ; i < value.length ; i++) {
		var found = false;
		if (excludes !== undefined) {
			for (var j = 0 ; !found && j < excludes.length ; j++) {
				if (value[i] == excludes[j])
					found = true;
			}
		}
		if (!found)
			array.push(value[i]);
	}

	// Select one randomely
	var secondlen = array.length;
	var secondindex = Math.floor(Math.random()*secondlen);
	return array[secondindex];
}

// Mix an array into a new one
Abcd.mix = function(chain) {
	// Check size
	if (chain.length < 2) {
		return chain;
	}
	
	// Mix cards
	var mixedchain = [];
	var tomix = enyo.cloneArray(chain);
	while (tomix.length != 1) {
		// Take a card
		var i = Math.floor(Math.random()*tomix.length);
		mixedchain.push(tomix[i]);
		tomix[i] = null;
		
		// Remix
		var newmix = [];
		for (var j = 0 ; j < tomix.length ; j++) {
			if (tomix[j] != null)
				newmix.push(tomix[j]);
		}
		tomix = newmix;
	}
	mixedchain.push(tomix[0]);
	
	return mixedchain;
};