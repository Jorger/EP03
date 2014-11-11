window.onload = function()
{
    inicia();
};

function inicia()
{
    var maxMessageSize = 1000;
    var input = nom_div('file');
    input.addEventListener('change', function(e)
    {
        var reader = new FileReader();
        reader.onload = function(event)
        {
            nom_div('preview').style.display = 'block';
            nom_div('preview').src = event.target.result;
            
            nom_div('message').value = '';
            nom_div('password').value = '';
            nom_div('password2').value = '';
            nom_div('messageDecoded').innerHTML = '';

            var img = new Image();
            img.onload = function()
            {
                var ctx = nom_div('canvas').getContext('2d');
                ctx.canvas.width = img.width;
                ctx.canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                decode();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    var decode = function()
    {
        var password = nom_div('password2').value;
        var passwordFail = 'La clave es incorrecta o la imagen no contiene información oculta';

        var ctx = nom_div('canvas').getContext('2d');
        var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        var message = decodeMessage(imgData.data, sjcl.hash.sha256.hash(password));

        var obj = null;
        try
        {
            obj = JSON.parse(message);
        }
        catch (e)
        {
            nom_div('choose').style.display = 'block';
            nom_div('reveal').style.display = 'none';
            if (password.length > 0)
            {
                alert(passwordFail);
            }
        }
        // display the "reveal" view
        if (obj)
        {
            nom_div('choose').style.display = 'none';
            nom_div('reveal').style.display = 'block';
            // decrypt if necessary
            if (obj.ct)
            {
                try
                {
                    obj.text = sjcl.decrypt(password, message);
                }
                catch(e)
                {
                    alert(passwordFail);
                }
            }
            // escape special characters
            var escChars = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            '\'': '&#39;',
                            '/': '&#x2F;',
                            '\n': '<br/>'
                            };
            var escHtml = function(string)
            {
                return String(string).replace(/[&<>"'\/\n]/g, function (c)
                {
                    return escChars[c];
                });
            };
            nom_div('messageDecoded').innerHTML = escHtml(obj.text);
        }
    };

    var decodeMessage = function(colors, hash)
    {
        // this will store the color values we've already read from
        var history = [];
        // get the message size
        var messageSize = getNumberFromBits(colors, history, hash);
        // exit early if the message is too big for the image
        if ((messageSize + 1) * 16 > colors.length * 0.75)
        {
            return '';
        }
        // exit early if the message is above an artificial limit
        if (messageSize === 0 || messageSize > maxMessageSize)
        {
            return '';
        }
        // put each character into an array
        var message = [];
        for (var i = 0; i < messageSize; i++)
        {
            var code = getNumberFromBits(colors, history, hash);
            message.push(String.fromCharCode(code));
        }
        // the characters should parse into valid JSON
        return message.join('');
    };


    
    var encodeButton = nom_div('encode');
    encodeButton.addEventListener('click', function(event)
    {
        var message = nom_div('message').value;
        var password = nom_div('password').value;
        var output = nom_div('output');
        var canvas = nom_div('canvas');
        var ctx = canvas.getContext('2d');

        // encrypt the message with supplied password if necessary
        if (password.length > 0)
        {
            message = sjcl.encrypt(password, message);
        }
        else
        {
            message = JSON.stringify({'text': message});
        }

        // exit early if the message is too big for the image
        var pixelCount = ctx.canvas.width * ctx.canvas.height;
        if ((message.length + 1) * 16 > pixelCount * 4 * 0.75)
        {
            alert('El mensaje es demasioado largo para ser almacenado en la imagen');
            return;
        }

        // exit early if the message is above an artificial limit
        if (message.length > maxMessageSize)
        {
            alert('Mensaje es demasionado largo');
            return;
        }
        // encode the encrypted message with the supplied password
        var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        encodeMessage(imgData.data, sjcl.hash.sha256.hash(password), message);
        ctx.putImageData(imgData, 0, 0);

        // view the new image

        nom_div('resulta').style.display = 'block';
        output.src = canvas.toDataURL();
        alert('Datos ocultados! Guarde la imagen y compartala...');
    });

    var encodeMessage = function(colors, hash, message)
    {
        // make an array of bits from the message
        var messageBits = getBitsFromNumber(message.length);
        messageBits = messageBits.concat(getMessageBits(message));

        // this will store the color values we've already modified
        var history = [];

        // encode the bits into the pixels
        var pos = 0;
        while (pos < messageBits.length)
        {
            // set the next color value to the next bit
            var loc = getNextLocation(history, hash, colors.length);
            colors[loc] = setBit(colors[loc], 0, messageBits[pos]);

            // set the alpha value in this pixel to 255
            // we have to do this because browsers do premultiplied alpha
            // see for example: http://stackoverflow.com/q/4309364
            while ((loc + 1) % 4 !== 0) {
                loc++;
            }
            colors[loc] = 255;
            pos++;
        }
    };

    var decodeButton = nom_div('decode');
    decodeButton.addEventListener('click', function(e)
    {
        decode();
    });




    // returns a 1 or 0 for the bit in 'location'
    var getBit = function(number, location)
    {
       return ((number >> location) & 1);
    };

    // sets the bit in 'location' to 'bit' (either a 1 or 0)
    var setBit = function(number, location, bit)
    {
       return (number & ~(1 << location)) | (bit << location);
    };

    // returns an array of 1s and 0s for a 2-byte number
    var getBitsFromNumber = function(number)
    {
       var bits = [];
       for (var i = 0; i < 16; i++)
       {
           bits.push(getBit(number, i));
       }
       return bits;
    };

    // returns the next 2-byte number
    var getNumberFromBits = function(bytes, history, hash)
    {
        var number = 0, pos = 0;
        while (pos < 16)
        {
            var loc = getNextLocation(history, hash, bytes.length);
            var bit = getBit(bytes[loc], 0);
            number = setBit(number, pos, bit);
            pos++;
        }
        return number;
    };

    // returns an array of 1s and 0s for the string 'message'
    var getMessageBits = function(message)
    {
        var messageBits = [];
        for (var i = 0; i < message.length; i++) {
            var code = message.charCodeAt(i);
            messageBits = messageBits.concat(getBitsFromNumber(code));
        }
        return messageBits;
    };

    // gets the next location to store a bit
    var getNextLocation = function(history, hash, total)
    {
        var pos = history.length;
        var loc = Math.abs(hash[pos % hash.length] * (pos + 1)) % total;
        while (true) {
            if (loc >= total) {
                loc = 0;
            } else if (history.indexOf(loc) >= 0) {
                loc++;
            } else if ((loc + 1) % 4 === 0) {
                loc++;
            } else {
                history.push(loc);
                return loc;
            }
        }
    };

    var ejecutaVideo = false;
    var reproVideo = false;
    var video = nom_div("video");
    var canvasfoto = nom_div('canvasfoto');
    var tomafotoBtn = nom_div("tomafoto");
    var width = 320;
    var height = 0;
    tomafotoBtn.addEventListener('click', function(e)
    {
        if(!ejecutaVideo)
        {
            //Solicitar la cámara al usuario...
            navigator.getMedia = ( navigator.getUserMedia ||
                                   navigator.webkitGetUserMedia ||
                                   navigator.mozGetUserMedia ||
                                   navigator.msGetUserMedia);
            navigator.getMedia(
            {
                video: true,
                audio: false
            },

            function(fuente)//URL blog
            {
                if(navigator.mozGetUserMedia)
                {
                    video.mozSrcObject = fuente;
                }
                else
                {
                    var URL = window.URL || window.webkitURL;
                    video.src = URL.createObjectURL(fuente);
                }
                video.play();
            },
            function(err)
            {
                //alert("El navegador no soporta getMedia");
                console.log("El navegador no soporta getUserMedia");
            });

            video.addEventListener('canplay', function(ev)
            {
                if (!ejecutaVideo)
                {
                    height = video.videoHeight / (video.videoWidth/width);
                    video.setAttribute('width', width);
                    video.setAttribute('height', height);
                    canvasfoto.setAttribute('width', width);
                    canvasfoto.setAttribute('height', height);
                    ejecutaVideo = true;
                    capturarFoto();
                }
            });
        }
        else
        {
            capturarFoto();
        }
    });

    function capturarFoto()
    {
        canvasfoto.width = width;
        canvasfoto.height = height;
        var c = canvasfoto.getContext('2d');
        c.drawImage(video, 0, 0, width, height);
        imgd = c.getImageData(0, 0, 500, 300);
        console.log(imgd);
        //var pix = imgd.data;
        //nom_div("face").src = canvasfoto.toDataURL();
        nom_div('preview').style.display = 'block';
        nom_div('preview').src = canvasfoto.toDataURL();

        nom_div('message').value = '';
        nom_div('password').value = '';
        nom_div('password2').value = '';
        nom_div('messageDecoded').innerHTML = '';

        var img = new Image();
        img.onload = function()
        {
            var ctx = nom_div('canvas').getContext('2d');
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            decode();
        };
        img.src = canvasfoto.toDataURL();
    }

    function nom_div(div)
    {
        return document.getElementById(div);
    }
}