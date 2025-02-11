import io from 'socket.io-client';

export const initSocket = () => {
    return io('https://brocodeserver.glitch.me', {
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttempts: 5,
        transports: ['websocket'],
        'force new connection': true,
    }
    
    );

};