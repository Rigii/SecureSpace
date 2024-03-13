import React, {ReactElement} from 'react';
import IIconProps from './iconTypes';
import {Path} from 'react-native-svg';

export const PinIcon = (props: IIconProps): ReactElement => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M6.66667 7V1.4H7.33333V0H0.666667V1.4H1.33333V7L0 8.4V9.8H3.46667V14H4.53333V9.8H8V8.4L6.66667 7Z"
      fill="#92B3F2"
    />
  </svg>
);
