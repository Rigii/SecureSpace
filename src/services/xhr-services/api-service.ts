import {BASE_URL, BASE_URL_LOCAL} from '@env';
import axios, {AxiosPromise} from 'axios';
// import {store} from './redux/store';

export type IResponse<T> = AxiosPromise<T>;

export const getInstance = (token: string) => {
  const instance = axios.create({
    baseURL: `${BASE_URL}`,
    timeout: 15000,
  });

  instance.interceptors.response.use((response: any) => {
    return response;
  });

  instance.interceptors.request.use(async (config: any) => {
    // const user = store.getState().authReducer;
    // if (!user.token) {
    if (!token) {
      return config;
    }

    config = {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    };
    return config;
  });

  return instance;
};

export const fetchData = (
  token: string,
  requestUrl: string,
  params?: {},
  isFullPath?: boolean,
) => {
  const url = !isFullPath ? `${BASE_URL_LOCAL}${requestUrl}` : requestUrl;
  return getInstance(token).get(url, {params});
};

export const deleteData = (token: string, requestUrl: string, params?: {}) => {
  return getInstance(token).delete(`${BASE_URL_LOCAL}${requestUrl}`, {
    data: params,
  });
};

export const patchData = (token: string, requestUrl: string, payload: any) => {
  return getInstance(token).patch(`${BASE_URL_LOCAL}${requestUrl}`, payload);
};

export const putData = (token: string, requestUrl: string, payload: any) => {
  return getInstance(token).put(`${BASE_URL_LOCAL}${requestUrl}`, payload);
};

export const postData = (token: string, requestUrl: string, payload: any) => {
  return getInstance(token).post(`${BASE_URL_LOCAL}${requestUrl}`, payload);
};

export const getData = (token: string, requestUrl: string, payload: any) => {
  return getInstance(token).get(`${BASE_URL_LOCAL}${requestUrl}`, payload);
};
