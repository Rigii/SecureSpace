import Swiper from 'react-native-swiper';
import {TSecurePlaces} from '../../app/types/encrypt.types';

export interface IOnboardingFormValues {
  name: string;
  titleForm: string;
  imergencyPasswordsEmails: {email: string; password: string}[];
  securePlaces: TSecurePlaces;
}

export interface IUserData {
  email: string;
  password: string;
}

export type SwiperRef = React.ElementRef<typeof Swiper>;
