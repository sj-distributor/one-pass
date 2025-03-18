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

const IconAOmeForm8: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M830.464 237.888c-29.376-32-82.304-33.92-117.632 1.344l-345.6 345.6c-8.96 8.96-8.96 20.288 0 29.248s20.352 8.96 29.312 0l285.824-285.824a42.688 42.688 0 0 1 60.352 60.288L456.832 674.432a104.448 104.448 0 0 1-149.888 0 104.512 104.512 0 0 1 0-149.952l345.6-345.6c66.816-66.88 175.552-69.056 240.192 0.64 66.24 66.944 68.16 175.104-1.28 239.488L486.72 823.744a233.28 233.28 0 0 1-333.44 0 233.28 233.28 0 0 1 0-333.44l345.6-345.536a42.688 42.688 0 0 1 60.352 60.352l-345.6 345.6c-60.16 60.16-60.16 152.576 0 212.736s152.576 60.16 212.736 0L831.744 358.08l1.28-1.28c32-29.312 33.984-82.304-1.28-117.568a43.008 43.008 0 0 1-1.28-1.28z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAOmeForm8;
