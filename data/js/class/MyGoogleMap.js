///////////////////////////// CONSTRUCTEUR \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var MyGoogleMap = function(){
	this.map = null;
	this.geoCoder = null;
	this.markers = new Array();
	
	// Ajoute la map au dom une fois chargée
	google.maps.event.addDomListener(window, 'load', this.init());
	
	// un fois tous chargé on init & affiche les markers
	//google.maps.event.addListenerOnce(this.map, 'idle', this.initMarkers(this.showMarker(this.map)) );
	this.initMarkers(this.showMarker(this.map));
};



/////////////////////////// INITIALISE LA MAP \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
MyGoogleMap.prototype.init = function initialize() {
	// Cree un geoCoder (permet de retourner une position a une adresse)
	this.geoCoder = new google.maps.Geocoder();
	
	// init les options
    var mapOptions = {
            center: new google.maps.LatLng(45.8567,6.6167), // on centre la carte sur megeve :-)
            zoom: 5
          };
    // charge la map
    this.map = new google.maps.Map(document.getElementById("divGoogleMap"), mapOptions);
 
};







/////////////////////////// AFFICHE LE MARKER DANS LA MAP \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
MyGoogleMap.prototype.showMarker = function(map){
	return function closureShowMarker(title,latLng,importance){
		var fillColor = strokeColor = '#000000', scale = 1;
		switch(importance){
		case 1: fillColor = '#6666FF'; strokeColor = '#0000FF'; scale = 5; break;
		case 2: fillColor = '#FF6666'; strokeColor = '#FF3333'; scale = 1; break;
		case 3: fillColor = '#FFCC00'; strokeColor = '#FF0000'; scale = 3; break;
		}
		
		var marker = new google.maps.Marker({
		    "position":latLng,
		    "title":title,
		    "icon":{
		    	"path": 'M-2,0 C-2,2 2,2 2,0 C2,-2 -2,-2 -2,0Z',
		        "fillColor": fillColor,
		        "fillOpacity": 1,
		        "scale": scale,
		        "strokeColor": strokeColor,
		        "strokeWeight": 3
		    }
		});
		
		marker.setMap(map);
	};
};









/////////////////////////// AJOUTE UN MARKER \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
MyGoogleMap.prototype.addMarker = function(address,importance,callback){
	
	// fonction ajoute un marker a la liste de markers
	function closureAddMarker2Liste(listeOfMarkers,callback,map){
		
		return function addMarker2Liste(latLng,title,importance){
			listeOfMarkers.push({
				"latLng":latLng,
				"title":title,
				"importance":importance
			});
			
			callback(title,latLng,importance);
		};
	}

	var ajoutMarker2MyListe = closureAddMarker2Liste(this.markers,callback);
	
	// on essai d'avoir l'address en local si elle existe
	var latLng = this.getAddress(address);
	
	if(latLng != false){
		// on l'ajoute la la liste a afficher
		ajoutMarker2MyListe(
				latLng,
    			address,
    			importance);
		
	}else{ // SI l'address n'exsite pas en local on va la recherche grace à Google, et on l'enregistre
		// appel geocode en lui donnant la fonction en callback
		this.getGeoCoding(address,ajoutMarker2MyListe,importance,this.saveAddress);
	}
	
};



/////////////////////////// RETOURNE ADDRESS CONNUE LOCAL \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
MyGoogleMap.prototype.getAddress = function(address){
	
	if (localStorage) {
		// on recupere le tabAdress en memoire
		var tabAddress = localStorage['tabAddress'];
		
		// si il existe on le retourn
		if(tabAddress != undefined && tabAddress != "undefined"){
			
			// on transforme en objet
			tabAddress = JSON.parse( tabAddress ) ;
			
			// SI IL EXISTE ON le retourne
			if( tabAddress[address] != 'undefined' && tabAddress[address] != undefined){
				var tabLatLng = tabAddress[address].split(",");
				var lat = parseFloat(tabLatLng[0]);
				var lng = parseFloat(tabLatLng[1]);
				return new google.maps.LatLng(lat,lng);
			}
		}
		
		// sinon on retourne false
		return false;
	} else {
		// localStorage non supporté
		console.log("ATTENTION ! \n"+
				"Votre navigateur ne pourra pas charger les adresses des clients.\n"+
				"Veuillez changer de navigateur (ex: google chrome, firefox), pour pouvoirs enregistrer.");
		return false;
	}
};


/////////////////////////// ENREGISTRE ADDRESS CONNUE LOCAL \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
MyGoogleMap.prototype.saveAddress = function(address,latLng){
	if (localStorage) {
		// on recupere le tabAdress en memoire
		var tabAddress = localStorage['tabAddress'];
		
		
		// si il n'existe pas on le cree
		if(tabAddress == 'undefined' || tabAddress == undefined)
			tabAddress = {};
		else
			tabAddress = JSON.parse( tabAddress ) ; // on transforme en objet
		
		
		
		// on ajoute ladresse
		tabAddress[address] = latLng;
		
		
		
		// on le re enregistre
		localStorage['tabAddress'] = JSON.stringify(tabAddress);
		
		return true;
	} else {
		// localStorage non supporté
		console.log("ATTENTION ! \n"+
				"Votre navigateur ne pourra pas enregistrer les adresses des clients.\n"+
				"Veuillez changer de navigateur (ex: google chrome, firefox), pour pouvoirs enregistrer.");
		return false;
	}
};



/////////////////////////// GET GEOCODING \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	// => On donne une adresse, retourn la position (latitude, longitude)
MyGoogleMap.prototype.getGeoCoding = function(address,callbackAdd,importance,callbackSave){
	this.geoCoder.geocode( { 'address': address}, function(results, status) {
			// si la reponse est bonne
	      if (status == google.maps.GeocoderStatus.OK) {
	    	
	    	callbackAdd(
	    			results[0].geometry.location,
	    			address,
	    			importance
	    			);
	    	
	    	var lat = results[0].geometry.location.k;
	    	var lng = results[0].geometry.location.A;
	    	callbackSave(
	    			address,
	    			lat+","+lng
	    			);
	    	console.log("Requete à API Google : GeoCode =>"+address);
	        return true;
	        
	        // sinon
	      } else {
	        console.log("Geocode n'a pas marchée pour cette raison: " + status);
	        return false;
	      }
	});

};









///////////////////////// INIT LES MARKERS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	// SVP, par order 1 puis 2 puis 3
		// 1 = mon Casino | 2 = client | 3 = client VIP
MyGoogleMap.prototype.initMarkers = function(callback){
	this.addMarker("Casino de Megeve", 1,callback);
	this.addMarker("Annecy", 2,callback);
	this.addMarker("Menthon Saint-Bernard", 2,callback);
	this.addMarker('Aspin-Aure (65240)', 2,callback);
	this.addMarker('Aspin-en-Lavedan (65100)', 2,callback);
	this.addMarker('Asque (65130)', 2,callback);
	this.addMarker('Asté (65200)', 2,callback);
	this.addMarker('Astugue (65200)', 2,callback);
	this.addMarker('Aubarède (65350)', 2,callback);
	this.addMarker('Aucun (65400)', 2,callback);
	this.addMarker('Aulon (31420)', 2,callback);
	this.addMarker('Aureilhan (65800)', 2,callback);
	this.addMarker('Aurensan (65390)', 2,callback);
	this.addMarker('Auriébat (65700)', 2,callback);
	this.addMarker('Avajan (65240)', 2,callback);
	this.addMarker('Aventignan (65660)', 2,callback);
	this.addMarker('Averan (65380)', 2,callback);
	this.addMarker('Aveux (65370)', 2,callback);
	this.addMarker('Avezac-Prat-Lahitte (65130)', 2,callback);
	this.addMarker('Ayros-Arbouix (65400)', 2,callback);
	this.addMarker('Ayzac-Ost (65400)', 3,callback);
	this.addMarker('Azereix (65380)', 2,callback);
	this.addMarker('Azet (65170)', 2,callback);
	this.addMarker('Arrayou-Lahitte (65100)', 2,callback);
	this.addMarker('Alénya (66200)', 2,callback);
	this.addMarker('Amélie-les-Bains-Palalda (66110)', 2,callback);
	this.addMarker('Angoustrine-Villeneuve-des-Escaldes (66760)', 2,callback);
	this.addMarker('Ansignan (66220)', 2,callback);
	this.addMarker('Arboussols (66320)', 2,callback);
	this.addMarker('Argelès-sur-Mer (66700)', 2,callback);
	this.addMarker('Arles-sur-Tech (66150)', 2,callback);
	this.addMarker('Ayguatébia-Talau (66360)', 2,callback);
	this.addMarker('Achenheim (67204)', 2,callback);
	this.addMarker('Adamswiller (67320)', 2,callback);
	this.addMarker('Albé (67220)', 2,callback);
	this.addMarker('Allenwiller (67310)', 2,callback);
	this.addMarker('Alteckendorf (67270)', 2,callback);
	this.addMarker('Altenheim (67490)', 2,callback);
	this.addMarker('Altorf (67120)', 2,callback);
	this.addMarker('Altwiller (67260)', 2,callback);
	this.addMarker('Andlau (67140)', 2,callback);
	this.addMarker('Artolsheim (67390)', 2,callback);
	this.addMarker('Aschbach (67250)', 2,callback);
	this.addMarker('Asswiller (67320)', 2,callback);
	this.addMarker('Auenheim (67480)', 2,callback);
	this.addMarker('Avolsheim (67120)', 2,callback);
	this.addMarker('Algolsheim (68600)', 2,callback);
	this.addMarker('Altenach (68210)', 2,callback);
	this.addMarker('Altkirch (68130)', 2,callback);
	this.addMarker('Ammerschwihr (68770)', 2,callback);
	this.addMarker('Ammerzwiller (68210)', 2,callback);
	this.addMarker('Andolsheim (68280)', 2,callback);
	this.addMarker('Appenwihr (68280)', 2,callback);
	this.addMarker('Artzenheim (68320)', 2,callback);
	this.addMarker('Aspach (68130)', 2,callback);
	this.addMarker('Aspach-le-Bas (68700)', 2,callback);
	this.addMarker('Aspach-le-Haut (68700)', 2,callback);
	this.addMarker('Attenschwiller (68220)', 2,callback);
	this.addMarker('Aubure (68150)', 2,callback);
	this.addMarker('Affoux (69170)', 2,callback);
	this.addMarker('Aigueperse (69790)', 2,callback);
	this.addMarker('Albigny-sur-Saône (69250)', 2,callback);
	this.addMarker('Alix (69380)', 2,callback);
	this.addMarker('Ambérieux (69480)', 2,callback);
	this.addMarker('Amplepuis (69550)', 2,callback);
	this.addMarker('Ampuis (69420)', 2,callback);
	this.addMarker('Ancy (69490)', 2,callback);
	this.addMarker('Anse (69480)', 2,callback);
	this.addMarker('Arnas (69400)', 2,callback);
	this.addMarker('Aveize (69610)', 2,callback);
	this.addMarker('Avenas (69430)', 2,callback);
	this.addMarker('Azolette (69790)', 2,callback);
	this.addMarker('Abelcourt (70300)', 2,callback);
	this.addMarker('Aboncourt-Gesincourt (70500)', 2,callback);
	this.addMarker('Achey (70180)', 2,callback);
	this.addMarker('Adelans-et-le-Val-de-Bithaine (70200)', 2,callback);
	this.addMarker('Aillevans (70110)', 2,callback);
	this.addMarker('Aillevillers-et-Lyaumont (70320)', 2,callback);
	this.addMarker('Ailloncourt (70300)', 2,callback);
	this.addMarker('Ainvelle (70800)', 2,callback);
	this.addMarker('Aisey-et-Richecourt (70500)', 2,callback);
	this.addMarker('Alaincourt (70210)', 2,callback);
	this.addMarker('Amage (70280)', 2,callback);
	this.addMarker('Amance (70160)', 2,callback);
	this.addMarker('Ambiévillers (70210)', 2,callback);
	this.addMarker('Amblans-et-Velotte (70200)', 2,callback);
	this.addMarker('Amoncourt (70170)', 2,callback);
	this.addMarker('Amont-et-Effreney (70310)', 2,callback);
	this.addMarker('Anchenoncourt-et-Chazel (70210)', 2,callback);
	this.addMarker('Ancier (70100)', 2,callback);
	this.addMarker('Andelarre (70000)', 2,callback);
	this.addMarker('Andelarrot (70000)', 2,callback);
	this.addMarker('Andornay (70200)', 2,callback);
	this.addMarker('Angirey (70700)', 2,callback);
	this.addMarker('Anjeux (70800)', 2,callback);
	this.addMarker('Apremont (70100)', 2,callback);
	this.addMarker('Arbecey (70160)', 2,callback);
	this.addMarker('Arc-lès-Gray (70100)', 2,callback);
	this.addMarker('Argillières (70600)', 2,callback);
	this.addMarker('Aroz (70360)', 2,callback);
	this.addMarker('Arpenans (70200)', 2,callback);
	this.addMarker('Arsans (70100)', 2,callback);
	this.addMarker('Athesans-Étroitefontaine (70110)', 2,callback);
	this.addMarker('Attricourt (70100)', 2,callback);
	this.addMarker('Augicourt (70500)', 2,callback);
	this.addMarker('Aulx-lès-Cromary (70190)', 2,callback);
	this.addMarker('Autet (70180)', 2,callback);
	this.addMarker('Authoison (70190)', 2,callback);
	this.addMarker('Autoreille (70700)', 2,callback);
	this.addMarker('Autrey-lès-Cerre (70110)', 2,callback);
	this.addMarker('Autrey-lès-Gray (70100)', 2,callback);
	this.addMarker('Autrey-le-Vay (70110)', 2,callback);
	this.addMarker('Auvet-et-la-Chapelotte (70100)', 2,callback);
	this.addMarker('Auxon (70000)', 2,callback);
	this.addMarker('Avrigney-Virey (70150)', 2,callback);
	this.addMarker('Allerey-sur-Saône (71350)', 2,callback);
	this.addMarker('Allériot (71380)', 2,callback);
	this.addMarker('Aluze (71510)', 2,callback);
	this.addMarker('Amanzé (71610)', 2,callback);
	this.addMarker('Ameugny (71460)', 2,callback);
	this.addMarker('Anglure-sous-Dun (71170)', 2,callback);
	this.addMarker('Anost (71550)', 2,callback);
	this.addMarker('Antully (71400)', 2,callback);
	this.addMarker('Anzy-le-Duc (71110)', 2,callback);
	this.addMarker('Artaix (71110)', 2,callback);
	this.addMarker('Authumes (71270)', 2,callback);
	this.addMarker('Autun (71400)', 2,callback);
	this.addMarker('Auxy (71400)', 2,callback);
	this.addMarker('Azé (71260)', 2,callback);
	this.addMarker('Aigné (72650)', 2,callback);
	this.addMarker('Aillières-Beauvoir (72600)', 2,callback);
	this.addMarker('Allonnes (72700)', 2,callback);
	this.addMarker('Amné (72540)', 2,callback);
	this.addMarker('Ancinnes (72610)', 2,callback);
	this.addMarker('Arçonnay (72610)', 2,callback);
	this.addMarker('Ardenay-sur-Mérize (72370)', 2,callback);
	this.addMarker('Arnage (72230)', 2,callback);
	this.addMarker('Arthezé (72270)', 2,callback);
	this.addMarker('Asnières-sur-Vègre (72430)', 2,callback);
	this.addMarker('Assé-le-Boisne (72130)', 2,callback);
	this.addMarker('Assé-le-Riboul (72170)', 2,callback);
	this.addMarker('Aubigné-Racan (72800)', 2,callback);
	this.addMarker('Auvers-le-Hamon (72300)', 2,callback);
	this.addMarker('Auvers-sous-Montfaucon (72540)', 2,callback);
	this.addMarker('Avesnes-en-Saosnois (72260)', 2,callback);
	this.addMarker('Avessé (72350)', 2,callback);
	this.addMarker('Avezé (72400)', 2,callback);
	this.addMarker('Avoise (72430)', 2,callback);
	this.addMarker('Aiguebelette-le-Lac (73610)', 2,callback);
	this.addMarker('Aiguebelle (73220)', 2,callback);
	this.addMarker('Aigueblanche (73260)', 2,callback);
	this.addMarker('Aillon-le-Jeune (73340)', 2,callback);
	this.addMarker('Aillon-le-Vieux (73340)', 2,callback);
	this.addMarker('Aime (73210)', 2,callback);
	this.addMarker('Aiton (73220)', 2,callback);
	this.addMarker('Aix-les-Bains (73100)', 2,callback);
	this.addMarker('Albens (73410)', 2,callback);
	this.addMarker('Albertville (73200)', 2,callback);
	this.addMarker('Albiez-le-Jeune (73300)', 2,callback);
	this.addMarker('Albiez-Montrond (73300)', 2,callback);
	this.addMarker('Allondaz (73200)', 2,callback);
	this.addMarker('Apremont (73190)', 2,callback);
	this.addMarker('Arbin (73800)', 2,callback);
	this.addMarker('Argentine (73220)', 2,callback);
	this.addMarker('Arith (73340)', 2,callback);
	this.addMarker('Arvillard (73110)', 2,callback);
	this.addMarker('Attignat-Oncin (73610)', 2,callback);
	this.addMarker('Aussois (73500)', 2,callback);
	this.addMarker('Avressieux (73240)', 2,callback);
	this.addMarker('Avrieux (73500)', 2,callback);
	this.addMarker('Ayn (73470)', 2,callback);
	this.addMarker('Abondance (74360)', 2,callback);
	this.addMarker('Alby-sur-Chéran (74540)', 2,callback);
	this.addMarker('Alex (74290)', 2,callback);
	this.addMarker('Allèves (74540)', 2,callback);
	this.addMarker('Allinges (74200)', 2,callback);
	this.addMarker('Allonzier-la-Caille (74350)', 2,callback);
	this.addMarker('Amancy (74800)', 2,callback);
	this.addMarker('Ambilly (74100)', 2,callback);
	this.addMarker('Andilly (74350)', 2,callback);
	this.addMarker('Annecy (74000)', 2,callback);
	this.addMarker('Annecy-le-Vieux (74940)', 2,callback);
	this.addMarker('Annemasse (74100)', 2,callback);
	this.addMarker('Anthy-sur-Léman (74200)', 2,callback);
	this.addMarker('Arâches-la-Frasse (74300)', 2,callback);
	this.addMarker('Arbusigny (74930)', 2,callback);
	this.addMarker('Archamps (74160)', 2,callback);
	this.addMarker('Arenthon (74800)', 2,callback);
	this.addMarker('Argonay (74370)', 2,callback);
	this.addMarker('Armoy (74200)', 2,callback);
	this.addMarker('Arthaz-Pont-Notre-Dame (74380)', 2,callback);
	this.addMarker('Aviernoz (74570)', 2,callback);
	this.addMarker('Ayse (74130)', 2,callback);
	this.addMarker('Allouville-Bellefosse (76190)', 2,callback);
	this.addMarker('Alvimare (76640)', 2,callback);
	this.addMarker('Ambrumesnil (76550)', 2,callback);
	this.addMarker('Amfreville-la-Mi-Voie (76920)', 2,callback);
	this.addMarker('Amfreville-les-Champs (76560)', 2,callback);
	this.addMarker('Anceaumeville (76710)', 2,callback);
	this.addMarker('Ancourt (76370)', 2,callback);
	this.addMarker('Ancourteville-sur-Héricourt (76560)', 2,callback);
	this.addMarker('Ancretiéville-Saint-Victor (76760)', 2,callback);
	this.addMarker('Ancretteville-sur-Mer (76540)', 2,callback);
	this.addMarker('Angerville-Bailleul (76110)', 2,callback);
	this.addMarker('Angerville-la-Martel (76540)', 2,callback);
	this.addMarker('Angerville-l\'Orcher (76280)', 2,callback);
	this.addMarker('Angiens (76740)', 2,callback);
	this.addMarker('Anglesqueville-la-Bras-Long (76740)', 2,callback);
	this.addMarker('Anglesqueville-l\'Esneval (76280)', 2,callback);
	this.addMarker('Anneville-sur-Scie (76590)', 2,callback);
	this.addMarker('Anneville-Ambourville (76480)', 2,callback);
	this.addMarker('Annouville-Vilmesnil (76110)', 2,callback);
	this.addMarker('Anquetierville (76490)', 2,callback);
	this.addMarker('Anvéville (76560)', 2,callback);
	this.addMarker('Ardouval (76680)', 2,callback);
	this.addMarker('Argueil (76780)', 2,callback);
	this.addMarker('Arques-la-Bataille (76880)', 2,callback);
	this.addMarker('Assigny (76630)', 2,callback);
	this.addMarker('Aubéguimont (76390)', 2,callback);
	this.addMarker('Aubermesnil-aux-Érables (76340)', 2,callback);
	this.addMarker('Aubermesnil-Beaumais (76550)', 2,callback);
	this.addMarker('Auberville-la-Campagne (76170)', 2,callback);
	this.addMarker('Auberville-la-Manuel (76450)', 2,callback);
	this.addMarker('Auberville-la-Renault (76110)', 2,callback);
	this.addMarker('Auffay (76720)', 2,callback);
	this.addMarker('Aumale (76390)', 2,callback);
	this.addMarker('Auppegard (76730)', 2,callback);
	this.addMarker('Auquemesnil (76630)', 2,callback);
	this.addMarker('Authieux-Ratiéville (76690)', 2,callback);
	this.addMarker('Autigny (76740)', 2,callback);
	this.addMarker('Autretot (76190)', 2,callback);
	this.addMarker('Auvilliers (76270)', 2,callback);
	this.addMarker('Auzebosc (76190)', 2,callback);
	this.addMarker('Auzouville-Auberbosc (76640)', 2,callback);
	this.addMarker('Auzouville-l\'Esneval (76760)', 2,callback);
	this.addMarker('Auzouville-sur-Ry (76116)', 2,callback);
	this.addMarker('Auzouville-sur-Saâne (76730)', 2,callback);
	this.addMarker('Avesnes-en-Bray (76220)', 2,callback);
	this.addMarker('Avesnes-en-Val (76630)', 2,callback);
	this.addMarker('Avremesnil (76730)', 2,callback);
	this.addMarker('Achères-la-Forêt (77760)', 2,callback);
	this.addMarker('Amillis (77120)', 2,callback);
	this.addMarker('Amponville (77760)', 2,callback);
	this.addMarker('Andrezel (77390)', 2,callback);
	this.addMarker('Annet-sur-Marne (77410)', 2,callback);
	this.addMarker('Arbonne-la-Forêt (77630)', 2,callback);
	this.addMarker('Argentières (77390)', 2,callback);
	this.addMarker('Armentières-en-Brie (77440)', 2,callback);
	this.addMarker('Arville (77890)', 2,callback);
	this.addMarker('Aubepierre-Ozouer-le-Repos (77720)', 2,callback);
	this.addMarker('Aufferville (77570)', 2,callback);
	this.addMarker('Augers-en-Brie (77560)', 2,callback);
	this.addMarker('Aulnoy (77120)', 2,callback);
	this.addMarker('Avon (77210)', 2,callback);
	this.addMarker('Ablis (78660)', 2,callback);
	this.addMarker('Achères (78260)', 2,callback);
	this.addMarker('Adainville (78113)', 2,callback);
	this.addMarker('Aigremont (78240)', 2,callback);
	this.addMarker('Allainville (78660)', 2,callback);
	this.addMarker('Andelu (78770)', 2,callback);
	this.addMarker('Andrésy (78570)', 2,callback);
	this.addMarker('Arnouville-lès-Mantes (78790)', 2,callback);
	this.addMarker('Aubergenville (78410)', 2,callback);
	this.addMarker('Auffargis (78610)', 2,callback);
	this.addMarker('Auffreville-Brasseuil (78930)', 2,callback);
	this.addMarker('Aulnay-sur-Mauldre (78126)', 2,callback);
	this.addMarker('Auteuil (78770)', 2,callback);
	this.addMarker('Autouillet (78770)', 2,callback);
	this.addMarker('Adilly (79200)', 2,callback);
	this.addMarker('Aiffres (79230)', 2,callback);
	this.addMarker('Aigonnay (79370)', 2,callback);
	this.addMarker('Airvault (79600)', 2,callback);
	this.addMarker('Allonne (79130)', 3,callback);
	this.addMarker('Amailloux (79350)', 2,callback);
	this.addMarker('Amuré (79210)', 2,callback);
	this.addMarker('Arçais (79210)', 2,callback);
	this.addMarker('Ardilleux (79110)', 2,callback);
	this.addMarker('Ardin (79160)', 2,callback);
	this.addMarker('Argenton-les-Vallées (79150)', 2,callback);
	this.addMarker('Argenton-l\'Église (79290)', 2,callback);
	this.addMarker('Asnières-en-Poitou (79170)', 2,callback);
	this.addMarker('Assais-les-Jumeaux (79600)', 2,callback);
	this.addMarker('Aubigné (79110)', 2,callback);
	this.addMarker('Aubigny (79390)', 2,callback);
	this.addMarker('Augé (79400)', 2,callback);
	this.addMarker('Availles-Thouarsais (79600)', 2,callback);
	this.addMarker('Avon (79800)', 2,callback);
	this.addMarker('Azay-le-Brûlé (79400)', 2,callback);
	this.addMarker('Azay-sur-Thouet (79130)', 2,callback);
	this.addMarker('Abbeville (80100)', 2,callback);
	this.addMarker('Ablaincourt-Pressoir (80320)', 2,callback);
	this.addMarker('Acheux-en-Amiénois (80560)', 2,callback);
	this.addMarker('Acheux-en-Vimeu (80210)', 2,callback);
	this.addMarker('Agenville (80370)', 2,callback);
	this.addMarker('Agenvillers (80150)', 2,callback);
	this.addMarker('Aigneville (80210)', 2,callback);
	this.addMarker('Ailly-le-Haut-Clocher (80690)', 2,callback);
	this.addMarker('Ailly-sur-Noye (80250)', 2,callback);
	this.addMarker('Ailly-sur-Somme (80470)', 2,callback);
	this.addMarker('Airaines (80270)', 2,callback);
	this.addMarker('Aizecourt-le-Bas (80240)', 2,callback);
	this.addMarker('Aizecourt-le-Haut (80200)', 2,callback);
	this.addMarker('Albert (80300)', 2,callback);
	this.addMarker('Allaines (80200)', 2,callback);
	this.addMarker('Allenay (80530)', 2,callback);
	this.addMarker('Allery (80270)', 2,callback);
	this.addMarker('Allonville (80260)', 2,callback);
	this.addMarker('Amiens (80000)', 2,callback);
	this.addMarker('Andainville (80140)', 2,callback);
	this.addMarker('Andechy (80700)', 2,callback);
	this.addMarker('Argœuves (80730)', 2,callback);
	this.addMarker('Argoules (80120)', 2,callback);
	this.addMarker('Arguel (80140)', 2,callback);
	this.addMarker('Armancourt (60880)', 2,callback);
	this.addMarker('Arquèves (80560)', 2,callback);
	this.addMarker('Arrest (80820)', 2,callback);
	this.addMarker('Arry (80120)', 2,callback);
	this.addMarker('Arvillers (80910)', 2,callback);
	this.addMarker('Assainvillers (80500)', 2,callback);
	this.addMarker('Assevillers (80200)', 2,callback);
	this.addMarker('Athies (80200)', 2,callback);
	this.addMarker('Aubercourt (80110)', 2,callback);
	this.addMarker('Aubigny (80800)', 2,callback);
	this.addMarker('Aubvillers (80110)', 2,callback);
	this.addMarker('Auchonvillers (80560)', 2,callback);
	this.addMarker('Ault (80460)', 2,callback);
	this.addMarker('Aumâtre (80140)', 2,callback);
	this.addMarker('Aumont (80640)', 2,callback);
	this.addMarker('Autheux (80600)', 2,callback);
	this.addMarker('Authie (80560)', 2,callback);
	this.addMarker('Authieule (80600)', 2,callback);
	this.addMarker('Authuille (80300)', 2,callback);
	this.addMarker('Avelesges (80270)', 2,callback);
	this.addMarker('Aveluy (80300)', 2,callback);
	this.addMarker('Avesnes-Chaussoy (80140)', 2,callback);
	this.addMarker('Ayencourt (80500)', 2,callback);
	this.addMarker('Aguts (81470)', 2,callback);
	this.addMarker('Aiguefonde (81200)', 2,callback);
	this.addMarker('Alban (81250)', 2,callback);
	this.addMarker('Albi (81000)', 2,callback);
	this.addMarker('Albine (81240)', 2,callback);
	this.addMarker('Algans (81470)', 2,callback);
	this.addMarker('Alos (81140)', 2,callback);
	this.addMarker('Almayrac (81190)', 2,callback);
	this.addMarker('Amarens (81170)', 2,callback);
	this.addMarker('Ambialet (81430)', 2,callback);
	this.addMarker('Ambres (81500)', 2,callback);
	this.addMarker('Andillac (81140)', 2,callback);
	this.addMarker('Andouque (81350)', 2,callback);
	this.addMarker('Anglès (81260)', 2,callback);
	this.addMarker('Appelle (81700)', 2,callback);
	this.addMarker('Arfons (81110)', 2,callback);
	this.addMarker('Arifat (81360)', 2,callback);
	this.addMarker('Arthès (81160)', 2,callback);
	this.addMarker('Assac (81340)', 2,callback);
	this.addMarker('Aussac (81600)', 2,callback);
	this.addMarker('Aussillon (81200)', 2,callback);
	this.addMarker('Albefeuille-Lagarde (82290)', 2,callback);
	this.addMarker('Albias (82350)', 2,callback);
	this.addMarker('Angeville (82210)', 2,callback);
	this.addMarker('Asques (82120)', 2,callback);
	this.addMarker('Aucamville (82600)', 2,callback);
	this.addMarker('Auterive (82500)', 2,callback);
	this.addMarker('Auty (82220)', 2,callback);
	this.addMarker('Auvillar (82340)', 2,callback);
	this.addMarker('Aiguines (83630)', 2,callback);
	this.addMarker('Ampus (83111)', 2,callback);
	this.addMarker('Artignosc-sur-Verdon (83630)', 2,callback);
	this.addMarker('Artigues (83560)', 2,callback);
	this.addMarker('Aups (83630)', 2,callback);
	this.addMarker('Althen-des-Paluds (84210)', 2,callback);
	this.addMarker('Ansouis (84240)', 2,callback);
	this.addMarker('Apt (84400)', 2,callback);
	this.addMarker('Aubignan (84810)', 2,callback);
	this.addMarker('Aurel (84390)', 2,callback);
	this.addMarker('Auribeau (84400)', 2,callback);
	this.addMarker('Avignon (84000)', 2,callback);
	this.addMarker('Aizenay (85190)', 2,callback);
	this.addMarker('Angles (85750)', 2,callback);
	this.addMarker('Antigny (85120)', 2,callback);
	this.addMarker('Apremont (85220)', 2,callback);
	this.addMarker('Aubigny (85430)', 2,callback);
	this.addMarker('Auzay (85200)', 2,callback);
	this.addMarker('Avrillé (85440)', 2,callback);
	this.addMarker('Adriers (86430)', 2,callback);
	this.addMarker('Amberre (86110)', 2,callback);
	this.addMarker('Anché (86700)', 2,callback);
	this.addMarker('Angles-sur-l\'Anglin (86260)', 2,callback);
	this.addMarker('Angliers (17540)', 2,callback);
	this.addMarker('Antigny (86310)', 2,callback);
	this.addMarker('Antran (86100)', 2,callback);
	this.addMarker('Arçay (86200)', 2,callback);
	this.addMarker('Archigny (86210)', 2,callback);
	this.addMarker('Aslonnes (86340)', 2,callback);
	this.addMarker('Asnières-sur-Blour (86430)', 2,callback);
	this.addMarker('Asnois (86250)', 2,callback);
	this.addMarker('Aulnay (86330)', 2,callback);
	this.addMarker('Availles-en-Châtellerault (86530)', 2,callback);
	this.addMarker('Availles-Limouzine (86460)', 2,callback);
	this.addMarker('Avanton (86170)', 2,callback);
	this.addMarker('Ayron (86190)', 2,callback);
	this.addMarker('Aixe-sur-Vienne (87700)', 2,callback);
	this.addMarker('Ambazac (87240)', 2,callback);
	this.addMarker('Arnac-la-Poste (87160)', 2,callback);
	this.addMarker('Augne (87120)', 2,callback);
	this.addMarker('Aureil (87220)', 2,callback);
	this.addMarker('Azat-le-Ris (87360)', 2,callback);
	this.addMarker('Ahéville (88500)', 2,callback);
	this.addMarker('Aingeville (88140)', 2,callback);
	this.addMarker('Ainvelle (88320)', 2,callback);
	this.addMarker('Allarmont (88110)', 2,callback);
	this.addMarker('Ambacourt (88500)', 2,callback);
	this.addMarker('Ameuvelle (88410)', 2,callback);
	this.addMarker('Anglemont (88700)', 2,callback);
	this.addMarker('Anould (88650)', 2,callback);
	this.addMarker('Aouze (88170)', 2,callback);
	this.addMarker('Arches (88380)', 2,callback);
	this.addMarker('Archettes (88380)', 2,callback);
	this.addMarker('Aroffe (88170)', 2,callback);
	this.addMarker('Arrentès-de-Corcieux (88430)', 2,callback);
	this.addMarker('Attignéville (88300)', 2,callback);
	this.addMarker('Attigny (88260)', 2,callback);
	this.addMarker('Aulnois (88300)', 2,callback);
	this.addMarker('Aumontzey (88640)', 2,callback);
	this.addMarker('Autigny-la-Tour (88300)', 2,callback);
	this.addMarker('Autreville (88300)', 2,callback);
	this.addMarker('Autrey (88700)', 2,callback);
	this.addMarker('Auzainvilliers (88140)', 2,callback);
	this.addMarker('Avillers (88500)', 2,callback);
	this.addMarker('Avrainville (88130)', 2,callback);
	this.addMarker('Avranville (88630)', 2,callback);
	this.addMarker('Aydoilles (88600)', 2,callback);
	this.addMarker('Accolay (89460)', 2,callback);
	this.addMarker('Aigremont (89800)', 2,callback);
	this.addMarker('Aillant-sur-Tholon (89110)', 2,callback);
	this.addMarker('Aisy-sur-Armançon (89390)', 2,callback);
	this.addMarker('Ancy-le-Franc (89160)', 2,callback);
	this.addMarker('Ancy-le-Libre (89160)', 2,callback);
	this.addMarker('Andryes (89480)', 2,callback);
	this.addMarker('Angely (89440)', 2,callback);
	this.addMarker('Annay-la-Côte (89200)', 3,callback);
	this.addMarker('Annay-sur-Serein (89310)', 2,callback);
	this.addMarker('Annéot (89200)', 2,callback);
	this.addMarker('Annoux (89440)', 2,callback);
	this.addMarker('Appoigny (89380)', 2,callback);
	this.addMarker('Arces-Dilo (89320)', 2,callback);
	this.addMarker('Arcy-sur-Cure (89270)', 2,callback);
	this.addMarker('Argentenay (89160)', 2,callback);
	this.addMarker('Argenteuil-sur-Armançon (89160)', 2,callback);
	this.addMarker('Armeau (89500)', 2,callback);
	this.addMarker('Arthonnay (89740)', 2,callback);
	this.addMarker('Asnières-sous-Bois (89660)', 2,callback);
	this.addMarker('Asquins (89450)', 2,callback);
	this.addMarker('Athie (21500)', 2,callback);
	this.addMarker('Augy (89290)', 2,callback);
	this.addMarker('Auxerre (89000)', 2,callback);
	this.addMarker('Avallon (89200)', 2,callback);
	this.addMarker('Andelnans (90400)', 2,callback);
	this.addMarker('Angeot (90150)', 2,callback);
	this.addMarker('Anjoutey (90170)', 2,callback);
	this.addMarker('Argiésans (90800)', 2,callback);
	this.addMarker('Auxelles-Bas (90200)', 2,callback);
	this.addMarker('Auxelles-Haut (90200)', 2,callback);
	this.addMarker('Autrechêne (90140)', 2,callback);
	this.addMarker('Abbéville-la-Rivière (91150)', 2,callback);
	this.addMarker('Angerville (91670)', 2,callback);
	this.addMarker('Angervilliers (91470)', 2,callback);
	this.addMarker('Arpajon (91290)', 2,callback);
	this.addMarker('Arrancourt (91690)', 2,callback);
	this.addMarker('Athis-Mons (91200)', 2,callback);
	this.addMarker('Authon-la-Plaine (91410)', 2,callback);
	this.addMarker('Auvernaux (91830)', 2,callback);
	this.addMarker('Auvers-Saint-Georges (91580)', 2,callback);
	this.addMarker('Avrainville (91630)', 2,callback);
	this.addMarker('Antony (92160)', 2,callback);
	this.addMarker('Asnières-sur-Seine (92600)', 2,callback);
	this.addMarker('Aubervilliers (93300)', 2,callback);
	this.addMarker('Aulnay-sous-Bois (93600)', 2,callback);
	this.addMarker('Ablon-sur-Seine (94480)', 2,callback);
	this.addMarker('Alfortville (94140)', 2,callback);
	this.addMarker('Arcueil (94110)', 2,callback);
	this.addMarker('Ableiges (95450)', 2,callback);
	this.addMarker('Aincourt (95510)', 2,callback);
	this.addMarker('Ambleville (95710)', 2,callback);
	this.addMarker('Amenucourt (95510)', 2,callback);
	this.addMarker('Andilly (95580)', 3,callback);
	this.addMarker('Argenteuil (95100)', 2,callback);
	this.addMarker('Arnouville-lès-Gonesse (95400)', 2,callback);
	this.addMarker('Arronville (95810)', 2,callback);
	this.addMarker('Arthies (95420)', 2,callback);
	this.addMarker('Asnières-sur-Oise (95270)', 2,callback);
	this.addMarker('Attainville (95570)', 2,callback);
	this.addMarker('Auvers-sur-Oise (95760)', 2,callback);
	this.addMarker('Avernes (95450)', 2,callback);
	this.addMarker('Anse-Bertrand (97121)', 2,callback);
	this.addMarker('Apatou (97317)', 2,callback);
	this.addMarker('Awala-Yalimapo (97319)', 2,callback);
	this.addMarker('Acoua (97630)', 3,callback);
	this.addMarker('Alo (98610)', 2,callback);
	this.addMarker('Anaa (98760)', 2,callback);
	this.addMarker('Arue (40120)', 2,callback);
	this.addMarker('Arutua (98761)', 2,callback);
	this.addMarker("Ambérieu-en-Bugey (01500)", 3,callback);
};