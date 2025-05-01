import React, {ReactElement} from 'react';
import Svg, {Path, Circle, SvgProps} from 'react-native-svg';

export const EnvelopeIcon = (props?: SvgProps): ReactElement => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
    {/* Background Circle */}
    <Circle cx="24" cy="24" r="24" fill="#00C6FF" />

    {/* Envelope Outer Rectangle */}
    <Path
      d="M15 17H33C33.5523 17 34 17.4477 34 18V30C34 30.5523 33.5523 31 33 31H15C14.4477 31 14 30.5523 14 30V18C14 17.4477 14.4477 17 15 17Z"
      stroke={props?.color || 'white'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Envelope Flap */}
    <Path
      d="M34 18L24 25L14 18"
      stroke={props?.color || 'white'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
