window.onload = function()
{
	inicio();
};

function inicio()
{
	var accionCifrado = 1;
	var matrizAlfabeto = [];
	var descifraTxt = "";
	var crearAlfabeto = function(tipo)
	{
		//Crear la 03 tablas del alfabeto...
		tablas = ["", "", ""];
		var letraInicia = 65;
		var letra = "";
		var divElemento = "";
		var contTabla = 1;
		var ind = 0;
		var devuelve = "";
		var nomClase = "";
		var letraMuestra = "";
		for(var i = 1; i <= 3; i++)
		{
			for(c = 1; c <= 9; c++)
			{
				letra = String.fromCharCode(letraInicia);
				matrizAlfabeto.push(letra);
				if(c <= 3)
				{
					ind = 0;
					if(c == 1)
					{
						tablas[0] += "<tr>";
					}
				}
				else
				{
					if(c <= 6)
					{
						ind = 1;
						if(c == 4)
						{
							tablas[0] += "</tr>";
							tablas[1] += "<tr>";
						}
					}
					else
					{
						ind = 2;
						if(c == 7)
						{
							tablas[1] += "</tr>";
							tablas[2] += "<tr>";
						}
					}
				}
				divElemento = "a_" + contTabla;
				nomClase = "baseAlfabeto mason-" + letra.toLowerCase();
				if(tipo == 1)
				{
					letraMuestra = letra;
				}
				tablas[ind] += "<td id = '"+(divElemento)+"' class = '"+(nomClase)+"'><br>"+letraMuestra+"</td>";
				contTabla++;
				if(letraInicia == 78)
				{
					matrizAlfabeto.push("Ñ");
					divElemento = "a_" + contTabla;
					if(tipo == 1)
					{
						tablas[ind] += "<td id = '"+(divElemento)+"' class = 'baseAlfabeto mason-ene'><br>Ñ</td>";
					}
					else
					{
						tablas[ind] += "<td id = '"+(divElemento)+"' class = 'baseAlfabeto mason-ene'></td>";
					}
					c++;
					contTabla++;
				}
				letraInicia++;
				if(c == 9)
				{
					tablas[2] += "</tr>";
				}
			}
		}
		//console.log("Valor es: " + contTabla);
		devuelve = "<table width = '100%'' border = '0' cellspacing = '0' cellpadding = '0'><tr>";
		for(var i = 0; i < 3; i++)
		{
			tablas[i] = "<table id='chess_board' cellpadding='0' cellspacing='0'>" + tablas[i] + "</table>";
			devuelve += "<td><center>"+(tablas[i])+"</center></td>";
		}
		devuelve += "</tr></table>";
		return devuelve;
	};
	//crearAlfabeto();
	nom_div("alfabetomason").innerHTML = crearAlfabeto(1);
	

	var masonCifra = function(texto)
	{
		//console.clear();
		texto = texto.toUpperCase(); //Mayúsculas...
		var letra = "";
		var cifraes = "";
		var nomClase = "";
		for(var i = 0; i < texto.length; i++)
		{
			letra = texto.charAt(i);
			//console.log(letra);
			if(texto.charCodeAt(i) != 160 && texto.charCodeAt(i) != 32)
			{
				//console.log(letra +" == " + texto.charCodeAt(i));
				if(letra !== "Ñ")
				{
					nomClase = "baseAlfabeto mason-" + letra.toLowerCase();
				}
				else
				{
					nomClase = "baseAlfabeto mason-ene";
				}
				cifraes += "<div class = 'cifraAlfa "+(nomClase)+"'></div>";
			}
		}
		return cifraes;
	}

	nom_div("texto").addEventListener('keyup', function(event)
	{
		if(this.value.length != 0)
		{
			if(accionCifrado === 1)
			{
				nom_div("cifra").innerHTML = masonCifra(this.value);
			}
		}
		
		else
		{
			nom_div("cifra").innerHTML = "Cifra final";
		}
	});

	var tablaAcciones = function()
	{
		//Poner acciones de Click sobre la tabla...
		for(var i = 1; i <= 27; i++)
		{
			nom_div("a_" + i).addEventListener("click", function(event)
			{
				var ind = event.target.id.split("_");
				descifraTxt += matrizAlfabeto[Number(ind[1] - 1)];
				nom_div("texto").value = descifraTxt;
				muestraDescifra();
			});
		}
	};


	var muestraDescifra = function()
	{
		var letra = "";
		var nomClase = "";
		var cifraes = "";
		for(var i = 0; i < descifraTxt.length; i++)
		{
			letra = descifraTxt.charAt(i);
			//console.log(letra +" == " + descifraTxt.charCodeAt(i));
			if(letra !== "Ñ")
			{
				nomClase = "baseAlfabeto mason-" + letra.toLowerCase();
			}
			else
			{
				nomClase = "baseAlfabeto mason-ene";
			}
			cifraes += "<div class = 'cifraAlfa "+(nomClase)+"'></div>";
		}
		nom_div("cifra").innerHTML = cifraes;
	};
	

	/*var buscarLetra = function()
	{
		for(var i in )
	};
*/

	nom_div("accionCifra").addEventListener('change', function(event)
	{
		accionCifrado = Number(this.value);
		nom_div("texto").value = "";
		nom_div("cifra").innerHTML = "Cifra final";
		descifraTxt = "";
		if(accionCifrado === 2)
		{
			nom_div("texto").disabled = true;
			nom_div("alfabetomason").innerHTML = crearAlfabeto(2);
			tablaAcciones();
		}
		else
		{
			nom_div("texto").disabled = false;
			nom_div("texto").focus();
			nom_div("alfabetomason").innerHTML = crearAlfabeto(1);
		}
	});

	nom_div("borrador").addEventListener("click", function(event)
	{
		if(descifraTxt.length > 0)
		{
			descifraTxt = descifraTxt.substr(0, descifraTxt.length - 1);
			nom_div("texto").value = descifraTxt;
			muestraDescifra();
		}
		else
		{
			console.log("No hay letras");
		}
	});

	function nom_div(div)
	{
		return document.getElementById(div);
	}
}