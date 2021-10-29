export enum Gravity {
  NORTH = "no",
  SOUTH = "so",
  EAST = "ea",
  WEST = "we",
  NORTH_EAST = "noea",
  NORTH_WEST = "nowe",
  SOUTH_EAST = "soea",
  SOUTH_WEST = "sowe",
  CENTER = "ce",
  SMART = "sm",
}

export type Rotation = 0 | 90 | 180 | 270;

export enum ResizeType {
  FIT = "fit",
  FILL = "fill",
  FILL_DOWN = "fill-down",
  FORCE = "force",
  AUTO = "auto",
}

export enum ResizeAlgorithm {
  NEAREST = "nearest",
  LINEAR = "linear",
  CUBIC = "cubic",
  LANCZOS2 = "lanczos2",
  LANCZOS3 = "lanczos3",
}

export type Config = {
  host: string;
  key?: string;
  salt?: string;
  sourceSetSizes?: number[];
};

type AllSettings = {
  enlarge: boolean;
  width: number;
  height: number;
  maxWidth: number;
  minWidth: number;
  dpr: number;
  gravity: {
    type: Gravity;
    yOffset: number;
    xOffset: number;
  };
  resize: {
    type: ResizeType;
    algorithm: ResizeAlgorithm;
    width: number;
    height: number;
    extend: boolean;
    enlarge: boolean;
  };
  crop: {
    gravity: Gravity;
    width: number;
    height: number;
  };
  trim: {
    threshold: number;
    color: string;
    equalHor: boolean;
    equalVer: boolean;
  };
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  background: {
    r: string;
    g: string;
    b: string;
    hex: string;
    alpha: number;
  };
  autoRotate: boolean;
  blur: number;
  sharpen: number;
  pixelate: number;
  stripMetadata: boolean;
  stripColorProfile: boolean;
  rotation: Rotation;
  extension: string;
  extend: boolean;
  quality: number;
  cacheBuster: string;
  expires: number;
  fileName: string;
  maxBytes: number;
  extendGravity: Omit<Gravity, Gravity.SMART>;
};

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Settings = DeepPartial<AllSettings>;

export type PaddingWithOne = {
  padding: number;
  top?: undefined;
  left?: undefined;
  right?: undefined;
  bottom?: undefined;
  topBottom?: undefined;
  leftRight?: undefined;
};

export type PaddingLeftRight = {
  topBottom: number;
  leftRight: number;
  top?: undefined;
  left?: undefined;
  right?: undefined;
  bottom?: undefined;
  padding?: undefined;
};

export type PaddingEachSide = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  padding?: undefined;
  topBottom?: undefined;
  leftRight?: undefined;
};

export type Padding = PaddingWithOne | PaddingEachSide | PaddingLeftRight;
