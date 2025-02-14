import React, {ReactElement} from 'react';
import Svg, {Path} from 'react-native-svg';

export const ChatIcon = (): ReactElement => (
  <Svg width="30" height="30" viewBox="0 0 40 40" fill="none">
    <Path
      d="M35 25C35 25.8841 34.6488 26.7319 34.0237 27.357C33.3986 27.9821 32.5507 28.3333 31.6667 28.3333H11.6667L5 35V8.33333C5 7.44928 5.35119 6.60143 5.97631 5.97631C6.60143 5.35119 7.44928 5 8.33333 5H31.6667C32.5507 5 33.3986 5.35119 34.0237 5.97631C34.6488 6.60143 35 7.44928 35 8.33333V25Z"
      stroke="#645050"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);
