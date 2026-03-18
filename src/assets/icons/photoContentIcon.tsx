import React, {ReactElement} from 'react';
import Svg, {Path, Rect, Circle, SvgProps} from 'react-native-svg';

export const PhotoIcon = (props?: SvgProps): ReactElement => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
    {/* Outer circle */}
    <Circle
      cx="24"
      cy="24"
      r="22"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
    />
    {/* Outer frame */}
    <Rect
      x="10"
      y="15"
      width="28"
      height="18"
      rx="3"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Mountain shape */}
    <Path
      d="M10 28L17 20L22 26L27 22L38 28"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sun circle */}
    <Circle
      cx="18"
      cy="21"
      r="2"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
    />
  </Svg>
);
