const Navigo = require("navigo");

require("../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../node_modules/@fortawesome/fontawesome-free/css/all.min.css");
require("./scss/style.scss");

const UserService = require("./app/services/user.service.js")

const HeaderComponent = require("./app/components/header/header.js");
const HomePage = require("./app/components/home/home.js");
const LoginPage = require("./app/components/login/login.js");

const router = new Navigo("/");

window.addEventListener("DOMContentLoaded", () => {
  HeaderComponent();

  router
    .on("/login", LoginPage)
    // .on("/register", RegisterPage)
    .on("/", async () => {
      await checkLoginStatus(HomePage);                 
    })
    .resolve();

  router.updatePageLinks();
});


async function checkLoginStatus(component) {
    try {
        const response = await UserService.getCurrentUser();

        if (!response.data || !response.data.user) {
            router.navigate("/login");
        } else {
            component()
        }
    } catch (error) {
        router.navigate("/login");
    }
}


module.exports = { router };
