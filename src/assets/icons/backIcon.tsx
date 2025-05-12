import React, {ReactElement} from 'react';
import Svg, {Path} from 'react-native-svg';

export const BackIcon = (): ReactElement => (
  <Svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#645050"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
