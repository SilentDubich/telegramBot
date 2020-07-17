const kb = require('./keyboardButtons')
module.exports = {
    home: [
        [kb.home.films],
        [kb.home.Cinemas, kb.home.favorite]
    ],
    films: [
        [kb.films.list],
        [kb.films.action, kb.films.comedy],
        [kb.films.back]
    ],
    favorite: (callback, film) => {
        return [[{text: callback === 'REMOVE' ? 'Remove from favorite' : 'Add to favorite', callback_data: callback + film}]]
    }
}