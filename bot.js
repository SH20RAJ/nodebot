const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

const app = express();
app.use(bodyParser.json());

// Webhook endpoint for Telegram
app.post(`/bot`, (req, res) => {
    const chatId = req.body.message.chat.id;
    const messageText = req.body.message.text;

    // Check if the message contains a link
    if (messageText.includes('https://')) {
        const url = extractUrl(messageText);

        // Check if the URL is from teraboxapp.com
        if (url.includes('teraboxapp.com')) {
            try {
                bot.sendChatAction(chatId, 'typing');

                const apiUrl = "https://ytshorts.savetube.me/api/v1/terabox-downloader";
                const requestBody = { url };

                fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Add other headers here if needed
                    },
                    body: JSON.stringify(requestBody)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    return response.json();
                })
                .then(data => {
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
                })
                .catch(error => {
                    console.error('Error:', error);
                    bot.sendMessage(chatId, 'An error occurred while processing your request');
                });
            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, 'An error occurred while processing your request');
            }
        }
    } else if (messageText === 'hi') {
        // Send "Hi" as a response
        bot.sendMessage(chatId, 'Hi');
    }

    res.sendStatus(200);
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

// Set up the webhook with the provided URL
const WEBHOOK_URL = 'https://nodebot-ilhh.onrender.com/bot';
bot.setWebHook(WEBHOOK_URL);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
