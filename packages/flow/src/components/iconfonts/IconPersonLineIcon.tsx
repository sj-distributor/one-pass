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

const IconPersonLineIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M341.333 597.461v179.371c3.968 2.816 11.435 7.04 24.875 12.117 35.285 13.355 88.277 21.718 145.792 21.718s110.507-8.363 145.792-21.76c13.44-5.035 20.907-9.259 24.875-12.032V597.589m0-0.17l-0.171-0.086h-340.95l-0.213 0.128m345.259 175.872c0.085 0-0.213 0.47-1.152 1.323 0.597-0.939 1.024-1.365 1.152-1.323z m-349.184 0c0.085 0 0.555 0.427 1.152 1.323-0.939-0.853-1.237-1.28-1.152-1.323z m61.696-346.666c30.08 26.538 69.632 42.666 112.896 42.666s82.773-16.128 112.896-42.666a170.667 170.667 0 1 0-225.792 0zM341.76 512A85.59 85.59 0 0 0 256 597.333V787.03c0 145.28 512 145.28 512 0V597.59A85.547 85.547 0 0 0 682.283 512H341.717zM512 384a85.333 85.333 0 1 0 0-170.667A85.333 85.333 0 0 0 512 384z"
        fill={getIconColor(color, 0, '#342A5E')}
      />
      <path
        d="M426.027 299.477a86.016 86.016 0 1 0 172.032 0 86.016 86.016 0 1 0-172.032 0zM342.357 596.907h340.48v179.541s-50.346 35.413-173.013 34.603c-122.624-0.768-167.467-34.603-167.467-34.603V596.864z"
        fill={getIconColor(color, 1, '#FFFFFF')}
      />
    </svg>
  );
};

export default IconPersonLineIcon;
