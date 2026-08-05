// swiper@8's "exports" map hides its own .d.ts under moduleResolution:
// "bundler"; ambient-shim the bare specifier so imports type-check.
declare module 'swiper';
