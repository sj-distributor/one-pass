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

const IconSort: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M641.664 325.632v408.96a42.624 42.624 0 1 0 85.312 0v-408.96l33.856 33.792a42.688 42.688 0 1 0 60.288-60.352L714.496 192.448a42.368 42.368 0 0 0-46.528-9.28 42.432 42.432 0 0 0-13.824 9.28L547.456 299.072a42.752 42.752 0 0 0 60.352 60.352l33.856-33.792z m-337.6 383.36v-408.96a42.688 42.688 0 1 1 85.376 0v408.96l33.792-33.856a42.688 42.688 0 0 1 60.352 60.352L376.896 842.112a42.368 42.368 0 0 1-46.464 9.28 42.368 42.368 0 0 1-13.824-9.28L209.92 735.488a42.752 42.752 0 0 1 60.352-60.352l33.792 33.856z"
        fill={getIconColor(color, 0, '#605DEC')}
      />
    </svg>
  );
};

export default IconSort;
