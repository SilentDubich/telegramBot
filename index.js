const TelegramBot = require('node-telegram-bot-api')

const TOKEN = '556174800:AAFLLmAS0LGsG_aGg5X85SkZBOeQwfmYUrg'
// const TOKEN = '1347468760:AAEyN_Pa9dlmxjUDeNKC0Ww4M2ID_I8Nr8I'
const bot = new TelegramBot(TOKEN, {
    polling: true
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    // bot.sendMessage(chatId, 'Вики, взгляд твоих нежных глаз обволакивает меня также мягко, как прилив океана камень на берегу ❤ 💓 💘 😍 😘');
    bot.sendMessage(chatId, 'Choose', {
        reply_markup: {
            keyboard: [
                [{text: 'Give contacts'}],
                [{text: 'Give coordinates', request_location: true}],
                [{text: 'Get google', request_contacts: true}],
            ],
            one_time_keyboard: true,
            remove_keyboard: true
        }
    });
});