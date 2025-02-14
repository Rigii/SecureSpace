import React, {ReactElement} from 'react';
import Svg, {Circle, Rect} from 'react-native-svg';

export const LogoutSmallIcon = (): ReactElement => (
  <Svg width="30" height="30" viewBox="0 0 40 40" fill="none">
    <Rect
      x="10"
      y="5"
      width="20"
      height="32"
      rx="1.5"
      ry="1.5"
      stroke="#645050"
      strokeWidth="1.5"
      fill="none"
    />

    <Rect
      x="13"
      y="10"
      width="14"
      height="8"
      stroke="#645050"
      strokeWidth="1"
      fill="none"
    />

    <Rect
      x="13"
      y="22"
      width="14"
      height="8"
      stroke="#645050"
      strokeWidth="1"
      fill="none"
    />

    <Circle
      cx="26"
      cy="20"
      r="1"
      stroke="#645050"
      strokeWidth="1"
      fill="none"
    />
  </Svg>
);
