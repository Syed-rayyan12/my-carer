import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default {
  plugins: {
    // Resolve at runtime so Turbopack loads the native plugin through Node.js.
    [require.resolve(/* turbopackIgnore: true */ "@tailwindcss/postcss")]: {},
  },
};
