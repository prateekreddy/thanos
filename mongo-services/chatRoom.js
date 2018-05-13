const createChatServer = (io) => {
    const connections = {};

    io.on('connection', (socket) => {
        let userId;
        socket.on('initiateConnection', (data) => {
            console.log(data);
            userId = data.userId;
            connections[data.userId] = socket;
        });

        socket.on('closeConneaction', (data) => {
            delete connections[data.userId];
            socket.disconnect(true);
        });

        socket.on('startChat', (data) => {
            const otherUser = data.otherUserId;
            const chatRoomId = userId+otherUserId;
            
        });


    });
};