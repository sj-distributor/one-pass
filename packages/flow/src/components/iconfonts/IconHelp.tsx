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

const IconHelp: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M471.04 711.23a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 0 0-81.92 0zM512 96.83c-226.1 0-409.6 183.5-409.6 409.6s183.5 409.6 409.6 409.6 409.6-183.501 409.6-409.6S738.1 96.83 512 96.83z m0 737.28c-180.634 0-327.68-147.047-327.68-327.68S331.366 178.75 512 178.75s327.68 147.046 327.68 327.68S692.634 834.11 512 834.11z m0-573.44a163.84 163.84 0 0 0-158.802 123.289c-5.57 21.914 13.312 40.55 35.922 40.55s40.14-19.456 51.036-39.28c13.968-25.395 40.96-42.64 71.844-42.64 45.056 0 81.92 36.864 81.92 81.92 0 72.5-96.174 72.786-118.374 164.127C470.22 610.591 489.39 629.31 512 629.31s40.018-19.25 49.848-39.649c28.263-58.409 113.992-79.626 113.992-165.15 0-90.522-73.318-163.84-163.84-163.84z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconHelp;
