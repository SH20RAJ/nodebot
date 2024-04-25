const { Telegraf } = require('telegraf');

// Create a new instance of Telegraf
// const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const bot = new Telegraf("6668998731:AAEQlZFKeNeQTsfnXE97H-nkzoTayMPYbmg");

// Start command
bot.start((ctx) => ctx.reply('Welcome to your Telegram bot!'));

// Help command
bot.help((ctx) => ctx.reply('This is a simple Telegram bot. You can interact with it by sending commands.'));

// Echo command
bot.on('text', (ctx) => {
    // Echo the received message
    ctx.reply(ctx.message.text);
});

// Start polling
bot.launch().then(() => {
    console.log('Bot is running');
}).catch((err) => {
    console.error('Error starting bot', err);
});
