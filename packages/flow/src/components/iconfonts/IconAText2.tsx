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

const IconAText2: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1088 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M202.624 288a53.312 53.312 0 0 0-53.312 53.312v341.376c0 29.44 23.872 53.312 53.312 53.312h682.688c29.44 0 53.312-23.872 53.312-53.312V341.312A53.312 53.312 0 0 0 885.312 288H202.624zM85.312 341.312c0-64.768 52.48-117.312 117.312-117.312h682.688c64.768 0 117.312 52.48 117.312 117.312v341.376c0 64.768-52.48 117.312-117.312 117.312H202.624A117.312 117.312 0 0 1 85.312 682.688V341.312z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M314.368 353.536q35.456 0 35.456 35.456v246.016q0 35.456-35.456 35.456t-35.456-35.456V388.992q0-35.456 35.456-35.456z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

export default IconAText2;
