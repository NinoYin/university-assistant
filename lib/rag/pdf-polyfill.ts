// pdfjs-dist (usado por pdf-parse) llama a `new DOMMatrix()` en algunos entornos
// Node donde el paquete opcional @napi-rs/canvas no logra cargar (como en Vercel).
// Como solo usamos extracción de texto (no renderizado), un polyfill mínimo basta.
import CSSMatrix from "@thednp/dommatrix";

if (typeof globalThis.DOMMatrix === "undefined") {
  // @ts-expect-error -- polyfill deliberadamente simplificado, no implementa toda la API de DOMMatrix
  globalThis.DOMMatrix = CSSMatrix;
}