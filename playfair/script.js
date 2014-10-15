window.onload = function()
{
	inicio();
}

function inicio()
{
	MatrizPlayFair = [];
	var cifraraMensaje = true;
	var creaTabla = function()
	{
		var txt = "<table id = 'tablero' cellpadding = '0' cellspacing = '0'>";
		var divTabla = "";
		var contFila = 1;
		var contColumna = 1;
		var txtContiene = "";
		var especial = false;
		for(var i = 0; i < 6; i++)
		{
			txt += "<tr>";
			if(i >= 1)
			{
				MatrizPlayFair.push([]);
			}
			for(var c = 0; c < 6; c++)
			{
				txtContiene = "";	
				if(i === 0 && c > 0)
				{
					txtContiene = contFila;
					contFila++;
				}
				if(c === 0 && i > 0)
				{
					txtContiene = contColumna;
					contColumna++;
				}
				if(i >= 1 && c >= 1)
				{
					MatrizPlayFair[i - 1][c - 1] = {};
					//console.log((i - 1)+" Y "+(c - 1));
				}
				divTabla = i + "_" + c;
				txt += "<td id = '"+(divTabla)+"'>"+(txtContiene)+"</td>";
			}
			txt += "</tr>";
		}
		txt += "</table>";
		return txt;
	};

	var existeLetra = function(letra)
	{
		var parteLetra = "";
		var existe = false;
		var nohayDato = false;
		for(var i = 0; i < 5; i++)
		{
			for(var c = 0 ; c < 5; c++)
			{
				if(MatrizPlayFair[i][c].letra != undefined)
				{
					if(MatrizPlayFair[i][c].especial)
					{
						parteLetra = MatrizPlayFair[i][c].letra.split("/");
						if(parteLetra[0] === letra || parteLetra[1] === letra)
						{
							existe = true;
							break;
						}
					}
					else
					{
						if(MatrizPlayFair[i][c].letra === letra)
						{
							existe = true;
							break;
						}
					}
				}
				else
				{
					nohayDato = true;
					break;
				}
			}
			if(existe || nohayDato)
			{
				break;
			}
		}
		return existe;
	};

	var llenarMatriz = function()
	{
		var PrimeraLetra = 65; //Para la letra A mayúscula...
		var txtLetra = "";
		var divTabla = "";
		var existe = false;
		for(i = 0; i < 5; i++)
		{
			for(c = 0; c < 5; c++)
			{
				//Se debe saber si la letra ya estaba guardada en el
				//Si están libres o no...
				if(MatrizPlayFair[i][c].letra === undefined)
				{
					do
					{
						if(PrimeraLetra !== 73 && PrimeraLetra !== 78)
						{
							txtLetra = String.fromCharCode(PrimeraLetra);
							existe = existeLetra(txtLetra);
							PrimeraLetra++;
							especial = false;
						}
						else
						{
							especial = true;
							if(PrimeraLetra === 73)//Validar la I y al J
							{
								txtLetra = "I/J";
								existe = existeLetra("I") || existeLetra("J");
								PrimeraLetra = 75;
							}
							else
							{
								txtLetra = "N/Ñ";
								existe = existeLetra("N") || existeLetra("Ñ");
								PrimeraLetra++;
							}
						}
						if(!existe)
						{
							break;
						}
					}while(1);
					//console.log((i - 1) + "Y " +(c - 1));
					MatrizPlayFair[i][c] = {letra: txtLetra, especial: especial};
					divTabla = Number(i + 1) + "_" + Number(c + 1);
					nom_div(divTabla).innerHTML = txtLetra;
					nom_div(divTabla).style.color = "black";
					nom_div(divTabla).style.borderColor = "black";
					nom_div(divTabla).style.backgroundColor = "white";
				}
			}	
		}
	};

	var posiMatriz = function(ind)
	{
		var fila = 0;
		var columna = 0;
		if(ind <= 4)
		{
			columna = ind;
		}
		else
		{
			if(ind <= 9)
			{
				fila = 1;
				columna = ind - 5;
			}
			else
			{
				if(ind <= 14)
				{
					fila = 2;
					columna = ind - 10;
				}
				else
				{
					if(ind <= 19)
					{
						fila = 3;
						columna = ind - 15;
					}
					else
					{
						fila = 4;
						columna = ind - 20;
					}
				}
			}
		}
		return [fila, columna];
	};

	//Crear los elementos en la tabla...
	var llenarTabla = function(texto)
	{
		texto = texto.toUpperCase();
		texto = omitirAcentos(texto);
		//Limpiar la matriz...
		for(var i = 0; i < 5; i++)
		{
			for(var c = 0; c < 5; c++)
			{
				MatrizPlayFair[i][c] = {};
			}
		}

		var letra = "";
		var ascciLetra = 0;
		var newFrase = "";
		var existe = false;
		//MatrizPlayFair = []; //Reiniciar Matriz...
		//Limpiar la Matriz...
		//aquella tarde remota === aqueltrdmo
		for(var i = 0; i < texto.length; i++)
		{
			if(texto.charAt(i) != " ")
			{
				existe = false;
				for(var c = 0; c < newFrase.length; c++)
				{
					//Saber si la letra ya existe...
					if(i != c)
					{
						//Saber si es un caso especial...
						ascciLetra = texto.charCodeAt(i);
						if(ascciLetra === 73 || ascciLetra === 74)//I,J,N,Ñ
						{
							if("I" === newFrase.charAt(c) || "J" === newFrase.charAt(c))
							{
								existe = true;
								break;
							}
						}
						else
						{
							if(ascciLetra === 78 || ascciLetra === 209)
							{
								if("N" === newFrase.charAt(c) || "Ñ" === newFrase.charAt(c))
								{
									existe = true;
									break;
								}
							}
							else
							{
								if(texto.charAt(i) === newFrase.charAt(c))
								{
									existe = true;
									break;
								}
							}
						}
					}
				}
				if(!existe)
				{
					newFrase += texto.charAt(i);
				}
			}
		}
		//Recorrer la palabra clave, la cual ya no tiene caracteres repetidos...
		var fila = 0;
		var columna = 0;
		var especial = false;
		for(var i = 0; i < newFrase.length; i++)
		{
			var posicion = posiMatriz(i);
			//Obtener el valor Ascci, para validar las especiales...
			letra = newFrase.charAt(i);
			ascciLetra = newFrase.charCodeAt(i);
			//Validar la I y la J
			if(ascciLetra === 73 || ascciLetra === 74)
			{
				letra = "I/J";
				especial = true;
			}
			else
			{
				if(ascciLetra === 78 || ascciLetra === 209)
				{
					letra = "N/Ñ";
					especial = true;
				}	
			}
			MatrizPlayFair[posicion[0]][posicion[1]] = {letra: letra, especial: especial};
			divTabla = Number(posicion[0] + 1) + "_" + Number(posicion[1] + 1);
			nom_div(divTabla).innerHTML = letra;
			nom_div(divTabla).style.color = "white";
			nom_div(divTabla).style.borderColor = "white";
			nom_div(divTabla).style.backgroundColor = "red";
		}
		llenarMatriz();
	};

	var buscaPosicion = function(letra)
	{
		var existe = false;
		for(var i = 0; i < 5; i++)
		{
			for(c = 0; c < 5; c++)
			{
				if(MatrizPlayFair[i][c].especial)
				{
					parteLetra = MatrizPlayFair[i][c].letra.split("/");
					if(letra === parteLetra[0] || letra === parteLetra[1])
					{
						existe = true;
						break;
					}
				}
				else
				{
					if(MatrizPlayFair[i][c].letra === letra)
					{
						existe = true;
						break;
					}
				}
			}
			if(existe)
			{
				break;
			}
		}
		return [i, c];
	};

	var crearCriptograma = function(cifra, cifraTexto)
	{
		//Buscar cada letra que llega en la matriz resultante, con el fin de obtner los valores...
		//accion = 1 Cifrar, 2 = descifrar...
		var posCifra = [];
		var posCifraUno = [];
		var posCifraDos = [];
		var coordenadas = [];
		var textoResulta = "";
		//var letra = "";
		cifra = cifra.toUpperCase(); //Operar en Mayúsculas...
		cifra = omitirAcentos(cifra);
		for(var i = 0; i < cifra.length; i++)
		{
			if(cifra.charAt(i) != " ")
			{
				posCifra = buscaPosicion(cifra.charAt(i));
				if(cifraTexto)
				{
					posCifraUno.push(posCifra[0]);
					posCifraDos.push(posCifra[1]);
				}
				else
				{
					coordenadas.push(posCifra[0]);
					coordenadas.push(posCifra[1]);
				}
			}
		}
		//console.log(coordenadas);
		if(cifraTexto)
		{
			coordenadas = posCifraUno.concat(posCifraDos);
			for(var i = 0; i < coordenadas.length; i+=2)
			{
				//console.log(coordenadas[i] + " Y " + coordenadas[i + 1]);
				if(!MatrizPlayFair[coordenadas[i]][coordenadas[i + 1]].especial)
				{
					textoResulta += MatrizPlayFair[coordenadas[i]][coordenadas[i + 1]].letra;
				}
				else
				{
					textoResulta += "<span class = 'especial'>" + MatrizPlayFair[coordenadas[i]][coordenadas[i + 1]].letra + "</span>";
				}
			}
		}
		else
		{
			var coordenadasDos = coordenadas.splice(0, cifra.length);
			//console.log(coordenadasDos);
			//console.log(coordenadas);
			for(var i in coordenadasDos)
			{
				if(!MatrizPlayFair[coordenadasDos[i]][coordenadas[i]].especial)
				{
					textoResulta += MatrizPlayFair[coordenadasDos[i]][coordenadas[i]].letra;
				}
				else
				{
					textoResulta += "<span class = 'especial'>" + MatrizPlayFair[coordenadasDos[i]][coordenadas[i]].letra + "</span>";
				}
			}
		}
		nom_div("criptograma").innerHTML = textoResulta;
	};

	//Crear la tabla...
	nom_div("tabla").innerHTML = creaTabla();
	llenarMatriz();

	//Capturar el teclado...
	//Para validar las cajas de ingreso de texto...
	for(var i = 1; i <= 2; i++)
	{
		nom_div("caja_" + i).addEventListener('keyup', function(event)
		{
			var key = event.keyCode;
			//if((key >= 65 && key <= 90) || (key === 186) || (key === 8) || (key === 32))
			//{
				if(event.target.id === "caja_1")
				{	
					llenarTabla(this.value);
				}
				else
				{
					this.value = eliminaSlash(this.value);
					crearCriptograma(this.value, cifraraMensaje);
				}
			/*
			}
			else
			{
				this.value = this.value.substr(0, this.value.length - 1);
			}
			*/
		});
	}

	var eliminaSlash = function(texto)
	{
		var elimina = ["/J", "/Ñ"];
		var posi = 0;
		var tmp1 = "";
		var tmp2 = "";
		for(var i in elimina)
		{
			do
			{
				posi = texto.search(elimina[i]);
				if(posi >= 0)
				{
					tmp1 = texto.substr(0, posi);
					tmp2 = texto.substr(posi + 2, texto.length);
					texto = tmp1 + tmp2;
				}
				else
				{
					break;
				}
			}while(1);
		}
		return texto;
	};

	nom_div("accion").addEventListener('change', function(event)
	{
		if(this.value == 1)
		{
			cifraraMensaje = true;
		}
		else
		{
			cifraraMensaje = false;
		}
		nom_div("caja_2").value = "";
		nom_div("criptograma").innerHTML = "Criptograma resultante";
	});

	function omitirAcentos(text)
	{
	    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÇç";
	    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuucc";
    	for (var i=0; i<acentos.length; i++)
    	{
        	text = text.replace(acentos.charAt(i), original.charAt(i));
    	}
    	return text;
	}

	function nom_div(div)
	{
		return document.getElementById(div);
	}
}