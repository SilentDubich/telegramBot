const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const database = require('./database.json')
require('./Common/Models/film.model')
require('./Common/Models/cinema.model')
const keyboard = require('./Common/Keyboard/keyboard')
const kb = require('./Common/Keyboard/keyboardButtons')
const kbApi = require('./Common/Keyboard/keyboardAPI')
const config = require('./Common/config')
const TOKEN = config.TOKEN
// const TOKEN = '1347468760:AAEyN_Pa9dlmxjUDeNKC0Ww4M2ID_I8Nr8I'
const bot = new TelegramBot(TOKEN, {polling: true});
mongoose.connect(config.DB_URL, {useMongoClient: true})
    .then(() => console.log('Mongo connected'))
    .catch(e => console.log(e))

const Film = mongoose.model('films')
const Cinema = mongoose.model('cinemas')
// Film.remove({}, function(err, result){
//     mongoose.disconnect();
//
//     if(err) return console.log(err);
//
//     console.log(result);
// });
// database.films.forEach( f => new Film(f).save().catch(e => console.log(e)))
// database.cinemas.forEach( f => new Cinema(f).save().catch(e => console.log(e)))


bot.on('message', msg => {
    const id = msg.chat.id
    switch (msg.text) {
        case kb.home.films:
            bot.sendMessage(id, `Choose genre: action or comedy or all films`, kbApi(keyboard.films))
            break
        case kb.home.favorite:
            senByQuery(id, {isFavorite: true})
            break
        case kb.home.Cinemas:
            sendCinemas(id)
            break
        case kb.films.back:
            bot.sendMessage(id, `Back`, kbApi(keyboard.home))
            break
        case kb.films.list:
            senByQuery(id, {})
            break
        case kb.films.action:
            senByQuery(id, {type: 'action'})
            break
        case kb.films.comedy:
            senByQuery(id, {type: 'comedy'})
            break
    }
})

bot.onText(/\/f(.+)/, msg => {
   const id = msg.text.substr(2, msg.text.length)
    Film.findOne({uuid: id}).then( film => {
        const isFavorite = film.isFavorite ? keyboard.favorite('REMOVE', film.name) : keyboard.favorite('ADD', film.name)
        const cinemas = film.cinemas.map( c => '/' + c)
        const caption = `Film: ${film.name}\nYear: ${film.year}\nGenre: ${film.type}\nLength: ${film.length}:00\nRate: ${film.rate}\nCinemas: ${cinemas}\nMore info: ${film.link}`
        bot.sendPhoto(msg.chat.id, film.picture, {caption, reply_markup: {inline_keyboard: isFavorite}})
    })
})

bot.onText(/\/c(.+)/, msg => {
    const id = msg.text.substr(1, msg.text.length)
    Cinema.findOne({uuid: id}).then( cinema => {
        bot.sendLocation(msg.chat.id, cinema.location.latitude, cinema.location.longitude)
    })

})

bot.on('callback_query', query => {
    let film
    let id = query.message.chat.id
    switch (query.data.includes('ADD')) {
        case true:
            film = query.data.substr(3, query.data.length)
            console.log(film)
            Film.updateOne({name: film}, {isFavorite: true}, function(err, result){
                if(err) return console.log(err);
                bot.sendMessage(id, 'Film added to favorites');
            } )
            break
        case false:
            film = query.data.substr(6, query.data.length)
            Film.updateOne({name: film}, {isFavorite: false}, function(err, result){
                if(err) return console.log(err);
                bot.sendMessage(id, 'Film removed from favorites');
            } )
            break
    }
})

const senByQuery = (chatId, query) => {
    Film.find(query).then( films => {
        if (films.length > 0) {
            const html = films.map((f, i) => {
                return `<b>${i + 1}.</b> ${f.name}(${f.year}) - /f${f.uuid}`
            }).join('\n')
            bot.sendMessage(chatId, html, {parse_mode: 'HTML'})
        } else {
            bot.sendMessage(chatId, 'List is empty')
        }

    })
}

const sendCinemas = (chatId) => {
    Cinema.find({}).then(cinemas => {
        const html = cinemas.map((f, i) => {
            return `<b>${i + 1}.</b> ${f.name} - /${f.uuid}`
        }).join('\n')
        bot.sendMessage(chatId, html, {parse_mode: 'HTML'})
    })
}












// bot.onText(/\/get/, (msg) => {
//     const chatId = msg.chat.id;
//     // bot.sendMessage(chatId, 'Вики, взгляд твоих нежных глаз обволакивает меня также мягко, как прилив океана камень на берегу ❤ 💓 💘 😍 😘');
//     bot.sendMessage(chatId, 'Choose', {
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: 'Get yandex', callback_data: 'yandex'}],
//                 [{text: 'Get photo', callback_data: 'photo'}]
//
//             ]
//         }
//     });
// });

// bot.onText(/\/help/, (msg) => {
//     const chatId = msg.chat.id;
//     // bot.sendMessage(chatId, 'Вики, взгляд твоих нежных глаз обволакивает меня также мягко, как прилив океана камень на берегу ❤ 💓 💘 😍 😘');
//     bot.sendMessage(chatId, 'Choose', {
//         reply_markup: {
//             keyboard: keyboard.home
//         }
//     });
// });