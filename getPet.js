var getPet = function(name, laplace=1){

	/* split the name into individual words */
	var words = name.split(" ");
	// perhaps no need to remove punctuation
	for (var i=0; i < words.length; i++){
		words[i] = words[i].trim().toUpperCase();
	}
	// words can still contain instances of "", the empty string
	
	/* for each word, count the number of cats and dogs */
	var probCat = 1;
	var probDog = 1;
	
	for (var i=0; i < words.length; i++){
		var word = words[i];
		var cats=0;
		var dogs=0;
		
		if (word != ""){
			// go through the list of tokens
			var minDistance = Levenshtein.get(word, tokens[0]);
			cats = 0;
			dogs = 0;
			var distance;
			
			for (var j=0; j < tokens.length; j++){
				distance = Levenshtein.get(word, tokens[j]);
				if (distance < minDistance){
					minDistance = distance;
					cats = cat[j];
					dogs = dog[j];
				} else if (distance === minDistance){
					cats += cat[j];
					dogs += dog[j];
				}
				if (distance === 0){
					// in this case there is an exact match so we are finished
					break;
				}
			}
		}
		probCat *= (cats + laplace)/(cat.length + laplace);
		probDog *= (dogs + laplace)/(dog.length + laplace);
	}
	
	/* multiply the probabilities as if they were independent */
	return probCat/(probCat + probDog);
}

var process = function(){
	var name = document.getElementById("form").value;
	var probCat = getPet(name);
	var output = name + " is ";
	if (probCat < 0.55 && probCat > 0.45){
		output += "possibly a ";
	} else if (probCat < 0.7 && probCat > 0.3){
		output += "probably a ";
	} else {
		output += "likely a ";
	}
	if (probCat > 0.5){
		output += "cat (";
	} else {
		output += "dog (";
	}
	output += Math.floor(probCat > 0.5 ? probCat*100 : (1-probCat)*100) + "%)";
	document.getElementById("dogPicture").style.width = 300*(1-probCat);
	document.getElementById("catPicture").style.width = 300*(probCat);
	document.getElementById("dogPicture").style.height = 300*(1-probCat);
	document.getElementById("catPicture").style.height = 300*(probCat);
	document.getElementById("result").innerHTML = "Computing...";
	setTimeout(function(){document.getElementById("result").innerHTML = output;}, 1000*Math.random());
	//document.getElementById("result").innerHTML = output;
}

document.onkeypress = function enter(e) {if (e.which == 13) { process(); }}