import axios from 'axios';

const API_URL = "https://masterkinder20240523125154.azurewebsites.net/api/account/";

const register = (email, password, schoolId) => {
  return axios.post(API_URL + "register", {
    email,
    password,
    schoolId // Skickar SchoolId vid registrering
  });
};

const login = (email, password) => {
  return axios.post(API_URL + "login", {
    email,
    password
  }).then((response) => {
    if (response.data.token) {
      // Spara användare (token och schoolId) i localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  // Ta bort användarens data från localStorage vid utloggning
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  // Hämta den nuvarande användaren från localStorage
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  getCurrentUser,
  logout,
};

export default AuthService;
