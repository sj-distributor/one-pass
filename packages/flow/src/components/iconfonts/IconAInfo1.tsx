/* tslint:disable */
/* eslint-disable */

import { CSSProperties, SVGAttributes, FunctionComponent } from 'react';
import { getIconColor } from './helper';
import React from 'react';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: CSSProperties = {
  display: 'block',
};

const IconAInfo1: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M465.788 242.787L117.925 524.75c-16.35 13.213-24.047 39.474-17.044 58.5l4.062 11.232c6.937 19.092 29.994 34.254 50.672 33.89l46.708-0.858 250.285-4.195 150.792-2.61c21.075-0.396 32.537-15.888 25.435-35.543l-120.7-331.544c-4.36-11.892-13.378-18.234-23.453-18.234a30.191 30.191 0 0 0-18.894 7.4zM222.142 675.212l72.44 198.954a41.29 41.29 0 1 0 77.56-28.243L308.62 671.348l-86.478 3.864z m566.14-376.171l-116.406 42.347a41.257 41.257 0 1 0 28.243 77.593l116.438-42.413a41.29 41.29 0 1 0-28.275-77.626v0.066zM714.29 457.794a41.555 41.555 0 0 0-26.591 31.612 41.39 41.39 0 0 0 33.494 47.864l121.988 21.47a41.29 41.29 0 0 0 46.345-53.71l-0.694-1.949a41.191 41.191 0 0 0-31.315-25.633l-122.02-21.537a40.233 40.233 0 0 0-21.207 1.883zM691.662 142.37l-79.64 94.902a41.29 41.29 0 1 0 63.256 53.083l79.608-94.87a41.29 41.29 0 0 0-63.224-53.115z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAInfo1;
