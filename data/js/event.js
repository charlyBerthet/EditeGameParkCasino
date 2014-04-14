////////////////////////////
// FUNCTIONS
////////////////////////////


// RETOURNE LA TAILLE DES MARGINS
var getMarginButtons = function(){
	// SIZE DES MARGINS
	var SCREEN_WIDTH = (window.innerWidth) - 5;
	var SCREEN_HEIGHT = (window.innerHeight) - 3;
	var HEIGHT_PARAMS = 60;
	var totalWidth = 0;
		// on calcule la taille total des div parametres
	$(".parametre").each(function(){
		totalWidth += parseFloat( $(this).css("width").substr(0, $(this).css("width").length - 2 ) );
		totalWidth += parseFloat( $(this).css("padding-left").substr(0, $(this).css("padding-left").length - 2 ) );
		totalWidth += parseFloat( $(this).css("padding-right").substr(0, $(this).css("padding-right").length - 2 ) );
		totalWidth += parseFloat( $(this).css("border-right-width").substr(0, $(this).css("border-right-width").length - 2 ) );
		totalWidth += parseFloat( $(this).css("border-left-width").substr(0, $(this).css("border-left-width").length - 2 ) );
	});
	
	var NB_BUTTON = parseFloat($(".parametre").length);	
	return parseFloat(( (SCREEN_WIDTH - totalWidth) / NB_BUTTON ) /2  - 6); // -6 => Marge d'erreur sinon retour a la Ligne	
};




// REDIMENSIONNE LA FENETRE
var resizeDiv = function(option){
	var SCREEN_WIDTH = (window.innerWidth) - 5;
	var SCREEN_HEIGHT = (window.innerHeight) - 3;
	var HEIGHT_PARAMS = 60;
	var showIcon = false;
	
		// display
	$("#divParametrage .parametre").css("display","inline-block");
	$("#autoSave, #onoffswitch, #divParcDeJeu").css("display","block");
	if($("#divParametrage").css("display") != 'none')
		$("#divParametrage").css("display","block");
	//Opacity
	$(".slideOpacity").css({"opacity":"1"});
		// margin
	$(".parametre").css('position','relative');
		// font-size
	$("#autoSave,.butParametre").css("font-size","10pt");
		// padding
	$(".butParametre").css("padding","2px 7px");
	
	
		// height
	$("#divParametrage").css("height",(HEIGHT_PARAMS)+"px");
	$("#divParcDeJeu,#parcDeJeu").css("height",($("#divParametrage").css("display") == 'none' && option != "slideDown"? SCREEN_HEIGHT : SCREEN_HEIGHT - HEIGHT_PARAMS));
		// width
	$("#divParcDeJeu,#parcDeJeu,#divParametrage").css("width",SCREEN_WIDTH);
	$(".butParametre").css({
		width:"150px",
		height:"30px"
	});
	
	// On affiche le contenu des boutons 
	$("#divParametrage .parametre .butParametre").each(function(){
		$(this).val($(this).attr('data-content'));
		$(this).css("background-image","none");
	});
	
	// FORMAT DES BUTTONS
	var MARGINS = getMarginButtons();
	var MARGIN_TOP_DEFAULT = 15;
	
	// en fontion du margin on change la taille de police OU on affiche les icons
	if(MARGINS >= 0){
		$(".parametre").css("margin",MARGIN_TOP_DEFAULT+"px "+( MARGINS )+"px");
		
	} else if(MARGINS >= -4){
		$("#autoSave,.butParametre").css("font-size","9pt");
		$(".butParametre").css({
			width:"130px",
			height:"30px"
		});
		$(".parametre").css("margin",MARGIN_TOP_DEFAULT+"px "+( getMarginButtons() )+"px");
	} else if(MARGINS >= -8){
		$("#autoSave,.butParametre").css("font-size","8pt");
		$(".butParametre").css({
			width:"110px",
			height:"30px"
		});
		$(".parametre").css("margin",MARGIN_TOP_DEFAULT+"px "+( getMarginButtons() )+"px");
	} else if(MARGINS >= -18) {
		$(".butParametre").css("padding","5px 30px");
		$(".butParametre").css({
			width:"100px",
			height:"30px"
		});
		showIcon = true;
	} else if(MARGINS >= -22) {
		$(".butParametre").css("padding","5px 25px");
		$(".butParametre").css({
			width:"80px",
			height:"30px"
		});
		showIcon = true;
	} else if(MARGINS >= -33) {
		$(".butParametre").css("padding","5px 20px");
		$(".butParametre").css({
			width:"60px",
			height:"30px"
		});
		showIcon = true;
	} else if(MARGINS >= -40) {
		$(".butParametre").css("padding","2px 15px");
		$(".butParametre").css({
			width:"40px",
			height:"30px"
		});
		showIcon = true;
	} else{
		$(".butParametre").css("padding","2px 10px");
		$(".butParametre").css({
			width:"30px",
			height:"30px"
		});
		showIcon = true;
	}
	
	
	
	// BUTTON VALUE
	if(showIcon == false){
		
	}else{
		
		
		$("#divParametrage .parametre .butParametre").each(function(){
			$(this).val("");
			var url = $(this).attr('data-image');
			$(this).css("background-image","url("+url+")");
			$(this).css("background-repeat","no-repeat");
			$(this).css("background-position","center");
		});
		$(".parametre").css("margin","15px "+( getMarginButtons() )+"px");
	}
		
	
	// Margin propre a l'autoSave
	$("#paramAutoSave").css("margin-top","0px");
	
};









// RESIZE GOOGLE MAP
var resizeMap = function(){
	var SCREEN_WIDTH = (window.innerWidth);
	var SCREEN_HEIGHT = (window.innerHeight) - 3;
	$("#divGoogleMap").css("height",(SCREEN_HEIGHT)+"px");
	$("#divGoogleMap").css("width",(SCREEN_WIDTH)+"px");
};




// VALIDE ACTION EFFECTUE
var validItsDone = function(elem,time1,time2,time3,callback){
	var func = callback || function(){};
	var t1 = time1 || 600;
	var t2 = time2 || 800;
	var t3 = time3 || 500;
	var bgColor = elem.css('background-color');
	elem.animate({
		"background-color":"rgba(80,200,100,1)"
	},t1,function(){
		setTimeout(function(){
			elem.animate({
				"background-color":bgColor
			},t2,func);
		},t3);
	});
};




////////////////////////////
// EVENEMENTS
////////////////////////////



//ENTER RACCOURCIS
$(document).keydown(function(event){
	
	// ENTRER
	if(event.which == 13){
		
		// SI FOCUS ALORS VALIDE
		if( $("#nbEmplacementHauteur").is(":focus") )
			$("#butValidNbEmplacement").click();
		
	}		
});



$(function(){
	
	// HOVER DIV PARAMETRAGE
	$("#divParametrage,#openOrCloseDivParametre").hover(function(){
		$("#openOrCloseDivParametre").css({"opacity":"1"});
	},function(){
		$("#openOrCloseDivParametre").css({"opacity":"0"});
	});
	
	
	
	// CLICK CACHE DIV PARAMETRE
	$("#openOrCloseDivParametre").click(function(){
		if($("#divParametrage").css("display") == "none"){
			resizeDiv("slideDown");
			$("#divParametrage").slideDown(400,function(){
				resizeDiv();
			});
			$(".slideOpacity").animate({"opacity":"1"},1500);
		}else{
			$("#divParametrage").slideUp(400,function(){
				resizeDiv();
			});
			$(".slideOpacity").animate({"opacity":"0"},400);
			
		}
	});
});


