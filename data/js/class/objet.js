var Objet = function(type,emplacement){
	this.type = this.type || type || "Pas de type.. Pourquoi ?";
	this.emplacement = this.emplacement || emplacement || null;
	this.couleur = this.getCouleur();
	this.image = this.getImage();
};


/* RETOURNE L'IMAGE PROPRE A L'OBJET */
Objet.prototype.getImage = function(){
	var img = "none";
	
	if(this.type == "Mur")
		img ="mur";
	
	
	var url = "url(data/img/"+img+".png)";
	return url;
};



/* RETOURNE LA COULEUR PROPRE AU TYPE */
Objet.prototype.getCouleur = function(){
	var color ="rgba(240,240,240,1)";
	
	/*if(this.type == "Bar")
		color ="rgb(0,0,70)";
	
	else if(this.type == "Porte")
		color ="rgb(90,0,0)";
	
	else if(this.type == "Fumoir")
		color ="rgb(70,70,70)";
	
	else if(this.type == "Mur")
		color ="rgb(0,0,0)";
	
	else if(this.type == "Caisse")
		color ="rgb(0,50,0)";
	
	else if(this.type == "Table")
		color ="rgb(90,70,0)";
	*/
	return color;
};