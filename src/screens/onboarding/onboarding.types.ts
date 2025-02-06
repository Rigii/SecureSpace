import Swiper from 'react-native-swiper';

export interface IUserData {
  email: string;
  password: string;
}

export type SwiperRef = React.ElementRef<typeof Swiper>;
