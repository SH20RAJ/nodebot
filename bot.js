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
bot.on('text', (ctx) => {
    // Reply to the received text message
    ctx.reply(`You said: ${ctx.message.text}`);
});

// Start the bot
bot.launch().then(() => {
    console.log('Bot is running');
}).catch((err) => {
    console.error('Error starting bot', err);
});
