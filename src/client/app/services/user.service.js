const { BASE_URL } = require("../../constants.js");

function UserService() {
  this.host = `${BASE_URL}/users`;
}

// Register User
UserService.prototype.registerUser = async function (userData) {
  try {
    const response = await fetch(`${this.host}/register`, {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json" 
        },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login User
UserService.prototype.loginUser = async function (email, password) {
  try {
    const response = await fetch(`${this.host}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Logout User
UserService.prototype.logoutUser = async function () {
  try {
    const response = await fetch(`${this.host}/logout`, {
      method: "POST",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

// Refresh Access Token
UserService.prototype.refreshAccessToken = async function () {
  try {
    const response = await fetch(`${this.host}/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Change Current Password
UserService.prototype.changePassword = async function (
  currentPassword,
  newPassword
) {
  try {
    const response = await fetch(`${this.host}/change-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Get Current User
UserService.prototype.getCurrentUser = async function () {
  try {
    const response = await fetch(`${this.host}/current-user`, {
      method: "GET",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Update Account Details (text fields only)
UserService.prototype.updateAccountDetails = async function (userData) {
  try {
    const response = await fetch(`${this.host}/update-account`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating account details:", error);
    throw error;
  }
};

// Delete User
UserService.prototype.deleteUser = async function () {
  try {
    const response = await fetch(`${this.host}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

module.exports = new UserService();
