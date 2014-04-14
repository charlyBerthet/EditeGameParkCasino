////////////////////////////
// MAIN
////////////////////////////
$(function(){
	
	
	// GESTION DES DEUX APPLI (parc / map )
	var appli = location.search ; // on lit l'url
	var googleMap;
	
	if(appli.match(/map/gi) != null){ // MAP
		$("#appliParcDeJeu").animate({width:'toggle'},0);
		// INIT
		// GOOGLE MAP
		$("#divGoogleMap").html("");
		try{
			googleMap = new MyGoogleMap();
		    resizeMap();
		}catch(e){
			console.log("Erreur construction MyGoogleMap, raison : "+e);
		}
		
	}else{ // PARC
		$("#appliGoogleMap").animate({width:'toggle'},0);
	}
	
	
	// INIT
    
    
			// PARC DE JEU
	// On MAJ la taille des div
	resizeDiv();	
	
	// On cree un parc de jeu
	var parcDeJeu = chargerParcDeJeu("default");//new ParcDeJeu();
	if(parcDeJeu == null)
		parcDeJeu = new ParcDeJeu();
	
	
	// On affiche le tableau de jeu
	parcDeJeu.draw();
		
	// On remplit le "voir les machines a sous"
	parcDeJeu.drawVoirMachineASous( $("#lesMachines") );
	
	
	
	// on rempli la div 'Ajouter un objet"
	var rempliDivAjouterObjet = function(){
	
		var content = "";
		var cpt = 0;
		var MODULE = 3;
		
		var cptTableau = 0;
		var data = "";
		var titleType = "";
		var typeBefore = "";
		
		for(var key in parcDeJeu.typeObjetPossible){
			var type = parcDeJeu.typeObjetPossible[key];
			
			// Tout les 3 objets on retourne a la ligne
			if(cptTableau == 0 && cpt%MODULE == 0 || cpt ==0){
				if(cpt != 0)
					content += "</tr>";
				content += "<tr>";
			}
			
			// on les affiche tous automatique sauf mur et porte
			if(type.match(/mur|porte/g) == null){
				
				// on remplit le content
				if(cptTableau != 0){
					content += "<td><p><label>"+titleType+"</label></p>"+
					"<input type='button' value='<' data-action='-1'/>"+
					"<img data-type='"+typeBefore+"' data-max='"+(cptTableau-1)+"' data-active='"+(cptTableau-1)+"' src='data/img/"+typeBefore+".png' width='40px' "+data+"/>"+
					"<input type='button' value='>' data-action='1'/></td>";
					
					cpt = cpt +1;
				}
				
				// on reinitialise
				cptTableau = 0;
				data = "";
				titleType = "";
				typeBefore = "";
				
				// On met en majuscule la premiere lettre du type 
				var str = "";
				for(var key in type){
					if(key == 0)
						str += type[key].toUpperCase();
					else
						str += type[key]
				}
				
				// On rempli le content (TD)
				content += "<td><p><label>"+str+"</label></p><img title='"+str+"' alt='"+str+"' data-type='"+type+"' src='data/img/"+type+".png' width='40px'/></td>";
				
				cpt = cpt +1;
				
				// SINON MUR ou PORTE
			} else{
				
				titleType = type.match(/mur|porte/g);
				titleType = titleType[0];
				// On met en majuscule la premiere lettre du typeTitle
				var str = "";
				for(var key in titleType){
					if(key == 0)
						str += titleType[key].toUpperCase();
					else
						str += titleType[key]
				}
				
				data += " data-"+cptTableau+"='"+type+"' ";
				typeBefore = type;
				
				cptTableau = cptTableau +1;				
			}
		}
		
		content += "</tr>";
		$("#tableOfObjet").html(content);
		
		
		// evenement
			// CLICK OBJET NEXT
		$("td input").click(function(){
			var val = parseInt($(this).attr("data-action"));
			var img = $(this).siblings('img');
			var active = parseInt(img.attr('data-active'));
			var max = parseInt(img.attr('data-max'));
			var next = active + val;
			// si ca depasse on retourne a lautre bout
			if(next < 0)
				next = max;
			else if(next > max)
				next = 0;
			
			// on affiche le suivant
			var newType = img.attr("data-"+next);
			img.attr("data-type",newType);
			img.attr("data-active",next);
			img.attr("src","data/img/"+newType+".png");
		});
		
			// Click un objet
		$("#tableOfObjet td img").click(function(e){
			// si il existe, on le supprime
			$("#divDeposeObjet").remove();
			// on recup le type d'objet
			var type=$(this).attr("data-type");
			// on cache la div parent
			$("#butAjouterObjet").click();
			// on cree la div de depos
			var div = "<div id='divDeposeObjet'><img src='data/img/"+type+".png' alt='"+type+"' width='40px'/></div>";
			// on l'affiche
			$("body").append(div);
			// on donne le css
			$("#divDeposeObjet").css({
				"position":"absolute",
				"background-color":"rgba(200,200,240,0.9)",
				"color":"rgb(40,40,40)",
				"padding":"10px",
				"border-radius":"10px",
				"box-shadow":"0px 0px 10px rgb(70,70,70)",
				"top":(e.pageY-5)+"px",
				"left":(e.pageX-5)+"px"
			});
			
			// et on suit la souris :)
			$("body").mousemove(function(e){
				$("#divDeposeObjet").css({
					"top":(e.pageY+5)+"px",
					"left":(e.pageX+5)+"px"
				});
			});
		});
		
		
	};
	
	
	
	
	rempliDivAjouterObjet();
	
	
	
	
	
	/////////////
	// EVENT
	////////////
	// RESIZE
	window.onresize = function(event) {
		
		if($("#appliParcDeJeu").css("display") != "none"){
			if($("#divParametrage").css("display") == "none")
				$("#divParametrage").slideDown(0);
				
			resizeDiv();
			
			parcDeJeu.resizeEtCompleteEmpl(parcDeJeu.getTableOfContenu());
		}else{
			resizeMap();
		}
		
	};
	
	
	
	/////////////////////
	// EVENT CLICK
	/////////////////////
	
	// BOUTON PARAMETRE
	$(".butParametre").click(function(){
		
		// Si il est caché on l'affiche et on donne le focus
		if( $(this).next("div").css("display") == "none" ){
			// on cache les autres
			$(".butParametre").next("div").css("display","none");
			
			// on affiche
			 $(this).next("div").css("display","block");
			 $(this).next("div").find("input").first().focus();
		}else
			 $(this).next("div").css("display","none");
	});
	
	
	// BOUTTON PARAMETRE PLUS
	$(".butParametrePlus").click(function(){
		// Si il est caché on l'affiche et on donne le focus
		if( $(this).next("div").css("display") == "none" ){
			// on cache les autres
			$(".butParametrePlus").next("div").css("display","none");
			
			// on affiche
			 $(this).next("div").css("display","block");
			 $(this).next("div").find("input").first().focus();
		}else
			 $(this).next("div").css("display","none");
	});
	
	
	
	
	
	// BUT NB EMPLACEMENT CLICK
	$("#butNbEmplacement").click(function(){
		$("#nbEmplacementLargeur").attr('placeHolder',parcDeJeu.width);
		$("#nbEmplacementHauteur").attr('placeHolder',parcDeJeu.height);
	});
	
	// BOUTON VALID NB EMPLACEMENTS
	$("#butValidNbEmplacement").click(function(){
		// on recupere les valeurs
		var w = $("#nbEmplacementLargeur").val();
		var h = $("#nbEmplacementHauteur").val();
		// On verrifie leurs natures
		if(w.match(/^[0-9]*$/) != null && h.match(/^[0-9]*$/) != null ){
			// on redessine le parc de jeu
			parcDeJeu.clear();
			parcDeJeu.changeSize(w, h);
			parcDeJeu.draw();
			$("#nbEmplacementLargeur").val("");
			$("#nbEmplacementHauteur").val("");
			$("#nbEmplacement").css("display","none");
		}else
			alert('Veuillez rentrer un numérique.');
		
	});
	
	
	

	// BOUTON ENREGISTRER OUI
	$("#butSaveOui").click(function(){
		
		// on recupere le nom de la sauvegarde
		var nameOfSave = $("#emplSaveParc .choixCharge[data-select='1']").text();
		$("#creatNameOfSave").remove(); // on supp si deja present
		
		// si la sauvegarde select est 'vide' on demande dans creer une autre, sinon on la save sous le nom choisi
		if(nameOfSave.toLowerCase() == "vide"){
			// pop up demande nouveau nom
			$("body").append("<div id='creatNameOfSave'><div><label>Enregistrer le parc</label><p>Veuillez donner le nom d'une nouvelle sauvegarde : </p></br><input type='text' placeHolder='saisir nom sauvegarde'/></br><p><span class='saisieError'></span></p></br><input type='button' value='Valider' id='validNewNameOfSauvegarde'/></div></div>");
			$("#validNewNameOfSauvegarde").siblings("input[type='text']").focus();
			
			$("#validNewNameOfSauvegarde").click(function(){
				var name = $(this).siblings("input[type='text']").val();
				
				if(name.match(/^[0-9a-z_\- °]*$/gi) != null && name.length < 50){
					var isSave = parcDeJeu.saveEtat(name);
					$("#divSaveEtatParc").css("display","none");
					$("#creatNameOfSave").remove();
					// on valide si c'est le cas
					if(isSave){
						validItsDone( $("#butParamParc") );
						$("#butParamParc").click();
					}
					
					
				}else{
					$(this).siblings("p").children(".saisieError").html("Saisie incorrecte : uniquement (0-9 a-z A-Z _ -) et 50 caractères max.");
				}
			});
		}else{
			var isSave = parcDeJeu.saveEtat(nameOfSave);
			$("#divSaveEtatParc").css("display","none");
			// on valide si c'est le cas
			if(isSave){
				validItsDone( $("#butParamParc") );
				$("#butParamParc").click();
			}
		}
		
		
		
	});
	
	
	
	// BOUTON ENREGISTRER NON
	$("#butSaveNon").click(function(){
		$("#divSaveEtatParc").css("display","none");
	});
	
	
	
	
	// BOUTON VALIDER CHARGER PARC
	$("#butValidChargeParc").click(function(){
		var name = $("#choixDeParcACharger").children(".choixCharge[data-select='1']").text();
		parcDeJeu = chargerParcDeJeu(name) || parcDeJeu;
		parcDeJeu.clear();
		parcDeJeu.draw();
		parcDeJeu.drawVoirMachineASous( $("#lesMachines") );
		$("#chargeParc").click();
		$("#butParamParc").click();
		validItsDone( $("#butParamParc") );
	});
	
	
	
	// CLICK OUVRIR PARAM PARC 
	$("#butParamParc").click(function(){ $("#nameParc").text("("+parcDeJeu.name+")"); });
	
	
	
	// CLICK OUVRIR ENREGISTRER ou CHARGER
	$("#saveEtatParc,#chargeParc").click(function(){
		
				// JE CREE MON ELEMENT HTML
		 $("#emplSaveParc").html(parcDeJeu.possibiliteCharge() + "<p class='choixCharge' data-select='0'>vide</p>");
		 $("#choixDeParcACharger").html(parcDeJeu.possibiliteCharge());
		 
		 	// JE RAJOUTE L'EVEMENT => CHANGE EMPLACEMENT SAUVEGARDE
		$(".choixCharge").click(function(){
				$(".choixCharge").attr("data-select","0");
				
				$(".choixCharge").css({
					"background-color":"rgb(255,255,255)",
					"color":"rgb(90,90,90)"
				});
				
				$(this).attr("data-select","1");
				$(this).css({
					"background-color":"rgb(150,150,150)",
					"color":"white"
				});
			});
		
		$(".choixCharge").hover(function(){
			if($(this).attr("data-select") == "0"){
				$(this).css({
					"background-color":"rgb(220,220,220)",
					"color":"rgb(90,90,90)"
				});
			}
			
		},function(){
			if($(this).attr("data-select") == "0"){
				$(this).css({
					"background-color":"rgb(255,255,255)",
					"color":"rgb(90,90,90)"
				});
				}
		});
		
	});
	
	
	
	
	
	
	
	
	
	
	// BOUTON AJOUT MACHINE A SOUS
	$("#validAjoutMachine").click(function(){
		var numMachine = $("#inNumMach").val();
		var marque = $("#inMarque").val();
		var numSocle = $("#inNumSocle").val();
		var deno = $("#inDeno").val();
		var billet = $("#inBillet").val();
		var ticket = $("#inTicket").val();
		var jeton = $("#inJeton").val();
		var jeu = $("#inJeu").val();
		var isOkay = false;
		var machineExiste = false;
		
		// on verrifie que la machine n'existe pas deja :)
		for(key in parcDeJeu.listeOfMachines){
			if( parcDeJeu.listeOfMachines[key].numMachine ==  numMachine)
				machineExiste = true;
		}		
		
		
		
		if(machineExiste){
			alert('Désolé, la machine n°'+numMachine+" existe déjà dans votre parc.");
		}else{
			// on ajoute la nouvelle machine au parc
			isOkay = parcDeJeu.ajoutMachine( new MachineASous(numMachine, marque, numSocle, deno, billet, ticket, jeton, jeu));
			
			// On remplit le "voir les machines a sous"
			isOkay = parcDeJeu.drawVoirMachineASous( $("#lesMachines") );
			
			// On ferme la div
			$("#divAllParamsMachine").css("display","none");
			if(isOkay){
				validItsDone( $("#butAjouterMachine") );
			}
		}
	});
	

	
	// CACHE DIV "ETES VOUS SUR DE SIPPRIMER CETTE MACHINE ?"
	var cacheDivEteVousSurDeSuppCetteMachine = function(){
		var elem = $("#divEtesVousSurDelete");
		elem.css("display",'none');
	};
	
	
	// SUPPRIMER CETTE MACHINE CONFIRMATION OUI
	$("#supMachNumOui").click(function(){
		cacheDivEteVousSurDeSuppCetteMachine();
		var num = $("#supMachNum").text();
		var elemASup = $(".numMachine[data-nummachine='"+num+"']");
		
		
		
		validItsDone(elemASup,200,400,200, function(){
			parcDeJeu.supprimerMachine( num );
			parcDeJeu.clear();
			parcDeJeu.draw();
			parcDeJeu.drawVoirMachineASous( $("#lesMachines") );
		});
		
		
		
	});
	
	
	
	// SUPPRIMER CETTE MACHINE CONFIRMATION NON
	$("#supMachNumNon").click(function(){
		cacheDivEteVousSurDeSuppCetteMachine();
	});
	
	
	
	
	// CLICK OPEN DIV EXTRACTION
	$("#extractParc").click(function(){
		$("#copierExtraction,#copyExtract").text(parcDeJeu.getExtractionParc());
		$('#copyExtract').clippy({clippy_path:"data/flash/clippy.swf"});
	});
	
	
	// LECTURE DE L'EXTRACTION
	$("#lireExctration").click(function(){
		var content = $("#lireExtraction").val();
		parcDeJeu = parcDeJeu.getNewParc(content);
		
		parcDeJeu.clear();
		parcDeJeu.draw();
		parcDeJeu.drawVoirMachineASous( $("#lesMachines") );
	});
	
	
	
	
	// CLICK SWITCH ECRAN
	$(".switchEcran").click(function(){
		
		// AFFICHE GOOGLE MAP
		if( $("#appliParcDeJeu").css("display") != "none" ){
			
			$("#ecranAppliParcDeJeu,#searchMAS").css({display:"none"});
			
			$("#appliParcDeJeu").animate({width:'toggle'},500,function(){
				$("#appliGoogleMap").animate({width:'toggle'},500,function(){
					
					$("#ecranAppliGoogleMap").css({display:"inline"});
					$("#legende").css({display:"inline"});
					
					if(googleMap === undefined){
						try{
							googleMap = new MyGoogleMap();
							resizeMap();
						}catch(e){
							console.log("Erreur construction MyGoogleMap, raison : "+e);
						} 
					}				
				});
			});
			
			
			
			
			
		// AFFICHE PARC DE JEU
		}else{
			
			$("#ecranAppliGoogleMap").css({display:"none"});
			$("#legende").css({display:"none"});
			
			
			$("#appliGoogleMap").animate({width:'toggle'},500,function(){
				
				$("#appliParcDeJeu").animate({width:'toggle'},500,function(){
					$("#ecranAppliParcDeJeu,#searchMAS").css({display:"inline"});
					
					resizeDiv();
					
					parcDeJeu.resizeEtCompleteEmpl(parcDeJeu.getTableOfContenu());
					
					/*$("#divGoogleMap").html("");*/
				});
				
			});
		}		
	});
	
	
	
	// CLICK SEARCH MAS
	$("#openOrCloseSearch").click(function(){
		if($(this).next('input').css("display") == "none"){
			$(this).next('input').css("display","inline-block");
			$(this).next('input').next('button').css("display","inline-block");
			
			$(this).next('input').focus();
			searchMAS($("#inSearchMAS").val());
		}else{
			$(this).next('input').css("display","none");
			$(this).next('input').next('button').css("display","none");
		}
	});
	
	
	
	// ON SEARCH
	var searchMAS = function(num){
		try{
			num = parseInt(num);
			
			$(".emplacement").each(function(){
				
				if(num == parseInt($(this).find('.num').text())){
					if($(this).css("background-color") != "rgb(255, 236, 6)")
						$(this).attr("data-bg",$(this).css("background-color"));
					$(this).css("background-color","rgb(255,236,6)");
				}else{
					if( $(this).attr("data-bg") != null && $(this).attr("data-bg") != ""){
						$(this).css("background-color",$(this).attr("data-bg"));
						$(this).attr("data-bg","");
					}
						
				}
			});
		}catch(e){
			console.log("Error lors de l'event 'search', raison : "+e);
		}
		
	};
	
	// KEY UP INPUT SEARCH
	$("#inSearchMAS").keyup(function(){
		searchMAS($(this).val());
	});
	
	
	// CLEAR INPUT SEARCH
	$("#searchMAS button").click(function(){
		$("#inSearchMAS").val("");
		searchMAS(-99);
	});
	
	
	
	
	// ORDONNE LES MACHINES 
	$(".ordreViewMachine").click(function(){
		try{
			var order = parseInt( $(this).attr("data-order") );
			parcDeJeu.orderListeMAS(order);
			parcDeJeu.drawVoirMachineASous($("#lesMachines"));
		}catch(e){
			console.log("Order machine error : "+e);
		}
	});
	
	
	
	
	
	// FULL SCREEN
	$("#fullScreen").click(function(){
		if( $(this).attr("data-info") == "0" ){
			var docElm = document.documentElement;
			$(this).attr("data-info","1");
			if (docElm.requestFullscreen) {
			    docElm.requestFullscreen();
			}
			else if (docElm.mozRequestFullScreen) {
			    docElm.mozRequestFullScreen();
			}
			else if (docElm.webkitRequestFullScreen) {
			    docElm.webkitRequestFullScreen();
			}
			
			
		}else{
			$(this).attr("data-info","0");
			if (document.exitFullscreen) {
			    document.exitFullscreen();
			}
			else if (document.mozCancelFullScreen) {
			    document.mozCancelFullScreen();
			}
			else if (document.webkitCancelFullScreen) {
			    document.webkitCancelFullScreen();
			}
		}
		
		
		
		
	});
});
