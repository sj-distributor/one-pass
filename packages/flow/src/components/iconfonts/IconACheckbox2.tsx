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

const IconACheckbox2: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1088 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M245.312 160A53.312 53.312 0 0 0 192 213.312v597.376c0 29.44 23.872 53.312 53.312 53.312h597.376c29.44 0 53.312-23.872 53.312-53.312V213.312A53.312 53.312 0 0 0 842.688 160H245.312zM128 213.312C128 148.544 180.48 96 245.312 96h597.376C907.456 96 960 148.48 960 213.312v597.376C960 875.456 907.52 928 842.688 928H245.312A117.312 117.312 0 0 1 128 810.688V213.312z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M480 680L320 521.28 370.88 472 480 579.2 717.12 344 768 394.56 480 680z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

export default IconACheckbox2;
