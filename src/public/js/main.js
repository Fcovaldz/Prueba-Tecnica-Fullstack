$(function() {
    
    const socket = io();

    // Obtener elementos de DOM desde interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // Obtener elementos de DOM desde nicknameForm
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');
    const $nickname2 = $('#nickname');

    const $users = $('#usernames');
    const $user2 = $('#usernames2');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if (data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                <div class="alert alert-success">
                Ese usuario ya existe.
                </div>`);
            }
            $nickname.val('');
        });
        socket.emit('new user', $nickname2.val(), data2 => {
            if (data2){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                <div class="alert alert-success">
                Ese usuario ya existe.
                </div>`);
            }
            $nickname2.val('');
        });
    });
    // Eventos
    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('enviar mensaje', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    socket.on('nuevo mensaje', function(data){
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    });
    
    socket.on('usernames',data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><img src="./../img/user2.png" class="container" width="100" height="100">${data[i]}</p>`
        }
        $users.html(html);
    });
    socket.on('usernames2',data2 => {
        let html = '';
        for (let j = 0; j < data2.length; j++) {
            html += `<p><img src="./../img/user1.png" class="container" width="100" height="100">${data2[j]}</p>`
        }
        $user2.html(html);
    });

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.msg}</p>`);
    });

    socket.on('carga viejos mensajes', msgs => {
        for(let i = 0; i < msgs.length; i++){
            displayMsg(msgs[i]);
        }
    });

    function displayMsg(data){
        $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.msg}</p>`);
    }
});