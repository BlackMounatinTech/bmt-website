# BMT visual redesign

Existing homepage copy and destinations are preserved.

Uses Lenis 1.3.29 (MIT) and Three.js 0.187.0 (MIT), vendored with their licenses in assets/vendor. Three.js is loaded lazily.

Rebuild: `npx --yes --package=esbuild esbuild future-source.js --bundle --splitting --format=esm --minify --outdir=assets/motion --entry-names=future --chunk-names=scene-[hash] --legal-comments=linked`

Desktop smooth scrolling; native touch scrolling. Honors reduced motion and includes a motion pause control. All content remains readable without JavaScript or WebGL.

Validated at widths 1440, 1024, 768, 390 and 320: no horizontal overflow or broken images. Navigation anchors, FAQ disclosure, motion pause and reduced-motion visibility checked in browser.
