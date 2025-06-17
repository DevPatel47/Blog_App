const template = require('./home.ejs');

module.exports = (route) => {
    const html = template();
    document.getElementById('app').innerHTML = html;
};
