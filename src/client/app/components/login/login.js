const template = require('./login.ejs');
const UserService = require('../../services/user.service');
const  { router } = require('../../../index');    

module.exports = (router) => {
    const html = template();
    document.getElementById('app').innerHTML = html;

    document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const loginResponse = await UserService.loginUser(email, password);

        if (loginResponse.success) {
            router.navigate("/");
        } else {
            const messageBox = document.getElementById("message-box");
            messageBox.classList.remove("d-none");

            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = loginResponse.errorMessage || "Login failed. Please try again.";
            errorMessage.style.display = "block";
        }
  });
};
