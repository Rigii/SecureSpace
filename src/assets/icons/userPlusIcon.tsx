import React, {ReactElement} from 'react';
import IIconProps from './iconTypes';
import {Path} from 'react-native-svg';

export const UserPlusIcon = (props: IIconProps): ReactElement => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88561 10.781C9.38551 10.281 8.70723 10 7.99999 10H3.33332C2.62608 10 1.9478 10.281 1.44771 10.781C0.947608 11.2811 0.666656 11.9594 0.666656 12.6667V14"
      stroke="white"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.66667 7.33333C7.13943 7.33333 8.33333 6.13943 8.33333 4.66667C8.33333 3.19391 7.13943 2 5.66667 2C4.19391 2 3 3.19391 3 4.66667C3 6.13943 4.19391 7.33333 5.66667 7.33333Z"
      stroke="white"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.3333 5.33337V9.33337"
      stroke="white"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.3333 7.33337H11.3333"
      stroke="white"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
