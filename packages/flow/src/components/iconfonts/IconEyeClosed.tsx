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

const IconEyeClosed: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M937.6 643.2a47.957 47.957 0 0 1-41.6 72.021 47.147 47.147 0 0 1-41.6-24.021l-65.195-112.81c-36.693 22.997-76.245 41.13-117.589 54.015l20.779 117.59a47.53 47.53 0 0 1-38.827 55.594l-8.363 0.811a48 48 0 0 1-47.189-39.595l-20.395-114.773A493.653 493.653 0 0 1 512 656a585.301 585.301 0 0 1-66.005-4.01L425.6 766.762a48 48 0 0 1-47.19 39.637l-8.405-0.81a47.53 47.53 0 0 1-38.826-55.595L352 632.405a501.248 501.248 0 0 1-117.205-54.016l-65.579 113.664a48.427 48.427 0 0 1-41.6 23.979 48 48 0 0 1-41.6-71.979l71.595-123.989a569.856 569.856 0 0 1-66.816-70.4 48 48 0 1 1 74.41-60.416C228.395 467.2 339.584 560 512 560c172.373 0 283.605-92.8 346.795-170.795a48 48 0 1 1 74.41 60.374 599.312 599.312 0 0 1-66.816 70.826L937.643 643.2z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconEyeClosed;
