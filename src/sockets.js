const Chat = require('./models/Chat');

module.exports = function(io) {

    let users = {};
    let user2 = {};

    io.on('connection', async socket => {
        console.log('usuario conectado');

        let messages = await Chat.find({});
        socket.emit('carga viejos mensajes', messages);
        socket.on('new user', (data, cb) => {
            
            if (data in users){
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
            if (data in user2){
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                user2[socket.nickname] = socket;
                updateNicknames2();
            }
        });

        socket.on('enviar mensaje', async(data, cb)=> {
           
            var msg = data.trim();

            if(msg.substr(0, 3) === '/w'){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                
                if (index !== -1){
                    var name = msg.subtring(0, index);
                    var msg = msg.subtring(index + 1);
                    if(name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Error, usuario no encontrado');
                    }
                    if(name in user2) {
                        user2[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Error, usuario no encontrado');
                    }
                } else {
                    cb('Error! Ingresa un mensaje');
                }
            } else {
               var newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save();
                io.sockets.emit('nuevo mensaje', {
                    msg: data,
                    nick: socket.nickname
                });
            }
        });

        socket.on('disconect', data => {
            if(!socket.nickname) return;
            delete users[socket.nickname];
            delete user2[socket.nickname];
            updateNicknames();
            updateNicknames2();
        });

        function updateNicknames(){
            io.sockets.emit('usernames',Object.keys(users));
        }
        function updateNicknames2(){
            io.sockets.emit('usernames2',Object.keys(user2));
        }
    });
}