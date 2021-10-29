import * as createHmac from "create-hmac";
import { decodeHex } from "./helpers/hex";
import { urlSafeBase64 } from "./helpers/urlToBase64";
import type { Config, Gravity, Padding, Rotation, Settings } from "./types/imgproxy.types";
import { ResizeAlgorithm, ResizeType } from "./types/imgproxy.types";

export class Imgproxy {
  private readonly config: Config;

  private settings: Settings = {};

  constructor(config: Config) {
    this.config = config;
  }

  setWidth(width: number) {
    this.settings.width = width;

    return this;
  }

  setHeight(height: number) {
    this.settings.height = height;

    return this;
  }

  setSize(width: number, height: number) {
    this.settings.width = width;
    this.settings.height = height;

    return this;
  }

  setDpr(dpr: number) {
    this.settings.dpr = dpr;

    return this;
  }

  setPadding(padding: Padding) {
    if (padding.padding) {
      const pad = padding.padding;
      this.settings.padding = {
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
      };
    } else if (padding.leftRight) {
      const { leftRight, topBottom } = padding;
      this.settings.padding = {
        top: topBottom,
        bottom: topBottom,
        left: leftRight,
        right: leftRight,
      };
    } else {
      this.settings.padding = padding;
    }

    return this;
  }

  crop(width: number, height: number, gravity?: Gravity) {
    this.settings.crop = {
      height,
      width,
      gravity,
    };

    return this;
  }

  setBackground(hex: string, g?: string, b?: string);

  setBackground(r: string, g: string, b: string) {
    if (r && g && b) {
      this.settings.background = {
        ...this.settings.background,
        r,
        g,
        b,
      };
    } else {
      this.settings.background = {
        ...this.settings.background,
        hex: r,
      };
    }

    return this;
  }

  setBackgroundAlpha(alpha: number) {
    this.settings.background = {
      ...this.settings.background,
      alpha,
    };

    return this;
  }

  blur(sigma: number) {
    this.settings.blur = sigma;

    return this;
  }

  setQuality(quality: number) {
    this.settings.quality = quality;

    return this;
  }

  setExtension(extension: string) {
    this.settings.extension = extension;

    return this;
  }

  setCacheBuster(buster: string) {
    this.settings.cacheBuster = buster;

    return this;
  }

  sharpen(sigma: number) {
    this.settings.sharpen = sigma;

    return this;
  }

  stripMetadata() {
    this.settings.stripMetadata = true;

    return this;
  }

  stripColorProfile() {
    this.settings.stripColorProfile = true;

    return this;
  }

  setMaxBytes(bytes: number) {
    this.settings.maxBytes = bytes;

    return this;
  }

  resize(type: ResizeType, width: number, height: number, enlarge: boolean, extend: boolean) {
    this.settings.resize = {
      type,
      width,
      height,
      enlarge,
      extend,
    };

    return this;
  }

  enlarge() {
    this.settings.enlarge = true;

    return this;
  }

  setFileName(fileName: string) {
    this.settings.fileName = fileName;

    return this;
  }

  setExpiringDate(timestamp: number) {
    this.settings.expires = timestamp;

    return this;
  }

  autoRotate() {
    this.settings.autoRotate = true;

    return this;
  }

  setRotation(angle: Rotation) {
    this.settings.rotation = angle;

    return this;
  }

  setGravity(gravity: Gravity, xOffset?: number, yOffset?: number) {
    this.settings.gravity = {
      type: gravity,
      xOffset,
      yOffset,
    };

    return this;
  }

  trim(threshold: number, color?: string, equalHor?: boolean, equalVer?: boolean) {
    this.settings.trim = {
      threshold,
      color,
      equalHor,
      equalVer,
    };

    return this;
  }

  getSourceSet(sourceImg: string, options: Settings, sizes?: number[]) {
    const sourceSetSizes = sizes || this.config.sourceSetSizes;
    if (!sourceSetSizes) {
      throw new Error(
        "No sizes defined. Either pass a second argument or pass an array containing sizes in the constructor."
      );
    }
    let srcString = "";
    sourceSetSizes.forEach((size, index) => {
      this.settings = options;
      this.settings.width = size;
      srcString += `${this.generate(sourceImg)} ${size}w`;
      if (index !== sourceSetSizes.length - 1) {
        srcString += ",";
      }
    });

    return srcString;
  }

  generate(sourceImg: string) {
    let url = "";

    if (this.settings.width) {
      url += `w:${this.settings.width}/`;
    }

    if (this.settings.height) {
      url += `h:${this.settings.height}/`;
    }

    if (this.settings.enlarge) {
      url += "el:1/";
    }

    if (this.settings.resize) {
      const { height = 0, width = 0, type = ResizeType.FIT, enlarge = false, extend = false } = this.settings.resize;
      url += `rs:${type}:${width}:${height}:${enlarge}:${extend}/`;
      if (this.settings.resize) {
        url += `ra:${this.settings.resize.algorithm || ResizeAlgorithm.LANCZOS2}/`;
      }
    }

    if (this.settings.dpr) {
      url += `dpr:${this.settings.dpr}/`;
    }

    if (this.settings.gravity) {
      url += `g:${this.settings.gravity.type}:${this.settings.gravity.xOffset || 0}:${
        this.settings.gravity.yOffset || 0
      }/`;
    }

    if (this.settings.crop) {
      url += `c:${this.settings.crop.width}:${this.settings.crop.height}`;
      if (this.settings.crop.gravity) {
        url += `:${this.settings.crop.gravity}`;
      }
      url += "/";
    }

    if (this.settings.padding) {
      const { top, left, right, bottom } = this.settings.padding;
      url += `pd:${top}:${left}:${right}:${bottom}/`;
    }

    if (this.settings.trim) {
      const { threshold, color = "", equalHor = 0, equalVer = 0 } = this.settings.trim;
      url += `t:${threshold}:${color}:${equalHor}:${equalVer}/`;
    }

    if (this.settings.autoRotate) {
      url += `ar:${this.settings.autoRotate}/`;
    }

    if (this.settings.rotation) {
      url += `rot:${this.settings.rotation}/`;
    }

    if (this.settings.background) {
      const { r, g, b, hex, alpha } = this.settings.background;
      if (r && g && b) {
        url += `bg:${r}:${g}:${b}/`;
      } else if (hex) {
        url += `bg:${hex}/`;
      }
      if (alpha) {
        url += `ba:${alpha}/`;
      }
    }

    if (this.settings.blur) {
      url += `bl:${this.settings.blur}/`;
    }

    if (this.settings.sharpen) {
      url += `sh:${this.settings.sharpen}/`;
    }

    if (this.settings.stripMetadata) {
      url += `sm:1/`;
    }

    if (this.settings.stripColorProfile) {
      url += `scp:1/`;
    }

    if (this.settings.quality) {
      url += `q:${this.settings.quality}/`;
    }

    if (this.settings.maxBytes) {
      url += `mb:${this.settings.maxBytes}/`;
    }

    if (this.settings.extension) {
      url += `f:${this.settings.extension}/`;
    }

    if (this.settings.cacheBuster) {
      url += `cb:${this.settings.cacheBuster}/`;
    }

    if (this.settings.expires) {
      url += `exp:${this.settings.expires}/`;
    }

    if (this.settings.fileName) {
      url += `fn:${this.settings.fileName}/`;
    }

    url += urlSafeBase64(Buffer.from(sourceImg));
    if (this.config.key && this.config.salt) {
      const key = decodeHex(this.config.key);
      const salt = decodeHex(this.config.salt);
      const hmac = createHmac("sha256", key);
      hmac.update(`${salt}/`);
      hmac.update(url);
      const signature = urlSafeBase64(hmac.digest());

      return `${this.config.host}/${signature}/${url}`;
    }

    return `${this.config.host}/plain/${url}`;
  }
}
