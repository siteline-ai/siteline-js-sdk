import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: ['next/server', '@siteline/core'],
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      outputToFilesystem: true,
      rootDir: 'src',
    }),
    terser({
      compress: {
        passes: 2,
        pure_getters: true,
        unsafe: true,
      },
      mangle: {
        properties: false,
      },
      format: {
        comments: false,
      },
    }),
  ],
};
