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

const IconEye: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 192c-213.333 0-395.52 132.693-469.333 320 73.813 187.307 256 320 469.333 320s395.52-132.693 469.333-320C907.52 324.693 725.333 192 512 192z m0 533.333c-117.76 0-213.333-95.573-213.333-213.333S394.24 298.667 512 298.667 725.333 394.24 725.333 512 629.76 725.333 512 725.333zM512 384c-70.827 0-128 57.173-128 128s57.173 128 128 128 128-57.173 128-128-57.173-128-128-128z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconEye;
