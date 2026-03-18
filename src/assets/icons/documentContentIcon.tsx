import React, {ReactElement} from 'react';
import Svg, {Circle, Path, SvgProps} from 'react-native-svg';

export const DocumentIcon = (props?: SvgProps): ReactElement => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
    {/* Outer circle */}
    <Circle
      cx="24"
      cy="24"
      r="22"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
    />
    {/* Page outline with folded corner */}
    <Path
      d="M16 10H28L34 16V38C34 38.5523 33.5523 39 33 39H16C15.4477 39 15 38.5523 15 38V11C15 10.4477 15.4477 10 16 10Z"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Folded corner */}
    <Path
      d="M28 10V16H34"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Text lines */}
    <Path
      d="M19 24H30"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M19 29H30"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M19 34H24"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
