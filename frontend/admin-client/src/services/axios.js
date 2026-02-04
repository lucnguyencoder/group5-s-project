import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3002",
  timeout: 5000,
});

instance.defaults.withCredentials = true;
instance.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return error?.response?.data || "400";
  }
);

export default instance;
