const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Import Axios library
require('dotenv').config(); // Load environment variables from .env file

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Listen for messages
// Listen for messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.toString();

  // Check if the message contains a link
  if (messageText.includes('https://')) {
      const url = extractUrl(messageText);

      // Check if the URL is from teraboxapp.com
      if (url.includes('teraboxapp.com')) {
          try {
              await bot.sendChatAction(chatId, 'typing');

              const apiUrl = "https://ytshorts.savetube.me/api/v1/terabox-downloader";
              console.log(url);
              const requestBody = { url };

              // Fetch data from terabox downloader API using fetch
              const response = await fetch(apiUrl, {
                  method: "POST",
                  headers: {
                      "accept": "application/json, text/plain, */*",
                      "accept-language": "en-US,en;q=0.9,hi;q=0.8",
                      "cache-control": "no-cache",
                      "content-type": "application/json",
                      "pragma": "no-cache",
                      "priority": "u=1, i",
                      "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                      "sec-ch-ua-mobile": "?0",
                      "sec-ch-ua-platform": "\"macOS\"",
                      "sec-fetch-dest": "empty",
                      "sec-fetch-mode": "cors",
                      "sec-fetch-site": "same-origin",
                      "cookie": "_ga=GA1.1.2110759286.1711701275; FCNEC=%5B%5B%22AKsRol9AEBYqsxFEeKI7ZfmIA6z6Kdr8jEVx3wLHKuXQjRTyy-TGf-Uq8vNhpew0dbd4KB04eejgrTAQEbdvA0CSC8nEvs-ZYssal2zC841o5adBmM9WkRQ2SVR0Tt2TqFw5gfxD3z0WN0eGYE4U-g62A_4yKalr3g%3D%3D%22%5D%5D; _ga_3Q4D9SLPKL=GS1.1.1714320325.5.1.1714320325.0.0.0; cf_clearance=Wm.0hFtXbDxA_owC3lvaD35Cp5RSvg_6kDaAotsJsag-1714320326-1.0.1.1-vOSYCYtc1sQb7f.CHmdymgp1L64WP4cVq0Ypmke.IA8MwmNAs0iKlrMbs7jxc2oXji94fIZKYTJZPThjo9llEA"
                  },
                  body: JSON.stringify(requestBody),
                  referrerPolicy: "no-referrer"
              });

              if (!response.ok) {
                  throw new Error('Failed to fetch data');
              }

              const data = await response.json();

              if (!data || !data.response || data.response.length === 0) {
                  throw new Error('No video data found');
              }

              const videoInfo = data.response[0];

              const msgTemplate = `
<b>Title:</b> ${videoInfo.title}
<b>Thumbnail:</b> <a href="${videoInfo.thumbnail}">View Thumbnail</a>
`;

              const options = {
                  parse_mode: "HTML",
                  reply_markup: {
                      inline_keyboard: [
                          [
                              { text: "Fast Download", url: videoInfo.resolutions["Fast Download"] },
                              { text: "Watch", url: `https://teradl.shraj.workers.dev/?url=${encodeURIComponent(videoInfo.resolutions["Fast Download"])}` }
                          ]
                      ]
                  }
              };

              bot.sendMessage(chatId, msgTemplate, options);
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
