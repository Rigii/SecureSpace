import React, {ReactElement} from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export const AttachIcon = (props?: SvgProps): ReactElement => (
  <Svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
    <Path
      d="M33 22L23 32C20.7909 34.2091 17.2091 34.2091 15 32C12.7909 29.7909 12.7909 26.2091 15 24L25 14C26.3807 12.6193 28.6193 12.6193 30 14C31.3807 15.3807 31.3807 17.6193 30 19L20.5 28.5C19.8096 29.1904 18.6904 29.1904 18 28.5C17.3096 27.8096 17.3096 26.6904 18 26L27 17"
      stroke={props?.color || '#CE8946'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
