var Emplacement = function(x,y,occupe){
	this.x = x || 0;
	this.y = y || 0;
	this.occupe = false || occupe;
	this.menu = this.giveMeTheMenu();
};




/* CREE LE MENU */
Emplacement.prototype.giveMeTheMenu = function(){
	var menu = "<div class='menuEmplacement'>";
	menu += "<p class='menuTitle'><span>Menu</span></p>";
	// si l'emplacement est occupe
	if(this.occupe){
		menu += "<p class='options'><label class'menuSupp'>Supprimer</label></p>";
	}else{
		menu += "<p class='options' ><label class'menuAjou'>Ajouter</label></p>";
	}
	menu += "</div>";
	
	
	return menu;
};