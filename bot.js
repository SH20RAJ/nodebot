const { Telegraf } = require('telegraf');
const express = require('express');
require('dotenv').config(); // Load environment variables from .env file

// Create a new instance of Telegraf
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Create an Express application
const app = express();

// Set up a route for receiving updates from Telegram
app.use(express.json());
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot.handleUpdate(req.body, res);
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});

// Set up the webhook for the Telegram bot
const webhookUrl = process.env.WEBHOOK_URL || `https://your-webhook-url:${PORT}/bot${process.env.TELEGRAM_BOT_TOKEN}`;
bot.telegram.setWebhook(webhookUrl);

console.log(`Webhook URL set to: ${webhookUrl}`);
