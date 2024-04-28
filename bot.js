const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
require('dotenv').config(); // Load environment variables from .env file

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Listen for messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.toString().toLowerCase();

  // Check if the message contains a link
  if (messageText.includes('https://')) {
    const url = extractUrl(messageText);

    // Check if the URL is from teraboxapp.com
    if (url.includes('teraboxapp.com')) {
      try {
        // Fetch data from terabox downloader API
        const response = await fetch('https://ytshorts.savetube.me/api/v1/terabox-downloader', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        // Check if response is successful
        if (response.ok) {
          const data = await response.json();
          // Send the returned data to the user
          bot.sendMessage(chatId, JSON.stringify(data));
        } else {
          bot.sendMessage(chatId, 'Error fetching data from terabox downloader API');
        }
      } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, 'An error occurred while processing your request');
      }
    }
  } else if (messageText === 'hi') {
    // Send "Hi" as a response
    bot.sendMessage(chatId, 'Hi');
  }
});

// Function to extract URL from message
function extractUrl(message) {
  const regex = /(https?:\/\/[^\s]+)/;
  const matches = message.match(regex);
  if (matches && matches.length > 0) {
    return matches[0];
  }
  return '';
}
