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

const IconAOmeIconEditorEditIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M643.627 192.939a21.419 21.419 0 0 1 30.208 0.17l97.621 97.622a21.333 21.333 0 0 1 0.17 30.208L466.647 625.92l-128-128 304.98-304.981zM295.979 540.587l128 128-149.76 37.418c-11.52 2.902-18.603-3.925-15.659-15.658l37.419-149.76zM725.632 758.016H298.965a42.667 42.667 0 1 0 0 85.333h426.667a42.667 42.667 0 1 0 0-85.333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAOmeIconEditorEditIcon;
