const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('userMessage', async (message) => {
        let botResponse;

        switch (message.toLowerCase()) {
            case 'talk to a bot':
                botResponse = "Hi! I'm your special bot. Ask me anything!";
                break;

            case 'give me a random fortune':
                botResponse = await getFortune();
                break;

            case 'hey bot tell me a joke':
                botResponse = await getJoke();
                break;

            case 'what is the latest game trend of 2024':
                botResponse = "The current game trend of 2024 is Space marines 2.";
                break;

            case 'what is your favorite pet':
                botResponse = "Dogs";
                break;    

            default:
                botResponse = "Sorry, I don't understand that.";
                break;
        }

        socket.emit('botResponse', botResponse);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Function to fetch a random fortune
async function getFortune() {
    try {
        const response = await axios.get('https://aphorismcookie.herokuapp.com/');
        return response.data.data.message;
    } catch (error) {
        return "Couldn't fetch a fortune at the moment.";
    }
}

// Function to fetch a random joke
async function getJoke() {
    try {
        const response = await axios.get('https://icanhazdadjoke.com/slack', {
            headers: { Accept: 'application/json' },
        });
        return response.data.attachments[0].text;
    } catch (error) {
        return "Couldn't fetch a joke at the moment.";
    }
}

server.listen(8084, () => {
    console.log('Server is running on port 8082');
});
