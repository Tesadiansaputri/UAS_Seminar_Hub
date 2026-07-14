import type { CSSProperties } from 'react';
import logoSrc from '../assets/seminarhub-logo.png';

type BrandLogoProps = {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  style?: CSSProperties;
  className?: string;
};

const BrandLogo = ({
  width = 156,
  height = 'auto',
  style,
  className,
}: BrandLogoProps) => (
  <img
    src={logoSrc}
    alt="SeminarHub"
    className={className}
    style={{
      display: 'block',
      width,
      height,
      objectFit: 'contain',
      ...style,
    }}
  />
);

export default BrandLogo;
