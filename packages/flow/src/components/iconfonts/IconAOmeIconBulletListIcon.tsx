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

const IconAOmeIconBulletListIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M810.688 682.688H469.312a42.688 42.688 0 1 0 0 85.312h341.376a42.688 42.688 0 0 0 0-85.312z m-469.376 42.624a42.688 42.688 0 1 0-85.312 0 42.688 42.688 0 0 0 85.312 0z m469.376-256H469.312a42.688 42.688 0 0 0 0 85.376h341.376a42.688 42.688 0 0 0 0-85.376zM341.312 512A42.688 42.688 0 1 0 256 512a42.688 42.688 0 0 0 85.312 0z m469.376-256H469.312a42.688 42.688 0 0 0 0 85.312h341.376a42.688 42.688 0 1 0 0-85.312z m-469.376 42.688a42.688 42.688 0 1 0-85.312 0 42.688 42.688 0 0 0 85.312 0z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAOmeIconBulletListIcon;
