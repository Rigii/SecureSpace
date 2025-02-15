import React, {ReactElement} from 'react';
import Svg, {Path} from 'react-native-svg';

export const SidebarIcon = (): ReactElement => (
  <Svg width="30" height="30" viewBox="0 0 40 40" fill="none">
    <Path
      d="M15 5V35M8.33333 5H31.6667C33.5076 5 35 6.49238 35 8.33333V31.6667C35 33.5076 33.5076 35 31.6667 35H8.33333C6.49238 35 5 33.5076 5 31.6667V8.33333C5 6.49238 6.49238 5 8.33333 5Z"
      stroke="#645050"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
