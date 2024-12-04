import Swiper from 'react-native-swiper';

export interface IOnboardingFormValues {
  name: string;
  titleForm: string;
  imergencyPasswordsEmails: {email: string; password: string}[];
  securePlaceName: string;
  securePlaceData: {
    id: string;
    address: string;
    coordinates: {
      lat: string;
      long: string;
    };
  };
  securePlaceRadius: string;
  keyPassword: string;
  confirmKeyPassword: string;
  saveKeyOnDevice: boolean;
}

export interface IUserData {
  email: string;
  password: string;
}

export type SwiperRef = React.ElementRef<typeof Swiper>;
