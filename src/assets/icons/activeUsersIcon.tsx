import React, {ReactElement} from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

export const ActiveUsersIcon = (): ReactElement => (
  <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    {/* Back user */}
    <Circle
      cx="25"
      cy="12"
      r="4"
      stroke="#645050"
      strokeWidth="1"
      fill="none"
    />
    <Path
      d="M19 22c0-3.5 3-6 6-6s6 2.5 6 6"
      stroke="#645050"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />

    {/* Front user */}
    <Circle
      cx="11"
      cy="12"
      r="4"
      stroke="#645050"
      strokeWidth="1"
      fill="none"
    />
    <Path
      d="M5 23c0-3.5 3-6 6-6s6 2.5 6 6"
      stroke="#645050"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);
