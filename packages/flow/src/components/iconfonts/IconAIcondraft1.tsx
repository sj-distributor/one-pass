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

const IconAIcondraft1: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M826.71 123.904a38.827 38.827 0 0 1 38.826 38.827V308.48l-349.27 349.312-0.213 164.48 164.779 0.256 184.704-184.747V861.27a38.827 38.827 0 0 1-38.827 38.827H205.781a38.827 38.827 0 0 1-38.826-38.827V162.731a38.827 38.827 0 0 1 38.826-38.827H826.71zM895.7 388.139l54.912 54.869-301.866 301.867-54.955-0.086 0.085-54.826 301.867-301.824zM516.267 512H322.133v77.653h194.134V512zM632.66 356.779H322.176v77.61h310.485v-77.696z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAIcondraft1;
