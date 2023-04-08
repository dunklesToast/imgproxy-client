# imgproxy-client

An awesome nodejs [imgproxy](https://github.com/darthsim/imgproxy) client aiming to support nearly all functions of imgproxy.
Additionally, it provides you with helper functions helping you generating source sets and other cool things with ease.

## Documentation

```typescript
import { Imgproxy } from "imgproxy-client";

const imgproxy = new Imgproxy({
  host: "https://your.imgproxy.host",
  salt: "yourSalt",
  key: "yourKey",
  sourceSetSizes: [480, 560, 760, 1080],
});

imgproxy.setWidth(512).setDpr(10).generate("source_image_url");
imgproxy.getSourceSet("source_image_url", { quality: 10 });
```

## CommonJS Support

By default, this is an ES-Module. However, if you can't use ES-Modules, simply import from `imgproxy-client/cjs` and you'll import the CommonJS version.
