// src/auth.js
const isLoggedInToken = () => {
  return !!localStorage.getItem("token");
};

const isLoggedInCnpj = () => {
  return !!localStorage.getItem("cnpj");
};

export default {
  isLoggedInToken,
  isLoggedInCnpj,
};
