//$(function(){

	/* CONSTRUCTEUR */
	var ParcDeJeu = function(id,width,height){
		// Save
		this.id = this.id || id || 'parcDeJeu';
		this.name = this.name || "default";
		this.width = this.width || width || 20;
		
		this.height = this.height || height || 15;
		
		this.listeOfMachines = this.listeOfMachines || new Array();
		this.listeOfObjets = this.listeOfObjets || new Array();
		
		this.typeObjetPossible = Array('bar', 
										'porte horizontale','porte verticale',
										'fumoir',
										'caisse',
										'mur horizontal','mur vertical', 'mur coin bas droit','mur coin bas gauche','mur coin haut droit','mur coin haut gauche',
										'table'
										);
		
		this.colorEmplacementVide = "rgba(240,240,240,1)";
	};
	
	
	
	/* DRAW TABLEAU DE JEU */
	ParcDeJeu.prototype.draw = function(){
		var me = $("#"+this.id);
		var table ="";
		
		// On va dessiner le tableau de jeu
		for(var row=0; row < this.height; row ++){
			table += "<tr>";
			for(var column=0; column < this.width; column ++){				
				var occupe = false;
				var color = this.colorEmplacementVide;
				
				
				// On parcourt la liste des machines
				for(key in this.listeOfMachines){
					var machine =  this.listeOfMachines[key];

					// si il existe une machine à cet endroit
					if(machine.emplacement != null)
						if(machine.emplacement.x == column)
							if(machine.emplacement.y == row){
								occupe = true;
								color = machine.color;
								break;
							}
				}
				
				// On parcourt la liste des objets
				for(key in this.listeOfObjets){
					var objet =  this.listeOfObjets[key];

					// si il existe une machine à cet endroit
					if(objet.emplacement != null)
						if(objet.emplacement.x == column)
							if(objet.emplacement.y == row){
								occupe = true;
								color = objet.couleur;
								break;
							}
				}
				
					//console.log(" > "+tabOfContenu.length);
				table += "<td data-occupe='"+occupe+"' style='background-color:"+color+"' class='emplacement' data-row='"+row+"' data-column='"+column+"'>";
					table += "<div class='contentEmplacement'></div>";
				table += "</td>";					
			}
			table += "</tr>";
		}
		
		// On affiche
		me.html(table);
		
		// on resize et remplit les emplacements
		this.resizeEtCompleteEmpl(this.getTableOfContenu());
		
		
		// on affecte les evenements
		this.eventEmplacement();
		
		// si on autoSave, alors on save
		if($("#butAutoSave").is(':checked'))
			this.saveEtat();
	};
	
	
	
	
	
	/* DRAW VOIR MACHINES A SOUS */
	ParcDeJeu.prototype.drawVoirMachineASous = function(elem){
		var content = "";
		if(this.listeOfMachines.length >=1 ){
			this.listeOfMachines.forEach(function(value){
				content += value.toString();
			});
		}else{
			content += "<label>Vous n'avez pas encore de machine à sous.</label>";
		}
		
		elem.html(content);
		
		// On ajoute les evenements
		if( this.listeOfMachines.length >=1 ){
			
			this.eventVoirMachines();
		}
		return true;
	};
	
	
	
	
	
	/* TRIE ORDRE LISTE MACHINE A SOUS */
	ParcDeJeu.prototype.orderListeMAS = function(order){
		try{
			order = parseInt(order) || 0;
			
			// Si on a des MAS a trier
			if(this.listeOfMachines.length >=1 ){
				var listeTempons = new Array();
				var numRef = null;
				var SIZE_TOTAL = this.listeOfMachines.length;
				
					// on recheche le numero de reference (plus petit si order > 0 + grand si order < 0)
				for(var key in this.listeOfMachines)
					if(numRef == null || (order > 0 && parseInt(this.listeOfMachines[key].numMachine) <= numRef) || (order < 0 && parseInt(this.listeOfMachines[key].numMachine) >= numRef))
						numRef = parseInt(this.listeOfMachines[key].numMachine);
				
					// pour tout le tableau
				for(var i=0; i < SIZE_TOTAL ; i++){
					var machineAdd = null;
					var coefProx = null;
					var keyAdd = null;
						// on recherche le coef le plus près de notre num de reference et on lajoute a la suite
					for(var key in this.listeOfMachines){
						var num = parseInt(this.listeOfMachines[key].numMachine);
						if(coefProx == null || coefProx <= Math.abs(num - numRef ) ){								
							coefProx = Math.abs(num - numRef );
							machineAdd = this.listeOfMachines[key];
							keyAdd = key;
						}
					}
					
					// on l'ajoute a la liste tempons
					listeTempons.push(machineAdd);
					// on le surpprime a notre liste 
					this.listeOfMachines.splice(keyAdd,1);
				}
				
				// on ajoute notre liste tempons a notre liste
				this.listeOfMachines = listeTempons;
				
			}
		}catch(e){
			console.log("Erreur lors du trie des MAS, voici la raison : "+e);
		}
		
	};
	
	
	
	
	
	
	
	// RENVOI LE TABLEAU DE CONTENU DES EMPLACEMENTS
	ParcDeJeu.prototype.getTableOfContenu = function(){
		var tabOfContenu = new Array();
		
		for(var row=0; row < this.height; row ++){
			for(var column=0; column < this.width; column ++){
				
				
				var content = "";
				// On parcourt la liste des machines
				for(key in this.listeOfMachines){
					var machine =  this.listeOfMachines[key];
					// si il existe une machine à cet endroit
					if(machine.emplacement != null)
						if(machine.emplacement.x == column)
							if(machine.emplacement.y == row){
								// on rempli le content
								content = "<p class='titleEmplacement'>Machine</p>"+
									"<p>n°<span class='num'>"+machine.numMachine+"</span></p>"+
									"<p><span class='deno'>"+machine.denomination+"</span>€</p>";																				
								
								
								// Si c'est une poker, on l'affiche
								if(machine.jeu.toLowerCase().match(/poker/g) != null)
									content += "<p><span class='jeu'>Poker</span></p>";
								break;
							}
				}
				
				// si il y a un objet a cet endroit, on l'affiche
				for(key in this.listeOfObjets){
					var objet = this.listeOfObjets[key];
					if(objet.emplacement != null)
						if(objet.emplacement.x == column)
							if(objet.emplacement.y == row){
																
								content = "<p class='titleEmplacement titleObjet'>"+objet.type+"</p>";
								content += "<p><img class='imgEmpl' title='"+objet.type+"' alt='"+objet.type+"' src='data/img/"+objet.type+".png' /></p>"
								break;
							}
				}
				// on remplit le tableau de contenu
				tabOfContenu.push( new ContenuEmplacement(row, column, content) );
			}
		}
		
		return tabOfContenu;
	};
	
	
	
	
	
	
	
	
	// RESIZE et REMPLIT le contenu des EMPLACEMENTs
	ParcDeJeu.prototype.resizeEtCompleteEmpl = function(tabOfContenu){
		// si la div de drag and drop existe on garde son contenu, pour lui remettre direct apres
		var contentDrag = $("#emplacementEnMouvement .contentEmplacement").html();
		
		// on vide les contenu
		$(".contentEmplacement").html("");
		
		// on met la taille a 100%
		$(".contentEmplacement").css({
			"width":"100%",
			"height":"100%"
		});
		
		// SIZE des TD parents
		var width = $(".emplacement").css('width').substr(0, $(".emplacement").css('width').length -2);
		var height = $(".emplacement").css('height').substr(0, $(".emplacement").css('height').length -2);
		
	
		// on met a jour la taille des contenus
		$(".contentEmplacement").css({
			"width":width+"px",
			"height":height+"px"
		});
		
		var cpt = 0;
		// on rempli les contenus
		$(".emplacement .contentEmplacement").each(function(){
			var row = $(this).parent('.emplacement').attr('data-row');
			var column = $(this).parent('.emplacement').attr('data-column');
			// comme on rempli dans le meme ordre que la lecture on peut se permettre cette optimisation
			var content = tabOfContenu[cpt].content;

			// si on est bien au bonne endroit
			if(row == tabOfContenu[cpt].row && column == tabOfContenu[cpt].column){
				$(this).html(content);
				$(this).find('.imgEmpl').attr('width',width+'px')
				$(this).find('.imgEmpl').attr('height',height+'px')
			}else{
				console.log("ERREUR #001 class 'parcDeJeu'");
			}			
			cpt ++ ;
		});
		
		// on remplit la div drag n drop
		$("#emplacementEnMouvement .contentEmplacement").html(contentDrag);
		
		
		// On fonction de la taille des emplacements, on affiche pas tout dedans !
		
		if(parseInt(height) < 58){ // Affiche MAS + Num + Deno
			// Si c'est un poker, le num est rouge !
			$(".contentEmplacement").each(function(){
				
				if($(this).find(".jeu").text().toLowerCase() == "poker"){
					$(this).find(".num").css("color","red");
					$(this).find(".num").parent("p").css("color","red");
				}
					
			});
			
			$(".contentEmplacement .jeu").parent("p").remove();
		}
		
		if(parseInt(height) < 42){ // Affiche MAS + Num
			$(".contentEmplacement .deno, .contentEmplacement .jeu").parent("p").remove();
		}
		
		if(parseInt(height) < 28){ // Affiche Num
			$(".contentEmplacement .titleEmplacement").css("display","none");
			$(".contentEmplacement p, .contentEmplacement .num").css("font-weight","bold");
		}
	};
	
	
	
	
	/* CLEAR */
	ParcDeJeu.prototype.clear = function(){
		$("#"+this.id).html("");
	};
	
	
	/* CHANGE WIDTH */
	ParcDeJeu.prototype.changeWidth = function(width){
		this.width = width;
	};
	
	
	/* CHANGE HEIGHT */
	ParcDeJeu.prototype.changeHeight = function(height){
		this.height = height;
	};
	
	
	/* CHANGE SIZE */
	ParcDeJeu.prototype.changeSize = function(width,height){
		this.width = width;
		this.height = height;
	};
	
	
	
	
	
	/* SAVE ETAT DE PARC */
	ParcDeJeu.prototype.saveEtat = function(nameOfSave){
		
		var name = nameOfSave || this.name || "default";
		
		this.name = name;
		
		if (localStorage) {
			// Le navigateur supporte le localStorage
				// on recupere les parcs
			var local = localStorage['parcDeJeu'];
			
			
			var lesParcs = (local == "" ? {} : JSON.parse(local) );
				// on ajoute le notre
			lesParcs[name] = JSON.stringify(this) ;
			
			
			
				// on reenregistre 
			localStorage['parcDeJeu'] = JSON.stringify(lesParcs);
			
			
			
			return true;
		} else {
			// localStorage non supporté
			alert("ATTENTION ! \n"+
					"Votre navigateur ne pourra pas enregistrer vos modifications.\n"+
					"Veuillez changer de navigateur (ex: google chrome, firefox), pour pouvoirs enregistrer.");
			return false;
		}
	};
	
	
	
	
	
	/* GET EXTRACT OF PARC */
	ParcDeJeu.prototype.getExtractionParc = function(){
		return JSON.stringify(this);
	};
	
	
	
	/* CHARGE EXTRACTION OF PARC */
	ParcDeJeu.prototype.getNewParc = function(parc){
		
		if(typeof parc === "undefined"){
			alert("Désolé, il y a une erreur de saisie.");
		}else{
			// on transforme en objet
			parc = JSON.parse( parc) ;
			
			// On cast chaque Objet en son type propre
				// Les machines a sous, en machineASous
			for(var key in parc.listeOfMachines){
				parc.listeOfMachines[key].__proto__ = MachineASous.prototype;
				parc.listeOfMachines[key].constructor.call(parc.listeOfMachines[key]);
			}
			
			// Les objets, en Objet
			for(var key in parc.listeOfObjets){
				parc.listeOfObjets[key].__proto__ = Objet.prototype;
				parc.listeOfObjets[key].constructor.call(parc.listeOfObjets[key]);
			}
			
				// le parc de jeu en parcDeJeu
			parc.__proto__ = ParcDeJeu.prototype;
			parc.constructor.call(parc);

			return parc;
		}
	};
	
	
	/* CHARGE ETAT DU PARC */
	var chargerParcDeJeu= function(name){
		if (localStorage) {
			// Le navigateur supporte le localStorage
			
			if(name == undefined || name == "undefined" || name == "")
				name = "default";
			
			// On recupere le parc format json
			var parcs = localStorage['parcDeJeu'];
			if(parcs == 'undefined' || parcs == undefined || parcs == "")
				return null;
			
			
			
			// on transforme en objet
			parcs = JSON.parse( parcs) ;
			
			
			if(parcs.length <= 0)
				return null;
			
			var parc = JSON.parse(parcs[name]);
			
			// On cast chaque Objet en son type propre
				// Les machines a sous, en machineASous
			for(var key in parc.listeOfMachines){
				parc.listeOfMachines[key].__proto__ = MachineASous.prototype;
				parc.listeOfMachines[key].constructor.call(parc.listeOfMachines[key]);
			}
			
			// Les objets, en Objet
			for(var key in parc.listeOfObjets){
				parc.listeOfObjets[key].__proto__ = Objet.prototype;
				parc.listeOfObjets[key].constructor.call(parc.listeOfObjets[key]);
			}
			
				// le parc de jeu en parcDeJeu
			parc.__proto__ = ParcDeJeu.prototype;
			parc.constructor.call(parc);

			
			return parc;			
		}else{
			// localStorage non supporté
			alert("ATTENTION ! \n"+
					"Votre navigateur ne pourra pas charger vos modifications.\n"+
					"Veuillez changer de navigateur (ex: google chrome, firefox), pour pouvoirs charger.");
			return null;
		}
	};
	
	
	
	
	
	
	
	/* RETOURN LES POSSIBILITE DE PARC A CHARGER */
	ParcDeJeu.prototype.possibiliteCharge = function(){
		if (localStorage) {
			var parc = localStorage['parcDeJeu'];
			
			if(parc == 'undefined' || parc == undefined || parc == "")
				return "Pas de parc éxistant.";
			
			parc = JSON.parse(parc);
			if(parc.length <= 0)
				return "Pas de parc éxistant.";
			var poss = "";
			for(var key in parc){
				poss += "<p class='choixCharge' "+
					"data-select='"+(key.toLowerCase() == "default" ? "1" : "0")+
					"' style='"+(key.toLowerCase() == "default" ? "background-color:rgb(150,150,150);color:white; " : "")
					+"'>"+key+"</p>";
			}
			return poss;
		}else{
			return "Pas de parc éxistant.";
		}
	};
	
	
	
	
	
	/* AJOUT MACHINE */
	ParcDeJeu.prototype.ajoutMachine = function(machine){
		
		machine.denomination = this.corrigeDenomination(machine.denomination);
		
		
		this.listeOfMachines.push(machine);
		// si on autoSave, alors on save
		if($("#butAutoSave").is(':checked'))
			this.saveEtat();
		return true;
	};
	
	
	
	
	/* CORRIGE DENO */
	ParcDeJeu.prototype.corrigeDenomination = function(deno){

		//>>>>>> On corriger la saisie 'denomitation'
		// On corrige, virgule => point
		deno = deno.replace(",",".");
		// on enleve tout signe particulier avant on apres les numeriques
		var tab = deno.match(/[0-9\.]*/g); // retourn un tableau avec chaque index soit vide, soit le numerique voulu
		for(var key in tab){ // on tri et recupere juste le numeric
			if(tab[key] != ""){
				deno = tab[key];
				break;
			}
		}
		// On transforme en float 
		deno = parseFloat(deno);
		// on retransforme en string
		deno = deno + "";
		//ajoute  les zeros et . manquant
		var tab = deno.split(".");
		if(tab.length <= 1 )
			deno = deno+".00";
		else if(tab[1].length <= 1 )
			deno = deno + "0";
		/* FIN DENO CORRIGE */
		return deno;
	};
	
	
	
	/* UPDATE UNE MACHINE */
	ParcDeJeu.prototype.updateMachine = function( numMachine, marque, numSocle, deno, billet, ticket, jeton, jeu){
		
		for(var key in this.listeOfMachines){
			if(this.listeOfMachines[key].numMachine == numMachine){
				this.listeOfMachines[key].marque = marque;
				this.listeOfMachines[key].numSocle = numSocle;
				this.listeOfMachines[key].denomination = this.corrigeDenomination(deno);
				this.listeOfMachines[key].billet = billet;
				this.listeOfMachines[key].ticket = ticket;
				this.listeOfMachines[key].jeton = jeton;
				this.listeOfMachines[key].jeu = jeu;
				
				this.listeOfMachines[key].color = this.listeOfMachines[key].getColor();
				
				// si on autoSave, alors on save
				if($("#butAutoSave").is(':checked'))
					this.saveEtat();
			}
		}
	};
	
	
	
	/* SUPPRIMER UNE MACHINE */
	ParcDeJeu.prototype.supprimerMachine = function(numeroMachine){
		// on cherche la machine egale au numero et on la supprime
		for(key in this.listeOfMachines){
			var num = this.listeOfMachines[key].numMachine;
			if(num == numeroMachine){
				this.listeOfMachines.splice(key,1);
				// si on autoSave, alors on save
				if($("#butAutoSave").is(':checked'))
					this.saveEtat();
				break;
			}
			
		}
	};
	
	
	
	/* RECUPERER UNE MACHINE */
	ParcDeJeu.prototype.getMachine = function(numeroMachine){
		// on cherche la machine egale au numero et on la retourne
		for(key in this.listeOfMachines){
			var num = this.listeOfMachines[key].numMachine;
			if(num == numeroMachine)
				return this.listeOfMachines[key];
		}
		
		return null;
	};
	
	
	
	/* ATTRIBUT UN EMPLACEMENT A UNE MACHINE */
	ParcDeJeu.prototype.setEmplacementToMachine = function(numeroMachine,emplacement){
		
		// on cherche la machine egale au numero et on affecte l'enplacement
		for(key in this.listeOfMachines){
			var num = this.listeOfMachines[key].numMachine;
			if(num == numeroMachine){
				this.listeOfMachines[key].emplacement = emplacement;
				
				// si on autoSave, alors on save
				if($("#butAutoSave").is(':checked'))
					this.saveEtat();
				
				return true;
			}
		}
		return false;
	};
	
	
	
	/* ATTRIBUT UN EMPLACEMENT A UN OBJET */
	ParcDeJeu.prototype.setEmplacementToObjet = function(type,emplacement){		
		this.listeOfObjets.push(new Objet(type, emplacement));

		// si on autoSave, alors on save
		if($("#butAutoSave").is(':checked'))
			this.saveEtat();
	};
	
	
	
	// EVENT SUR VOIR VOS MACHINES
	ParcDeJeu.prototype.eventVoirMachines = function(){
		
		var moi = this;
		
		
		
		// AFFICHAGE DES DETAILS
		$(".machineASous .numMachine").click(function(){
			if($(this).siblings("span").first().css('display') == 'none')
				$(this).siblings("span").css("display","block");
			else
				$(this).siblings("span").css("display","none");
		});
		
		
		// POSSIBILITE DE SUPPRIME LA MACHINE
		$(".deleteThisMachine").click(function(){
			var elem = $("#divEtesVousSurDelete");
			var numMachine = $(this).next(".numMachine").find(".machine").text();
			elem.css("display",'inline');
			elem.find("#supMachNum").text(numMachine);
		});
		
		
		
		
		
		// UPDATE UNE MACHINE
		$(".updateThisMachine").click(function(){			
			
			
			
			
			if($(this).text() == "..."){
				$(this).text("Ok");
				$(this).css("padding","1px 4px");				
				
				$(this).siblings("span").css("display","block");
				
				$(this).siblings("span").children(".info").each(function(){
					if( $(this).parent().attr("class") != "numMachine" ){
						
						var type = $(this).attr("class");
						var val = $(this).text();
						if(type.toLowerCase().match(/billet|ticket|jeton/g) != null){
							$(this).html("<select><option "+(val.toLowerCase() == "oui" ? "selected" : "")+">Oui</option><option "+(val.toLowerCase() == "non" ? "selected" : "")+">Non</option></select>");
						}else{
							$(this).html("<input style='width:100px;' value='"+val+"'/>");
						}
						
						
					}
				});
			}else{
				$(this).text("...");
				$(this).css("padding","1px 7px");
				
				var span = $(this).siblings("span");
				
				var numMachine = span.children(".machine").text();
				
				var marque = span.children(".marque").children("input").val();
				var numSocle = span.children(".socle").children("input").val();
				var deno = span.children(".deno").children("input").val();
				var billet = span.children(".billet").children("select").val();
				var ticket = span.children(".ticket").children("select").val();
				var jeton = span.children(".jeton").children("select").val();
				var jeu = span.children(".jeu").children("input").val();
				

				$(this).siblings("span").children(".info").each(function(){
					if( $(this).parent().attr("class") != "numMachine" ){
						
						var type = $(this).attr("class");
						var val = "undefined";
						
						if(type.toLowerCase().match(/billet|ticket|jeton/g) != null)
							val = $(this).children("select").val();
						else
							val = $(this).children("input").attr("value");
						
						
						$(this).html(val);
					}
				});
				
				
				
				
				// on ajoute la nouvelle machine au parc
				moi.updateMachine( numMachine, marque, numSocle, deno, billet, ticket, jeton, jeu);
				
				// On remplit le "voir les machines a sous"
				moi.drawVoirMachineASous( $("#lesMachines") );
				
				moi.clear();
				moi.draw();
			}
			
		});
		
		
		
		
		
		// PSSIBILITE DE BOUGER LA MACHINE
		$(".moveThisMachine").click(function(e){
			
			// num de machine precedent
			var numMachineAfter = $("#machineADeposer").text();
			
			// On supprime si il y avait deja la div
			$("#rememberMoveNumMachine").remove();
			
			// on remet par defaut le css
			$(".moveThisMachine ").css({
				"border-radius":"5px"
			});
			
			// on recupere le numero de la nouvelle machine
			var numMachine = $(this).siblings(".numMachine").find(".machine").text();
			
			
			
			// si le numero de machine est différent que le precedent
			if( !(numMachineAfter != "" && numMachineAfter != undefined && numMachineAfter != "undefined" && numMachineAfter == numMachine)){
				
				// on montre le quel on a choisi
				$(this).css({
					"border-radius":"20px 0px 20px 0px"
				});
			
				// on ferme la div
				$("#divVoirMachinesASous").css("display","none");
				// on cree une div pour se souvenir du numero choisi
				$("body").append("<div id='rememberMoveNumMachine'>Deposer la machine n°<span id='machineADeposer'>"+numMachine+"</span></div>");
				$("#rememberMoveNumMachine").css({
					"position":"absolute",
					"padding":"5px 10px",
					"background-color":"rgba(50,50,240,0.8)",
					"font-size":"9pt",
					"color":"white",
					"font-weight":"bold",
					"border-radius":"20px 0px 20px 0px",
					"top":e.pageY+"px",
					"left":e.pageX+"px"
				});
				
				// On suit la souris avec la div cree
				$("body").mousemove(function(e){
					$("#rememberMoveNumMachine").css({
						"top":e.pageY+"px",
						"left":e.pageX+"px"
					});
				});
			}
		});
	};

	
	
	// EVENT SUR EMPLACEMENT
	ParcDeJeu.prototype.eventEmplacement = function(){
		var moi = this;
		
		
		
		
		// DEPOS MACHINE OU OBJET SUR UN EMPLACEMENT 
		$(".emplacement").click(function(e){
			// on recupere ses coordonnees
			var column = parseInt($(this).attr("data-column"));
			var row = parseInt($(this).attr("data-row"));
			var occupe = $(this).attr("data-occupe");
			
			
			
			// SI ON ETANT EN TRAIN DE DEPOSER UNE MACHINE
			if( $("#rememberMoveNumMachine").text() != ""){
				// on recupere le numero de machine
				var numMachine = $("#machineADeposer").text();
				
				// Si l'emplacement n'est pas occupe, on depose la machine
				if(occupe == 'false'){
					var isOkay = moi.setEmplacementToMachine(numMachine,new Emplacement(column, row, true));
					moi.clear();
					moi.draw();
					
					// on supprimer la div en mouvement
					$("#rememberMoveNumMachine").remove();
					
					// on remet a jour la div voir mes machines
					moi.drawVoirMachineASous($("#lesMachines"));
					
				}			
			}
			
			
			// SI ON DEPOSE UN OBJET et que ce n'est pas occupe
			else if($("#divDeposeObjet").html() != undefined && occupe == 'false'){
				
				var type = $("#divDeposeObjet img").attr("alt");
				moi.setEmplacementToObjet(type,new Emplacement(column, row, true));
				moi.clear();
				moi.draw();
				
				
				
				// on supprimer la div en mouvement
				$("#divDeposeObjet").remove();
			}
		});
		
		
		// CORRIGE POSITION DETAIL
		var corrigeDroitGaucheHautBasDetail = function(x,y){
			// DROITE ou GAUCHE ? on regarde on se situe la machine (si elle est au bord a droite, on modifie la pos des details
			var SCREEN_WIDTH = (window.innerWidth) - 5;
			var SCREEN_HEIGHT = (window.innerHeight) - 5;
			var widthDetail = $("#detailMachine").css("width").substr(0,$("#detailMachine").css("width").length -2);
			var heightDetail = $("#detailMachine").css("height").substr(0,$("#detailMachine").css("height").length -2);
			
			var gauche = false;
			// DROITE GAUCHE
			if( (SCREEN_WIDTH/2) - x < 0){
				x = x - widthDetail - 30; // 30 = marge -> BEAUTIFFUL

				gauche = true;
			}else{
				gauche = false;
			}
			
			
			// HAUT BAS
			if( (SCREEN_HEIGHT/2) - y < 0){
				y = y - heightDetail - 30; // 30 = marge -> BEAUTIFFUL

				if(gauche)
					$("#detailMachine").css("border-radius","15px 15px 0px 15px");
				else
					$("#detailMachine").css("border-radius","15px 15px 15px 0px");
			}else{
				if(gauche)
					$("#detailMachine").css("border-radius","15px 0px 15px 15px");
				else
					$("#detailMachine").css("border-radius","0px 15px 15px 15px");
			}
			
			
			
			return new Array(x,y);
		};
		
		
		// SI ON HOVER UN EMPLACEMENT
		$(".emplacement").hover(function(e){
			
			// si la case est occupee on affiche les details
			if( $(this).attr("data-occupe") == "true"){
				  
				var num = $(this).find('.num').text();
				
				var machine = moi.getMachine(num);
				
				
				if(machine != null){
					// si le detail est deja affiché on le remove et le reaffiche
					$("#detailMachine").remove();
					
					var detail = machine.getDetail();
					
					$("body").append(detail);
					
					// position de la souris
					var x = e.pageX + 5;
					var y = e.pageY + 5;
					
					
					// DROITE ou GAUCHE ? on regarde on se situe la machine (si elle est au bord a droite, on modifie la pos des details
					var pos = corrigeDroitGaucheHautBasDetail(x,y);
					x = pos[0];	y = pos[1];
					
					
					// on le position au niveau de la souris :)
					$("#detailMachine").css({
						"top":y+"px",
						"left":x+"px"
					});
					
					// et on suit la souris :)
					$(this).mousemove(function(e){
						var x = e.pageX + 5;
						var y = e.pageY + 5;
						
						// DROITE ou GAUCHE ? on regarde on se situe la machine (si elle est au bord a droite, on modifie la pos des details
						var pos = corrigeDroitGaucheHautBasDetail(x,y);
						x = pos[0];	y = pos[1];
						
						$("#detailMachine").css({
							"top":y+"px",
							"left":x+"px"
						});
					});
				}
			}
		},function(){
			// on supp la div de detail
			$("#detailMachine").remove();
		});		
		
		
		
		
		
		
		// DRAG AND DROP SPECIAL DE CHAQUE EMPLACEMENT
		$(".emplacement").click(function(e){
			
			// SI la case est occupee on donne la possibilité de bouger
			if( $(this).attr("data-occupe") == "true"){
				
				var dropSurLaCaseDrag = false;
				
				// si il existe on recupere les anciennes coordonnees et on le supprime
				if($("#emplacementEnMouvement").text() != ""){
					var rowBef = $("#emplacementEnMouvement").attr("data-row");
					var columnBef = $("#emplacementEnMouvement").attr("data-column");
					
					// si il a reclique sur la case de depart
					if(rowBef == $(this).attr('data-row') && columnBef == $(this).attr('data-column'))
						dropSurLaCaseDrag = true;
					
					moi.defaultShadowEmplacement(rowBef, columnBef);
				}
				
				$("#emplacementEnMouvement").remove();
				
				// si on drop sur la case drag on remet l'opacity de la div delete a 0
				if(dropSurLaCaseDrag){
					$("#deleteDuParc").css("opacity","0");
					$("#deleteDuParc").css("display","none");
				}
				
				// debut du DRAG si il ne reclique pas sur la case de debut
				if(dropSurLaCaseDrag == false){
					
					// ON MET L'opacity de la div delete a 0.7 pour montrer quelle existe
					$("#deleteDuParc").css("opacity","0.7");
					$("#deleteDuParc").css("display","inline");
					
					// on recupere tout ce QUI peu etrre interessant
					var bg = $(this).css('background-color');
					var row = $(this).attr('data-row');
					var column = $(this).attr('data-column');
					var occupe = $(this).attr('data-occupe');
					var dataBg = $(this).attr("data-bg");
					
					// on montre lequel est choisi en affectant un SHADOW
					$(this).css("box-shadow","inset 0px 0px 15px rgba(70,70,70,0.9)");
					$(this).hover(function(){
						$(this).css("box-shadow","inset 0px 0px 20px rgba(70,70,70,1)");
					},function(){
						$(this).css("box-shadow","inset 0px 0px 15px rgba(70,70,70,0.9)");
					});
					$(this).mousedown(function(){
						$(this).css("box-shadow","inset 0px 0px 30px rgba(70,70,70,1)");
					});
					
					// on rempli la div
					var divMove = "<div id='emplacementEnMouvement'>"+
						($(this).html())+
						"</div>";
					// on affiche la div
					$("body").append(divMove);
					
					// on donne le css
					$("#emplacementEnMouvement").css({
						'background-color':bg,
						"position":"absolute",
						"overflow":"hidden",
						"top":(e.pageY+5)+"px",
						"left":(e.pageX+5)+"px",
						"box-shadow":"0px 0px 20px rgba(70,70,70,1)"
					});
					
					// et on suit la souris :)
					$("body").mousemove(function(e){
						$("#emplacementEnMouvement").css({
							"top":(e.pageY+5)+"px",
							"left":(e.pageX+5)+"px"
						});
					});
					
					// on donne les attributs
					$("#emplacementEnMouvement").attr('data-row',row);
					$("#emplacementEnMouvement").attr('data-column',column);
					$("#emplacementEnMouvement").attr('data-occupe',occupe);
					$("#emplacementEnMouvement").attr('data-bg',dataBg);
				}
			}
			
			// SINON on donne la possibilite de deposer si il y a la div drag n drop active
			else{
				
				if($("#emplacementEnMouvement").text() != ""){
					var row = $("#emplacementEnMouvement").attr('data-row');
					var column = $("#emplacementEnMouvement").attr('data-column');
					// on change les objets d'emplacement
					moi.changeEmplacement($("#emplacementEnMouvement"),$(this));
					// on remove la div drag n drop
					$("#emplacementEnMouvement").remove();
					
					// on remet les hover par default
					moi.defaultShadowEmplacement(row, column);

					// on remet l'opacity de la div delete a 0
					$("#deleteDuParc").css("opacity","0");
					$("#deleteDuParc").css("display","none");
				}
			}
			
		});
		
		
		
		
		
		
		// HOVER DELETE D'OBJET DU PARC EMPLACEMENT
		$("#deleteDuParc").hover(function(){
			//si il y a un objet en drag on peu modifier l'opacite
			if($("#emplacementEnMouvement").text() != "")
				$(this).css("opacity","1");
		},function(){
			if($("#emplacementEnMouvement").text() != "")
				$(this).css("opacity","0.7");
		});
		
		
		// EFFET MOUSEDOWN DELETE
		$("#deleteDuParc div").mousedown(function(){
			$(this).css({
				"background-color":"rgba(230,230,230,1)",
				"box-shadow":"inset 0px 0px 7px rgba(120,120,120,1)"
			});
		});
		$("#deleteDuParc").mousedown(function(){
			$(this).css({
				"background-color":"rgba(150,150,150,0.7)",
				"border":"1px solid rgba(170,170,170,0.2)",
				"box-shadow":"inset 0px 0px 20px rgba(220,220,220,1)"
			});
		});		// MOUSEUP DELETE
		$("#deleteDuParc div").mouseup(function(){
			$(this).css({
				"background-color":"rgba(190,190,190,1)",
				"box-shadow":"0px 0px 20px rgba(140,140,140,1)"
			});
		});
		$("#deleteDuParc").mouseup(function(){
			$(this).css({
				"background-color":"rgba(180,180,180,0.7)",
				"border":"1px solid rgba(100,100,100,0.2)",
				"box-shadow":"none"
			});
		});			// MOUSE HOVER DELETE
		$("#deleteDuParc div").hover(function(){
			$(this).css({
				"background-color":"rgba(210,210,210,1)"
			});
		},function(){
			$(this).css({
				"background-color":"rgba(190,190,190,1)",
				"box-shadow":"0px 0px 20px rgba(140,140,140,1)"
			});
		});
		
		
		
		
		// CLIQUE DELETE D'OBJET DU PARC EMPLACEMENT
		$("#deleteDuParc div").click(function(){
			//si il y a un objet en drag on peu le supprimer
			if($("#emplacementEnMouvement").text() != ""){
				
				var row = $("#emplacementEnMouvement").attr('data-row');
				var column = $("#emplacementEnMouvement").attr('data-column');
				// on change les objets d'emplacement
				moi.changeEmplacement($("#emplacementEnMouvement"),null);
				// on remove la div drag n drop
				$("#emplacementEnMouvement").remove();
				
				// on remet les hover par default
				moi.defaultShadowEmplacement(row, column);

				// on remet l'opacity de la div delete a 0
				$("#deleteDuParc").css("opacity","0");
				$("#deleteDuParc").css("display","none");
				
				// on maj la div voir mes machines
				moi.drawVoirMachineASous($("#lesMachines"));
			}
		});
		
		
		
		
		// DRAGGABLE DU DELETE
		$("#deleteDuParc").draggable();
		
	};
	
	
	

	
	
	
	
	// REMET SHADOW HOVER EMPLACEMENT PAR DEFAUT
	ParcDeJeu.prototype.defaultShadowEmplacement = function(row,column){
		// on remet les hover par default
		$(".emplacement[data-row='"+row+"'][data-column='"+column+"']").css("box-shadow","0px 0px 3px rgba(70,70,190,0)");
		$(".emplacement[data-row='"+row+"'][data-column='"+column+"']").hover(function(){
			$(this).css("box-shadow","0px 0px 3px rgba(70,70,190,0.8)");
		},function(){
			$(this).css("box-shadow","0px 0px 3px rgba(70,70,190,0)");
		});
		// on remet le active par default
		$(".emplacement[data-row='"+row+"'][data-column='"+column+"']").mousedown(function(){
			$(this).css("box-shadow","inset 0px 0px 3px rgba(70,70,190,0.8)");
		});
		$(".emplacement[data-row='"+row+"'][data-column='"+column+"']").mouseup(function(){
			$(this).css("box-shadow","0px 0px 3px rgba(70,70,190,0.8)");
		});
	};
	
	
	
	
	// CHANGE L'OBJET D'EMPLACEMENT
	ParcDeJeu.prototype.changeEmplacement = function(thisEmplacement, toEmplacement){
		// on recupere les infos
		var content = thisEmplacement.html();
		var bg = thisEmplacement.css("background-color");
		var dataBg = thisEmplacement.attr("data-bg");
		
		if(toEmplacement != null){
			var newRow = toEmplacement.attr("data-row");
			var newColumn = toEmplacement.attr("data-column");
		}
		
		var ancienRow = thisEmplacement.attr("data-row");
		var ancienColumn = thisEmplacement.attr("data-column");
		
		if(toEmplacement != null){
			// on depose le nouveau
			toEmplacement.html(content);
			toEmplacement.css('background-color',bg);
			toEmplacement.attr('data-occupe','true');
			toEmplacement.attr('data-bg',dataBg);
		}
		
		
		//on libert le precedent
		this.libertEmplacement(ancienRow,ancienColumn);
		
		// si le type est une machine, on lui fait parvenir
		var type =thisEmplacement.find(".titleEmplacement").text().toLowerCase();
		if( type == "machine"){
			// on recupere la machine
			var num = thisEmplacement.find(".num").text();
			var machine = this.getMachine(num);
			
			if(toEmplacement != null){
				machine.emplacement.x = newColumn;
				machine.emplacement.y = newRow;
			}else
				machine.emplacement = null;
		}// si c'est un objet, on fait de meme 
		else if( $.inArray(this.typeObjetPossible, type)){
			
			// on parcourt la liste d'objet a la recherche du correspondant
			for(var key in this.listeOfObjets){
				if(this.listeOfObjets[key].emplacement.x == ancienColumn)
					if(this.listeOfObjets[key].emplacement.y == ancienRow){
						
						// si cest pour le supprimer , on le fait, sinon on le change de place
						if(toEmplacement != null){
							this.listeOfObjets[key].emplacement.x = newColumn;
							this.listeOfObjets[key].emplacement.y = newRow;
						}else
							this.listeOfObjets.splice(key,1);
					}
			}
		}
		
		// si on autoSave, alors on save
		if($("#butAutoSave").is(':checked'))
			this.saveEtat();
	};
	
	
	
	
	
	// LIBERT UN EMPLACEMENT
	ParcDeJeu.prototype.libertEmplacement = function(row, column){
		var empl = $(".emplacement[data-row='"+row+"'][data-column='"+column+"']");

		empl.css("background-color",this.colorEmplacementVide)
		empl.attr('data-occupe','false');
		empl.attr('data-bg','');
		empl.children('.contentEmplacement').html("");
	};
	
	
	
	
	
	
	
	// OBJET CONTENU EMPLACEMENT
	var ContenuEmplacement = function(row,column,content){
		this.row = row || 0;
		this.column = column || 0;
		this.content = content || "";
	};
//});
	
	