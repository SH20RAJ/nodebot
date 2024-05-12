const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

const app = express();
app.use(bodyParser.json());

// Webhook endpoint for Telegram
app.post('/bot', (req, res) => {
    let manychat = fetch("https://wh.manychat.com/tgwh/tg0o83f4yg73hfgi73f2g89938g/6564625956/3cb9c43b300de42ccc337cc7d8b3e455ceef7d73",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
    console.log('Received message:', req.body.message);

    // Initialize message variables
    const message = req.body.message;
    let textContent = message.text || (message.caption ? message.caption : '');

    if (!textContent) {
        console.log('No text or caption in the message');
        return res.sendStatus(200);  // Acknowledge the request anyways
    }

    const chatId = message.chat.id;
    console.log(chatId, textContent);

    // Check if the message contains a link
    if (textContent.includes('https://')) {
        const url = extractUrl(textContent);

        // Check if the URL is from teraboxapp.com
        if (url.includes('terabox')) {
            try {
                let id  = url.split('/').pop();
                console.log("the id is " + id);
                let data = fetch('https://teraboxdl-4er1.onrender.com/api/upload?id='+id+'&user='+chatId || null)
            } catch (error) {
                console.log(error);
            }
            try {
                bot.sendChatAction(chatId, 'typing');
                const apiUrl = "https://ytshorts.savetube.me/api/v1/terabox-downloader";
                const requestBody = { url };

                fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                })
                .then(response => response.json())
                .then(data => {
                    const videoInfo = data.response[0];
                    const msgTemplate = `<b>Title:</b> ${videoInfo.title}\n<b>Thumbnail:</b> <a href="${videoInfo.thumbnail}">View Thumbnail</a>\n @sopbots - Usefull Telegram Bots`;
                    const options = {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [[
                                { text: "Fast Download", url: videoInfo.resolutions["Fast Download"].replace('d3.terabox.com','d8.freeterabox.com')},
                                { text: "Watch", url: `https://teradl.shraj.workers.dev/?url=${encodeURIComponent(videoInfo.resolutions["Fast Download"]).replace('d3.terabox.com','d8.freeterabox.com')}` }
                            ]]
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
    } else if (textContent === 'hi') {
        // Send "Hi" as a response
        bot.sendMessage(chatId, 'Hi');
    } else if (textContent === '/start') {
        // Send "Hi" as a response
        bot.sendMessage(chatId, 'Send/Forward me a Terabox Link and I will give you the download link.... 🚀 \n Send Example Link :- https://teraboxapp.com/s/1EWkWY66FhZKS2WfxwBgd0Q');
    }

    res.sendStatus(200);
});



// Function to extract URL from message or caption
function extractUrl(text) {
    const regex = /(https?:\/\/[^\s]+)/;
    const matches = text.match(regex);
    return matches ? matches[0] : '';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
