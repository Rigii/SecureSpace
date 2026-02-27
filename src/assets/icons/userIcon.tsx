import React, {ReactElement} from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

export const UserIcon = ({color}: {color?: string}): ReactElement => (
  <Svg width="30" height="30" viewBox="0 0 20 30" fill="none">
    <Circle
      cx="14"
      cy="12"
      r="4"
      stroke={color || '#645050'}
      strokeWidth="1"
      fill="none"
    />
    <Path
      d="M6 23c0-3.5 4-6 8-6s8 2.5 8 6"
      stroke={color || '#645050'}
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);
