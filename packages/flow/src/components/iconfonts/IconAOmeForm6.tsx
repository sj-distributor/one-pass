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

const IconAOmeForm6: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M310.912 585.024a41.344 41.344 0 0 0 30.4 12.288 41.344 41.344 0 0 0 30.464-12.288A41.28 41.28 0 0 0 384 554.688a41.408 41.408 0 0 0-12.224-30.464A41.408 41.408 0 0 0 341.312 512a41.408 41.408 0 0 0-30.4 12.224 41.408 41.408 0 0 0-12.224 30.464c0 12.032 4.032 22.208 12.224 30.336z m170.688 0a41.152 41.152 0 0 0 30.4 12.288 41.344 41.344 0 0 0 30.4-12.288 41.28 41.28 0 0 0 12.288-30.336 41.408 41.408 0 0 0-12.288-30.464A41.408 41.408 0 0 0 512 512a41.28 41.28 0 0 0-30.4 12.224 41.344 41.344 0 0 0-12.288 30.464c0 12.032 4.096 22.208 12.288 30.336z m170.688 0a41.216 41.216 0 0 0 30.4 12.288 41.152 41.152 0 0 0 30.336-12.288 41.152 41.152 0 0 0 12.288-30.336 41.344 41.344 0 0 0-12.288-30.464A41.216 41.216 0 0 0 682.688 512a41.28 41.28 0 0 0-30.4 12.224A41.344 41.344 0 0 0 640 554.688c0 12.032 4.096 22.208 12.288 30.336zM153.088 913.6c16.64 16.704 36.8 25.088 60.224 25.088h363.712v-0.64A42.496 42.496 0 0 0 576 853.632v-0.256H213.312V426.688h597.376v150.144h0.128v0.512A42.624 42.624 0 1 0 896 575.04V256c0-23.488-8.32-43.52-25.024-60.224a82.24 82.24 0 0 0-60.288-25.088H768V85.312h-85.312v85.376H341.312V85.312H256v85.376h-42.688c-23.424 0-43.52 8.32-60.288 25.088-16.64 16.64-25.024 36.736-25.024 60.16v597.376c0 23.488 8.32 43.52 25.024 60.288z m507.008-43.456c0-23.68 19.2-42.944 42.944-42.944h221.44a42.944 42.944 0 0 1 0 85.888H703.04c-23.68 0-42.88-19.2-42.88-42.88z m122.688-178.048a42.944 42.944 0 0 0 0 85.952h141.632a42.944 42.944 0 1 0 0-85.952H782.784z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAOmeForm6;
