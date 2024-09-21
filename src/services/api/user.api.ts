import {postData} from '../xhr-services/api-service';

const REGISTER_SIGN_IN_USER_URL = '/user/sign-up';
const GET_USER_INFO_URL = '/user/get-user';

export const registerSignInUserApi = async (userData: {
  email: string;
  password: string;
}) => postData('', REGISTER_SIGN_IN_USER_URL, userData);

export const getUserInfoApi = async (token: string) =>
  postData(token, GET_USER_INFO_URL, {});
