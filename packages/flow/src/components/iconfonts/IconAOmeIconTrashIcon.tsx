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

const IconAOmeIconTrashIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M213.333 213.333A42.667 42.667 0 0 0 170.667 256v42.667h682.666V256a42.667 42.667 0 0 0-42.666-42.667H213.333z m475.734 640H334.72a42.667 42.667 0 0 1-42.07-35.626l-79.317-476.374h597.334L731.136 817.75a42.667 42.667 0 0 1-42.07 35.584zM384 192a21.333 21.333 0 0 1 20.95-21.333h214.1A21.333 21.333 0 0 1 640 192v21.333H384V192z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAOmeIconTrashIcon;
