import {postData} from '../../xhr-services/api-service';
import {TOnboardingUserAPI} from './user-api.types';

const REGISTER_SIGN_UP_USER_URL = '/user/sign-up';
const REGISTER_SIGN_IN_USER_URL = '/user/sign-in';
const GET_USER_INFO_URL = '/user/get-user';
const POST_ONBOARDING_URL = '/user-data/onboarding-data';

export const registerSignInUserApi = async (
  userData: {
    email: string;
    password: string;
  },
  isSignUp: boolean,
) =>
  postData(
    '',
    isSignUp ? REGISTER_SIGN_UP_USER_URL : REGISTER_SIGN_IN_USER_URL,
    userData,
  );

export const postOnboardingDataApi = async (
  token: string,
  onboardingData: TOnboardingUserAPI,
) => postData(token, POST_ONBOARDING_URL, onboardingData);

export const getUserInfoApi = async (token: string) =>
  postData(token, GET_USER_INFO_URL, {});
