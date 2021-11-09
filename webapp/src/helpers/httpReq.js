import Axios from 'axios';
const devHostURL = process.env.DEV_HOST_BASE_URL;
const prodHostURL = process.env.PROD_HOST_BASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

function getHostURL() {
  return  isProduction ? prodHostURL : devHostURL;
}

function axiosGet(endpoint, headers) {
  return Axios.get(getHostURL() + endpoint, headers);
}

function axiosPost(endpoint, data, headers) {
  return Axios.post(getHostURL() + endpoint, data, headers);
}

function axiosPut(endpoint, data, headers) {
  return Axios.put(getHostURL() + endpoint, data, headers);
}

function axiosDelete(endpoint, config) {
  return Axios.delete(getHostURL() + endpoint, config);
}

function axiosPatch(endpoint, data, headers) {
  return Axios.patch(getHostURL() + endpoint, data, headers);
}

export {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
  axiosPut,
};