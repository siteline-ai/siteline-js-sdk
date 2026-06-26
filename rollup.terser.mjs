import { minify } from 'terser';

export function terserPlugin(options = {}) {
  return {
    name: 'terser',
    async renderChunk(code, chunk, outputOptions) {
      const result = await minify(code, {
        ...options,
        module: outputOptions.format === 'es',
        sourceMap: outputOptions.sourcemap ? { asObject: true } : false,
      });

      if (!result.code) {
        this.error(`Terser failed to minify ${chunk.fileName}`);
      }

      return {
        code: result.code,
        map: result.map ?? null,
      };
    },
  };
}
