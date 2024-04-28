
// Create a new instance of Telegraf
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config(); // Load environment variables from .env file

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Listen for messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.toString().toLowerCase();

  if (messageText === 'hi') {
    // Send "Hi" as a response
    bot.sendMessage(chatId, 'Hi');
  }
});
