window.onload = function()
{
	inicio();
}

function inicio()
{
	var descifra = false;
	function codifica(descifrar)
	{
		var NumeroText  = nom_div("caja_2").value;
		var numPosiciones = Number(NumeroText);
		if (numPosiciones < 0 || numPosiciones >= 1000)
		{
			alert("Está fuera de rango");
		}
		if(descifrar)
		{
			numPosiciones = (26 - numPosiciones) % 1000;
		}
		var textoOpera = nom_div("caja_1").value;
		nom_div("tabla").innerHTML = realizaCesar(textoOpera, numPosiciones);
	}
	
	function realizaCesar(texto, numMueve)
	{
		texto = texto.toUpperCase();
		var salida = "";
		for (var i = 0; i < texto.length; i++) 
		{
			if(texto.charAt(i) != " ")
			{
				var j = texto.charCodeAt(i);
				salida += String.fromCharCode((j - 65 + numMueve) % 26 + 65);
			}
			else
			{
				salida += " ";
			}
		}
		return salida; 
	}

	nom_div("caja_1").addEventListener('keyup', function(event)
	{
		codifica(descifra);
	});

	nom_div("accion").addEventListener('change', function(event)
	{
		if(this.value == 1)
		{
			descifra = false;
		}
		else
		{
			descifra = true;
		}
		nom_div("caja_1").value = "";
		nom_div("tabla").innerHTML = "";
	});
	
	function nom_div(id)
	{
		return document.getElementById(id);
	}
}
 
