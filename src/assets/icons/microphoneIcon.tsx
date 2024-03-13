import React, {ReactElement} from 'react';
import IIconProps from './iconTypes';
import {Path, Defs, G} from 'react-native-svg';

export const MicrophoneIcon = (props: IIconProps): ReactElement => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    version="1.1"
    viewBox="0 0 256 256"
    xmlSpace="preserve">
    <Defs></Defs>
    <G
      className="text-gray-400"
      transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
      <Path
        d="M 69.245 38.312 h -8.863 v -22.93 C 60.382 6.9 53.481 0 45 0 S 29.618 6.9 29.618 15.382 v 22.93 h -8.863 c -1.104 0 -2 0.896 -2 2 v 6.505 c 0 13.797 10.705 25.134 24.245 26.16 V 86 h -9.126 c -1.104 0 -2 0.896 -2 2 s 0.896 2 2 2 h 22.252 c 1.104 0 2 -0.896 2 -2 s -0.896 -2 -2 -2 H 47 V 72.978 c 13.54 -1.026 24.245 -12.363 24.245 -26.16 v -6.505 C 71.245 39.208 70.35 38.312 69.245 38.312 z M 33.618 15.382 C 33.618 9.106 38.724 4 45 4 c 6.276 0 11.382 5.106 11.382 11.382 v 29.044 c 0 6.276 -5.105 11.382 -11.382 11.382 c -6.276 0 -11.382 -5.106 -11.382 -11.382 V 15.382 z M 67.245 46.817 c 0 12.266 -9.979 22.244 -22.245 22.244 s -22.245 -9.979 -22.245 -22.244 v -4.505 h 6.863 v 2.114 c 0 8.482 6.9 15.382 15.382 15.382 s 15.382 -6.9 15.382 -15.382 v -2.114 h 6.863 V 46.817 z"
        transform=" matrix(1 0 0 1 0 0) "
        strokeLinecap="round"
      />
    </G>
  </svg>
);
