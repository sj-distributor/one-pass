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

const IconSendIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M297.728 831.019c0 58.496 70.187 87.125 109.952 44.8l512.128-546.304c40.96-43.862 10.453-116.182-48.981-116.182H149.163c-56.235 0-84.907 68.566-45.995 109.739l194.56 205.995v301.952z m85.035-53.974V494.293l-218.24-231.082c12.928 13.738 3.328 36.565-15.36 36.565h681.13l-447.53 477.27z"
        fill={getIconColor(color, 0, '#342A5E')}
      />
      <path
        d="M359.083 550.485l171.093-83.2a44.373 44.373 0 0 0 20.224-58.24 41.813 41.813 0 0 0-56.49-20.864l-171.094 83.2c-21.205 10.326-30.293 36.395-20.267 58.198a41.899 41.899 0 0 0 56.534 20.906z"
        fill={getIconColor(color, 1, '#342A5E')}
      />
    </svg>
  );
};

export default IconSendIcon;
