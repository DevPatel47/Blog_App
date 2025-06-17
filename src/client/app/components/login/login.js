const template = require('./login.ejs');

module.exports = (route) => {
    const html = template();
    document.getElementById('app').innerHTML = html;
};
