import { axiosDelete } from '../helpers/httpReq';
const logoutCurrentUser = () => {
  return axiosDelete('api/auth/logout');
}
export {
  logoutCurrentUser
}