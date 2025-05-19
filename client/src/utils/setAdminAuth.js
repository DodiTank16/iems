import axios from "axios";

// Set token as a default header in all axios request for admin
const setAdminAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-admin-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-admin-auth-token"];
  }
};

export default setAdminAuthToken;
