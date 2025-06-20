const template = require('./header.ejs');

module.exports = (route) => {
    const html = template();
    document.getElementById('app')
        .insertAdjacentHTML('beforebegin', html);
};
