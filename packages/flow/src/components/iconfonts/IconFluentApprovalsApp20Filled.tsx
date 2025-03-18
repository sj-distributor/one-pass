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

const IconFluentApprovalsApp20Filled: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M500.736 36.864a38.4 38.4 0 0 0-54.272 54.272l62.464 62.464H486.4a384 384 0 1 0 384 384 38.4 38.4 0 1 0-76.8 0 307.2 307.2 0 1 1-310.35-307.2l-36.825 36.864a38.4 38.4 0 0 0 54.311 54.272l115.2-115.2a38.4 38.4 0 0 0 0-54.272l-115.2-115.2z m191.488 319.488a38.4 38.4 0 0 1 1.024 54.272l-197.12 204.8a38.44 38.44 0 0 1-55.296 0l-84.48-87.749a38.4 38.4 0 1 1 55.296-53.248l56.832 58.959 169.472-176.01a38.4 38.4 0 0 1 54.272-1.024z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconFluentApprovalsApp20Filled;
