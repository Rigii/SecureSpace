import React, {ReactElement} from 'react';
import Svg, {Path} from 'react-native-svg';

export const DeclineIcon = (): ReactElement => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    style={{marginTop: -2}}>
    <Path
      d="M18.3 5.71L12 12.01L5.7 5.71L4.29 7.12L10.59 13.41L4.29 19.71L5.7 21.12L12 14.83L18.3 21.12L19.71 19.71L13.41 13.41L19.71 7.12L18.3 5.71Z"
      fill="white"
    />
  </Svg>
);
