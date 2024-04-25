const { Telegraf } = require('telegraf');
const express = require('express');
require('dotenv').config(); // Load environment variables from .env file

// Create a new instance of Telegraf
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle incoming updates from Telegram
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    // Forward the update to the Telegraf bot
    bot.handleUpdate(req.body, res);
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});

// Respond to text messages
// Respond to text messages
bot.on('text', (ctx) => {
    const messageText = ctx.message.text;
    
    // Check if the message contains a link
    if (containsLink(messageText)) {
        // Modify the link and send it back
        const modifiedLink = modifyLink(messageText);
        ctx.reply(`Modified link: ${modifiedLink}`);
    } else {
        // If the message doesn't contain a link, just echo the message
        ctx.reply(`You said: ${messageText}`);
    }
});

// Function to check if the message contains a link
function containsLink(text) {
    // Regular expression to match a URL pattern
    const urlRegex = /(https?:\/\/[^\s]+)/;
    return urlRegex.test(text);
}

// Function to modify the link
function modifyLink(text) {
    // Replace the domain with the new domain
    return text.replace('https://teraboxapp.com/', 'https://forn.fun/watch/');
}

// Start the bot
bot.launch().then(() => {
    console.log('Bot is running');
}).catch((err) => {
    console.error('Error starting bot', err);
});
