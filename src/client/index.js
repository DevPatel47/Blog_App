const Navigo = require('navigo');

require("bootstrap");
require("@fortawesome/fontawesome-free");
require("./scss/style.scss");

const HomePage = require("./app/components/home/home.js");
const LoginPage = require("./app/components/login/login.js");

const router = new Navigo("/");

window.addEventListener("DOMContentLoaded", () => {
    // HeaderComponent();

    router
        .on("/", HomePage)
        .on("/login", LoginPage)
        .resolve();

    router.updatePageLinks();
    // FooterComponent();
});

module.exports = { router };