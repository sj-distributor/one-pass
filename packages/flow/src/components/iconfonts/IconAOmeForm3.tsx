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

const IconAOmeForm3: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 85.312a426.752 426.752 0 1 1 0 853.504 426.752 426.752 0 0 1 0-853.504z m0 64a362.752 362.752 0 1 0 0 725.44 362.752 362.752 0 0 0 0-725.44z m-0.128 106.624a255.936 255.936 0 1 1 0 511.872 255.936 255.936 0 0 1 0-511.872z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAOmeForm3;
