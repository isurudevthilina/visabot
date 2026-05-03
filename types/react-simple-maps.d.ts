declare module 'react-simple-maps' {
  import * as React from 'react';

  interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
    parallels?: [number, number];
    precision?: number;
  }

  interface ComposableMapProps {
    projection?: string | ((width: number, height: number) => any);
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  interface GeographyStyle {
    default?: React.CSSProperties;
    hover?: React.CSSProperties;
    pressed?: React.CSSProperties;
  }

  interface GeographyProps {
    geography?: any;
    style?: GeographyStyle;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
    onMouseUp?: (event: React.MouseEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    className?: string;
    tabable?: boolean;
  }

  interface GeographiesProps {
    geography?: string | object | any;
    children?: (props: { geographies: any[]; path: any }) => React.ReactNode;
    parseGeographies?: (geographies: any[]) => any[];
  }

  interface MarkerProps {
    coordinates: [number, number];
    style?: GeographyStyle;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
    onMouseUp?: (event: React.MouseEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    className?: string;
    tabable?: boolean;
    children?: React.ReactNode;
  }

  interface LineProps extends Omit<React.SVGProps<SVGPathElement>, 'from' | 'to' | 'style'> {
    from: [number, number];
    to: [number, number];
    coordinates?: [number, number][];
    style?: GeographyStyle & React.CSSProperties;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
    onMouseUp?: (event: React.MouseEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    className?: string;
    tabable?: boolean;
    children?: React.ReactNode;
  }

  interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (event: any, position: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (event: any, position: { coordinates: [number, number]; zoom: number }) => void;
    onMoveEnd?: (event: any, position: { coordinates: [number, number]; zoom: number }) => void;
    disablePanning?: boolean;
    disableZooming?: boolean;
    className?: string;
    children?: React.ReactNode;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Line: React.FC<LineProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
}
