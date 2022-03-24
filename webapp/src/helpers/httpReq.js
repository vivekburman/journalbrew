import Axios from 'axios';
const devHostURL = process.env.DEV_HOST_BASE_URL;
const prodHostURL = "/";
const isProduction = process.env.NODE_ENV === 'production';

function getHostURL() {
  return  isProduction ? prodHostURL : devHostURL;
}

function errorHandler(err) {
  let error;
  let status = 500;
  if (err.response) {
    error = err.response.data.error;
    status = err.response.status;
  } else if(err.request) {
    error = err.request;
  } else {
    error = err.message;
  }
  return Promise.reject({
    error: error.message,
    status: status
  });
}


function axiosGet(endpoint, headers) {
  return Axios.get(getHostURL() + endpoint, headers).catch(errorHandler);
}

function axiosPost(endpoint, data, headers) {
  return Axios.post(getHostURL() + endpoint, data, headers).catch(errorHandler);
}

function axiosPut(endpoint, data, headers) {
  return Axios.put(getHostURL() + endpoint, data, headers).catch(errorHandler);
}

function axiosDelete(endpoint, config) {
  return Axios.delete(getHostURL() + endpoint, config).catch(errorHandler);
}

function axiosPatch(endpoint, data, headers) {
  return Axios.patch(getHostURL() + endpoint, data, headers).catch(errorHandler);
}

export {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
  axiosPut,
};