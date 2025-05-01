import React, {ReactElement} from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const PlusIcon = (props?: SvgProps): ReactElement => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 8V16"
      stroke={props?.color || 'white'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 12H16"
      stroke={props?.color || 'white'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
