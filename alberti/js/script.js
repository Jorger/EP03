$(function()
{  
	$('#disco_1').circleType();  
	$('#disco_2').circleType();
	var accionRealiza = 1;
	var valGirosDiscos = [
						{
							giro : 0, 
							letraInicio : 90
						}, 
						{
							giro : 0, 
							letraInicio : 90
						}, 
					];	
	//Ahora se debeerá capturar los eventos de los range...
	for(var i = 1; i <= 2; i++)
	{
		$("#opcion_" + i).change(function(event)
		{			
			var ind = event.target.id.split("_");
			var giro = Math.round($(this).val());			
			girarDisco(ind[1], giro);
		});
	}

	$("#accionCifra").change(function(event)
	{		
		accionRealiza = $(this).val();
		$("#opcion_1").val(0);
		$("#opcion_2").val(0);
		girarDisco(1, 0);
		girarDisco(2, 0);
		$("#cifra").val("");
		$("#resultado").html("");
	});

	$("#cifra").keyup(function(event)
	{
		alberti($(this).val());		
	});	

	var girarDisco = function(disco, giro)
	{
		var nomDiscos = ["Disco Externo", "Disco Interno"];
		var nomDisco = "#disco_" + disco;
		valGirosDiscos[disco - 1].giro = giro;
		valGirosDiscos[disco - 1].letraInicio = (90 - (giro / 14));
		$("#tirang_" + disco).html(nomDiscos[disco - 1] + " ("+giro+"º)");
		$(nomDisco).animate({  borderSpacing: giro },
		{
	    	step: function(now,fx)
	    	{
	      		$(this).css('-webkit-transform','rotate('+now+'deg)'); 
	      		$(this).css('-moz-transform','rotate('+now+'deg)');
	      		$(this).css('transform','rotate('+now+'deg)');
	    	},
	    	complete : function()
	    	{	    			    		
	    		alberti($("#cifra").val());
	    	},
	    	duration:'slow'
		},'linear');
	};

	var alberti = function(txt)
	{
		if(txt.length > 0)
		{		
			txt = txt.toUpperCase();			
			var newFrase = "";
			for(var i = 0; i < txt.length; i++)
			{
				if(txt.charAt(i) != " ")
				{
					newFrase += buscarPalabra(txt.charCodeAt(i));
				}
				else
				{
					newFrase += " ";
				}
			}
			$("#resultado").html(newFrase);
		}
		else
		{
			buscarPalabra(0);
		}
	};

	var buscarPalabra = function(ascciPalabra)
	{		
		var txt1 = "";
		var txt2 = "";
		var iniDiscoUno = valGirosDiscos[0].letraInicio;
		var iniDiscoDos = valGirosDiscos[1].letraInicio;
		var letraEs = "";
		var encuentra = false;
		for(var i = 1; i <= 26; i++)
		{			
			iniDiscoUno++;
			iniDiscoDos++;
			if(iniDiscoUno > 90)
			{
				iniDiscoUno = 65;
			}
			if(iniDiscoDos > 90)
			{
				iniDiscoDos = 65;
			}
			if(accionRealiza == 1)
			{
				if(iniDiscoUno === ascciPalabra && !encuentra)
				{
					letraEs = String.fromCharCode(iniDiscoDos);
					encuentra = true;
				}
			}
			else
			{
				if(iniDiscoDos === ascciPalabra && !encuentra)
				{
					letraEs = String.fromCharCode(iniDiscoUno);
					encuentra = true;
				}
			}
			txt1 += String.fromCharCode(iniDiscoUno);						
			txt2 += String.fromCharCode(iniDiscoDos);					
		}
		$("#alfabeto").html(txt1 + "<br>" + txt2);		
		return letraEs;		
	};
	buscarPalabra(0);
});