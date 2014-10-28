window.onload = function()
{
	inicio();
}

function inicio()
{
	var accionCifrado = 1;
	nom_div("texto").addEventListener('keyup', function(event)
	{
		if(this.value.length != 0)
		{
			if(accionCifrado === 1)
			{
				nom_div("cifra").innerHTML = vernanCifra(this.value);
			}
			else
			{
				nom_div("cifra").innerHTML = vernanDescifra(this.value);
			}
		}
		else
		{
			nom_div("cifra").innerHTML = "Cifra final";
			nom_div("tabla").innerHTML = "Cifra final";
			nom_div("clave").value = "";
		}
	});

	var vernanCifra = function(texto)
	{
		texto = texto.toUpperCase(); //Mayúsculas...
		var newClave = "";
		var claveAleatoria = 0;
		var letra = "";
		var xorTexto = "";
		var xorClave = "";
		var mc = "";
		var cl = "";
		var cifra = "";
		var criptoFinal = "";
		var operaXor = "";
		for(var i = 0; i < texto.length; i++)
		{
			letra = texto.charAt(i);
			if(letra != " ")
			{
				//Generar la clave para la letra...
				claveAleatoria = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
				newClave += String.fromCharCode(claveAleatoria);
				xorTexto = texto.charCodeAt(i).toString(2);
				xorClave = claveAleatoria.toString(2);
				operaXor = xorOperacion(xorTexto, xorClave);
				mc += xorTexto;
				cl += xorClave;
				cifra += operaXor;
				//console.log("Covierte: " + operaXor + " Ver: " + parseInt(operaXor, 2));
				//criptoFinal += parseInt(operaXor, 2);
			}
			else
			{
				newClave += " ";
				mc += " ";
				cl += " ";
				cifra += " ";
				criptoFinal += " ";
			}
		}
		nom_div("clave").value = newClave;
		nom_div("tabla").innerHTML = mc + "<hr>" + cl;
		return cifra;
		//nom_div("cifra").innerHTML = criptoFinal;
	};
	//00110100011100001101000100000011111 0001011000111000111100000101 000010100101010010110
	//VUIDP DZLD SPL
	var vernanDescifra = function(texto)
	{
		binario = [];
		var parte = texto.split(" ");
		var totalBinario = 0;
		var segmenta = 0;
		for(var i in parte)
		{
			totalBinario = parte[i].length / 7;
			segmenta = 0;
			//console.log(i + " == " + totalBinario);
			for(var c = 1; c <= totalBinario; c++)
			{
				//console.log("Segmenta es: " + segmenta);
				binario.push(parte[i].substr(segmenta, 7));
				segmenta += 7;
			}
		}
		//Ahora recorrer la clave...
		var claveTxt = nom_div("clave").value;
		var xorClave = "";
		var descifra = "";
		var operaXor = "";
		var indBinario = 0;
		var mc = "";
		var cl = "";
		claveTxt = claveTxt.toUpperCase();
		for(var i = 0; i < claveTxt.length; i++)
		{
			if(claveTxt.charAt(i) != " ")
			{
				xorClave = claveTxt.charCodeAt(i).toString(2); //Covierte a Binario...
				xorCifra = binario[indBinario];
				operaXor = xorOperacion(xorCifra, xorClave);
				//console.log(xorClave + " Y " + xorCifra);
				indBinario++;
				descifra += String.fromCharCode(parseInt(operaXor, 2));
				mc += xorClave;
				cl += xorCifra;
			}
			else
			{
				descifra += " ";
			}
		}
		nom_div("tabla").innerHTML = mc + "<hr>" + cl;
		return descifra;
	};


	var xorOperacion = function(binarioUno, binarioDos)
	{
		var a = 0;
		var b = 0;
		var salida = "";
		for(var i = 0; i < binarioUno.length; i++)
		{
			a = Number(binarioUno.charAt(i));
			b = Number(binarioDos.charAt(i));
			if((a === 0 && b === 0) || (a === 1 && b === 1))
			{
				salida += "0";
			}
			else
			{
				salida += "1";
			}
		}
		return salida;
	};

	nom_div("accionCifra").addEventListener('change', function(event)
	{
		accionCifrado = Number(this.value);
	});

	function nom_div(div)
	{
		return document.getElementById(div);
	}	
}