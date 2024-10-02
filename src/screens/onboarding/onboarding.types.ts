import Swiper from 'react-native-swiper';

export interface ISecurePlace {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: string;
    long: string;
  };
  areaRadiusMeters: string;
}

export type TSecurePlaces = Record<string, ISecurePlace> | {}; //{[key: string]: ISecurePlaces};

export interface IOnboardingFormValues {
  nik: string;
  sex: string;
  imergencyPasswords: string[];
  securePlaces: TSecurePlaces;
}

export type SwiperRef = React.ElementRef<typeof Swiper>;
