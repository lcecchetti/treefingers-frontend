// swiper@8's package.json "exports" maps the root "." entry to swiper.esm.js
// without a matching swiper.esm.d.ts sibling, so under moduleResolution:
// "bundler" TS can't discover the (otherwise valid) swiper.d.ts that ships
// in the package. Ambient-shim the bare "swiper" specifier so imports like
// `import { EffectCards, Navigation } from 'swiper'` type-check.
declare module 'swiper';
