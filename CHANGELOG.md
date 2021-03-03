# Change Log

## 1.2.2

### Patch Changes

- [`be237da`](https://github.com/stormwarning/tailwindcss-capsize/commit/be237daac00375f502611a6b7b1fce1e048e9688) [#68](https://github.com/stormwarning/tailwindcss-capsize/pull/68) Thanks [@stormwarning](https://github.com/stormwarning)! - Fix issue requiring an empty options object to be passed in

  ```diff
  - require('tailwindcss-capsize')({})
  + require('tailwindcss-capsize')
  ```

### 1.2.1 — 2021-02-08

#### 🐛 Fixed

- Avoid error when `normalizeValue` gets an array [`e18c905`](https://github.com/stormwarning/tailwindcss-capsize/commit/e18c9055f2f5607c6c2d58c96fa0cfb46bb1e1c6)  
  Still needs to account fully for Tailwind v2 configs, but this helps.

## 1.2.0 — 2020-10-11

#### 🎁 Added

- Allow unitless or percentage-based leading values [#34](https://github.com/stormwarning/tailwindcss-capsize/pull/34)  
  Uses the inherited `font-size` to determine pixel `line-height` value.

#### 🐛 Fixed

- Use correct path for `types` import [#30](https://github.com/stormwarning/tailwindcss-capsize/pull/30)  
  This should clear up any TypeScript warnings during local builds.

## 1.1.0 — 2020-09-04

#### 💣 Breaking Changes

- Rename plugin using common prefix convention [`eac9127`](https://github.com/stormwarning/tailwindcss-capsize/commit/eac91277f979ef4233790deedb76cf3ac9b8a9c1) \
  `tailwind-capsize` → `tailwindcss-capsize`

### 1.0.3 — 2020-09-03

#### ♻️ Changed

- Cleaned out unused code and fix up docs examples [`bc1372f`](https://github.com/stormwarning/tailwindcss-capsize/commit/bc1372f8a6b96a0b19d2ce48dcbda598a715c25c)

### 1.0.2 — 2020-09-01

#### 🐛 Fixed

- Fixed error when trying to set a custom root font-size value [#16](https://github.com/stormwarning/tailwindcss-capsize/pull/16)

### 1.0.1 — 2020-08-13

#### 🐛 Fixed

- Added actual README and package description & keywords [`327886e`](https://github.com/stormwarning/tailwindcss-capsize/commit/327886ed2b57e76a12424bf6050ac193e0c23d10)

## 1.0.0 — 2020-08-11

### 🎉 Initial release
