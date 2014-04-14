var MachineASous = function(numMachine, marque, numSocle, deno, billet, ticket, jeton, jeu, emplacement){
	this.numMachine = this.numMachine || numMachine || -99;
	this.marque = this.marque ||  marque || "";
	this.numSocle = this.numSocle ||  numSocle || -99;
	this.denomination = this.denomination || deno || -99;
	this.billet = this.billet || billet || false;
	this.ticket = this.ticket || ticket || false;
	this.jeton = this.jeton || jeton || false;
	this.jeu = this.jeu || jeu || "";
	this.emplacement = this.emplacement || emplacement || null;
	
	this.color = this.getColor();
};


/* GET COLOR */
MachineASous.prototype.getColor = function(){
	var deno = parseFloat(this.denomination);
	var color = "rgba(250,250,250,1)";

	if(deno <= 0.01)
		color = "rgba(220,250,250,1)";
	else if(deno <= 0.02)
		color = "rgba(200,240,250,1)";
	else if(deno <= 0.03)
		color = "rgba(200,210,250,1)";
	else if(deno <= 0.05)
		color = "rgba(210,200,250,1)";
	else if(deno <= 0.10)
		color = "rgba(240,200,250,1)";
	else if(deno <= 0.15)
		color = "rgba(250,200,230,1)";
	else if(deno <= 0.20)
		color = "rgba(250,200,200,1)";
	else if(deno <= 0.30)
		color = "rgba(255,180,140,1)";
	else if(deno <= 0.50)
		color = "rgba(255,180,100,1)";
	else if(deno <= 1)
		color = "rgba(250,140,140,1)";
	else if(deno <= 2)
		color = "rgba(250,110,110,1)";
	else if(deno <= 5)
		color = "rgba(255,80,80,1)";
	
	
	return color;
};

/* TO STRING */
MachineASous.prototype.toString = function(){
	
	var bgColor = 'background-color:rgba(200,200,240,1)';
	// si elle a un emplacement on le montre par une coloration plus forte du content
	if(this.emplacement != null)
		bgColor = 'background-color:rgba(240,240,240,1)';
		
	return "<div class='machineASous'>"+
				"<i class='updateThisMachine option'>...</i>"+
				"<i class='moveThisMachine option'>move</i>"+
				"<i class='deleteThisMachine option'>x</i>"+
				"<span style='"+bgColor+"' class='numMachine' data-numMachine='"+this.numMachine+"'><span class='label'>Machine N° : </span><span class='machine info'>"+this.numMachine+"</span></span>"+
				"<span style='display:none'><span class='label'>Marque : </span><span class='marque info'>"+this.marque+"</span></span>"+
				"<span style='display:none'><span class='label'>Socle N° : </span><span class='socle info'>"+this.numSocle+"</span></span>"+
				"<span style='display:none'><span class='label'>Dénomitation : </span><span class='deno info'>"+this.denomination+"</span></span>"+
				"<span style='display:none'><span class='label'>Accepte billets : </span><span class='billet info'>"+this.billet+"</span></span>"+
				"<span style='display:none'><span class='label'>Accepte tickets : </span><span class='ticket info'>"+this.ticket+"</span></span>"+
				"<span style='display:none'><span class='label'>Accepte jetons : </span><span class='jeton info'>"+this.jeton+"</span></span>"+
				"<span style='display:none'><span class='label'>Type de jeu : </span><span class='jeu info'>"+this.jeu+"</span></span>"+
			"</div>";
};



/* GET DETAIL */
MachineASous.prototype.getDetail = function(){
	return "<div id='detailMachine'>"+
		"<div>"+
			"<span class='titleDetail'>n° : </span>" +
			"<span class='titleDetail'>marque : </span>" +
			"<span class='titleDetail'>socle n° : </span>" +
			"<span class='titleDetail'>déno : </span>" +
			"<span class='titleDetail'>billets : </span>" +
			"<span class='titleDetail'>tickets : </span>" +
			"<span class='titleDetail'>jetons : </span>" +
			"<span class='titleDetail'>jeu : </span>" +
		"</div><div>" +
			"<span class='dataDetail'>"+this.numMachine+"</span>"+
			"<span class='dataDetail'>"+this.marque+"</span>"+
			"<span class='dataDetail'>"+this.numSocle+"</span>"+
			"<span class='dataDetail'>"+this.denomination+"€</span>"+
			"<span class='dataDetail'>"+this.billet+"</span>"+
			"<span class='dataDetail'>"+this.ticket+"</span>"+
			"<span class='dataDetail'>"+this.jeton+"</span>"+
			"<span class='dataDetail' style='"+(this.jeu.toLowerCase().match(/poker/g) != null ? "color:red;" : "")+"' >"+this.jeu+"</span>"+
		"</div></div>";
};
