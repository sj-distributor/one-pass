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

const IconAUndrawMyPasswordReYdq712: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1053 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M670.872 230.91H615.23V705.3a56.678 56.678 0 0 1-56.678 56.678H133.137v0.544a56.687 56.687 0 0 0 56.678 56.678h481.052a56.649 56.649 0 0 0 40.08-16.603 56.678 56.678 0 0 0 16.599-40.075V287.588a56.682 56.682 0 0 0-56.679-56.678z m263.775 753.879a4.796 4.796 0 0 0 4.921-5.824 4.842 4.842 0 0 0-1.432-2.511l-0.333-1.311 0.13-0.312a12.903 12.903 0 0 1 11.943-7.88 12.929 12.929 0 0 1 11.883 7.969c3.898 9.384 8.858 18.781 10.08 28.705a38.263 38.263 0 0 1-0.674 13.14 153.136 153.136 0 0 0 13.936-63.62 147.81 147.81 0 0 0-3.026-29.868 154.948 154.948 0 0 0-30.728-65.675 41.255 41.255 0 0 1-17.151-17.796 31.42 31.42 0 0 1-2.862-8.596c0.835 0.11 3.148-12.604 2.52-13.388 1.163-1.766 3.245-2.642 4.518-4.366 6.316-8.567 15.027-7.07 19.574 4.573 9.709 4.9 9.801 13.03 3.843 20.846-3.789 4.973-4.311 11.702-7.636 17.029 0.341 0.438 0.7 0.864 1.04 1.302a156.061 156.061 0 0 1 16.28 25.785 64.846 64.846 0 0 1 3.868-30.113c3.704-8.938 10.649-16.464 16.763-24.192a13.308 13.308 0 0 1 23.704 6.536l0.038 0.34a45.07 45.07 0 0 0-2.668 1.632 6.515 6.515 0 0 0-0.838 10.185 6.535 6.535 0 0 0 3.468 1.69l0.13 0.017a64.188 64.188 0 0 1-1.71 9.704c7.846 30.341-9.09 41.39-33.274 41.888-0.535 0.273-1.053 0.547-1.589 0.809a159.293 159.293 0 0 1 8.572 40.323 151.4 151.4 0 0 1-0.11 24.378l0.038-0.286a39.92 39.92 0 0 1 13.62-23.038c10.484-8.61 25.288-11.778 36.598-18.702a7.484 7.484 0 0 1 11.466 7.286l-0.046 0.304a43.522 43.522 0 0 0-7.58 3.999 6.515 6.515 0 0 0-0.835 10.185 6.532 6.532 0 0 0 3.464 1.685l0.134 0.021 0.274 0.043a65.094 65.094 0 0 1-11.95 18.71c-4.906 26.485-25.976 28.996-48.512 21.285h-0.013a159.154 159.154 0 0 1-10.69 31.208h-38.188c-0.139-0.425-0.261-0.863-0.383-1.285 3.531 0.22 7.084 0.009 10.564-0.632-2.831-3.476-5.668-6.978-8.5-10.455a2.697 2.697 0 0 1-0.176-0.206c-1.437-1.779-2.891-3.544-4.328-5.327a63.728 63.728 0 0 1 1.863-16.194z"
        fill={getIconColor(color, 0, '#F2F2F2')}
      />
      <path
        d="M514.019 166.381a17.471 17.471 0 0 0 26.421 3.232l79.396 35.82 15.31-19.524-94.613-41.854a17.459 17.459 0 0 0-29.203 10.22 17.454 17.454 0 0 0 2.689 12.106z"
        fill={getIconColor(color, 1, '#A0616A')}
      />
      <path
        d="M854.766 188.715l7.872 44.626a15.191 15.191 0 0 1-2.942 11.918 15.17 15.17 0 0 1-10.8 5.832l-133.807 10.522-157.287-70.39 18.786-35.663 136.537 43.235 141.641-10.08z"
        fill={getIconColor(color, 2, '#605DEC')}
      />
      <path
        d="M541.6 156.735H60.537c-31.301 0-56.678 25.377-56.678 56.678v474.934c0 31.302 25.377 56.678 56.678 56.678H541.6c31.302 0 56.678-25.376 56.678-56.678V213.413c0-31.301-25.376-56.678-56.678-56.678z"
        fill={getIconColor(color, 3, '#F2F2F2')}
      />
      <path
        d="M60.538 168.391a45.022 45.022 0 0 0-45.022 45.022v474.934a45.027 45.027 0 0 0 45.022 45.022h307.023a219.064 219.064 0 0 0 219.06-219.056v-300.9a45.022 45.022 0 0 0-45.022-45.022H60.54z"
        fill={getIconColor(color, 4, '#FFFFFF')}
      />
      <path
        d="M435.546 312.526H165.538a9.342 9.342 0 0 1 0-18.684h270.008a9.347 9.347 0 0 1 6.607 15.945 9.346 9.346 0 0 1-6.607 2.74z m0 199.213H165.538a9.338 9.338 0 0 1 0-18.685h270.008a9.342 9.342 0 1 1 0 18.685z m109.643-99.543H55.894a9.342 9.342 0 0 1 0-18.685H545.19a9.347 9.347 0 0 1 0 18.685z"
        fill={getIconColor(color, 5, '#F2F2F2')}
      />
      <path
        d="M837.86 385.399l-48.744 103.845 187.506-18.988-39.14-99.69-99.622 14.833z m43.593 596.857l-17.779-0.147-7.871-70.172 26.24 0.22-0.59 70.1z"
        fill={getIconColor(color, 6, '#A0616A')}
      />
      <path
        d="M824.505 1010.528a7.969 7.969 0 0 0 7.88 8.015l35.348 0.295 6.19-12.541 2.271 12.604 13.338 0.122-3.367-44.963-4.64-0.308-18.93-1.306-6.105-0.409-0.106 12.722-28.394 19.258a7.964 7.964 0 0 0-3.485 6.51z"
        fill={getIconColor(color, 7, '#323249')}
      />
      <path
        d="M684.71 982.336l-16.948-5.368 13.093-69.384 25.014 7.918-21.159 66.834z"
        fill={getIconColor(color, 8, '#A0616A')}
      />
      <path
        d="M621.973 992.627a7.936 7.936 0 0 0 0.526 6.06 7.945 7.945 0 0 0 4.648 3.919l33.704 10.67 9.6-10.173-1.535 12.718 12.714 4.037 9.991-43.97-4.344-1.66-17.707-6.81-5.719-2.182-3.839 12.128-32.797 10.067a7.93 7.93 0 0 0-5.242 5.196z m346.112-551.574l-170.49 31.239s-27.349 20.454-20.033 27.778c7.315 7.328 8.449 6.195 3.645 10.999-4.809 4.808-15.196 11.23-15.301 15.436-0.101 4.205-76.396 192.82-76.396 192.82s8.479-4.24 2.12 2.119-6.36 11.61-6.36 11.61L655.6 933.37l48.187 2.836 47.184-182.622 105.24-170.612s10.443 152.142 10.881 162.26c0.438 10.122 6.793-2.596 0.438 10.122-6.359 12.713-10.598 4.235-6.359 12.713 4.24 8.479-15.267 181.059-15.267 181.059h43.981l94.326-357.713s33.56-102.265-16.126-150.36z"
        fill={getIconColor(color, 9, '#323249')}
      />
      <path
        d="M917.858 154.923l-68.292-7.092-17.695 22.966-20.61 10.982a51.453 51.453 0 0 0-27.16 48.663l24.088 140.124s-20.345 45.819-6.36 57.222c13.991 11.403-10.812 39.645 19.078 25.431 29.89-14.214 158.943 2.12 158.943 2.12l-27.551-78.414 20.581-77.053 2.267-64.605a54.752 54.752 0 0 0-38.865-54.31l-2.879-0.872-15.545-25.158z"
        fill={getIconColor(color, 10, '#605DEC')}
      />
      <path
        d="M1011.876 102.569c0.451 19.25-6.742 37.888-17.079 54.259-3.072-9.557-8.592-18.255-14.349-26.548a82.636 82.636 0 0 1-8.794 52.338 10.956 10.956 0 0 1-0.94 0.606c-8.424 5.066-19.106 7.118-28.217 3.456 18.828-20.295 21.226-53.922 5.44-76.686-4.47-6.46-10.252-12.17-13.017-19.524-4.374-11.727-0.172-24.643 2.478-36.872 2.478-11.378 2.912-24.926-4.724-33.265a8.057 8.057 0 0 1 7.358-3.384c4.707 0.661 8.133 4.753 10.316 8.967 2.183 4.214 3.62 8.887 6.662 12.528 5.634 6.814 15.225 8.424 23.312 12.014 19.574 8.723 31.087 30.69 31.554 52.11z"
        fill={getIconColor(color, 11, '#323249')}
      />
      <path
        d="M507.508 1019.002a2.507 2.507 0 0 0 2.52 2.52h536.79a2.52 2.52 0 1 0 0-5.044h-536.79a2.541 2.541 0 0 0-1.783 0.737 2.507 2.507 0 0 0-0.737 1.787z"
        fill={getIconColor(color, 12, '#CCCCCC')}
      />
      <path
        d="M1016.103 548.712a19.073 19.073 0 1 0 0.004-38.149 19.073 19.073 0 0 0-0.004 38.15z"
        fill={getIconColor(color, 13, '#605DEC')}
      />
      <path
        d="M847.088 91.566c1.121-3.92-6.59 20.016-2.87 20.45 16.945 1.943 40.21 12.065 52.014 16.785a46.212 46.212 0 0 0 1.58-0.198 46.244 46.244 0 0 0 3.721-0.574c27.484-5.2 38.052-47.415 38.052-47.803 0-1.896-4.555-54.023-11.731-54.799a52.886 52.886 0 0 0-5.677-0.307h-17.804a82.822 82.822 0 0 0-11.18-1.619h-0.029c-35.848-2.734-64.116 19.12-61.474 45.705 0.017 0.03 0.047 0.06 0.063 0.093a54.799 54.799 0 0 1 3.52 6.03c3.265 6.793-5.133 15.335 0.433 16.928 7.408 2.124-19.477 71.832 9.84 71.832-14.26 4.053-1.542-61.723 1.542-72.523z"
        fill={getIconColor(color, 14, '#323249')}
      />
      <path
        d="M879.09 132.467c23.286 0 42.16-18.879 42.16-42.161s-18.874-42.161-42.16-42.161c-23.283 0-42.162 18.879-42.162 42.16 0 23.287 18.879 42.162 42.161 42.162z"
        fill={getIconColor(color, 15, '#A0616A')}
      />
      <path
        d="M831.69 71.503c0.704 0.37 1.39 0.712 2.095 1.054 0.737 0.353 1.47 0.707 2.204 1.032 14.116 6.405 25.608 7.113 32.582-2.086a38.971 38.971 0 0 1 3.203-14.041 22.583 22.583 0 0 0 3.72 14.041h14.042c14.462 9.6 21.887 10.602 11.85 42.11-2.799 8.782-13.928 59.873-9.55 67.45 1.269-0.14 14.741-56.101 15.959-56.333 27.484-5.2 44.946-50.48 42.713-53.042a47.21 47.21 0 0 0-4.897-20.998 48.3 48.3 0 0 0-18.352-19.97 85.038 85.038 0 0 0-14.664-5.508l-0.358-0.092a86.534 86.534 0 0 0-14.59-2.626 7.45 7.45 0 0 0-4.454 1.003c-0.016 0-0.016 0.017-0.029 0.017a7.109 7.109 0 0 0-2.099 1.867 7.16 7.16 0 0 0-1.53 4.462h-15.633a32.616 32.616 0 0 0-1.736 0.043 41.92 41.92 0 0 0-40.476 41.617z"
        fill={getIconColor(color, 16, '#323249')}
      />
      <path
        d="M923.871 58.027a27.774 27.774 0 1 0 0-55.55 27.774 27.774 0 0 0 0 55.55z"
        fill={getIconColor(color, 17, '#323249')}
      />
      <path
        d="M1016.318 537.503a17.433 17.433 0 0 0 1.934-14.53 17.522 17.522 0 0 0-9.81-10.893l0.139-87.103-24.083-5.963 0.59 103.458a17.454 17.454 0 0 0 31.23 15.031z"
        fill={getIconColor(color, 18, '#A0616A')}
      />
      <path
        d="M897.053 217.535l37.48-25.47a15.15 15.15 0 0 1 17.74 0.498 15.196 15.196 0 0 1 4.084 4.761l64.432 117.744 0.249 172.318-40.227-2.52-16.515-142.264-67.243-125.072z"
        fill={getIconColor(color, 19, '#605DEC')}
      />
      <path
        d="M609.221 608.328h-400.54a32.844 32.844 0 1 0 0 65.696h400.54a32.848 32.848 0 1 0 0-65.696z"
        fill={getIconColor(color, 20, '#FFFFFF')}
      />
      <path
        d="M609.221 676.143h-400.54a34.968 34.968 0 1 1 0-69.935h400.54a34.947 34.947 0 0 1 24.723 10.244 34.947 34.947 0 0 1 0 49.451 34.96 34.96 0 0 1-24.723 10.24z m-400.54-65.696a30.72 30.72 0 0 0-30.733 30.729 30.737 30.737 0 0 0 30.729 30.728H609.22a30.728 30.728 0 1 0 0-61.457h-400.54z m424.16 141.232H456.075a9.338 9.338 0 0 1 0-18.68H632.84a9.334 9.334 0 0 1 9.339 9.342 9.334 9.334 0 0 1-9.339 9.338z"
        fill={getIconColor(color, 21, '#342A5E')}
      />
    </svg>
  );
};

export default IconAUndrawMyPasswordReYdq712;
