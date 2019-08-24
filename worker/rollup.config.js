import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: './worker/worker.js',
  output: {
    file: './worker/worker.bundle.js',
    format: 'esm',
  },
  plugins: [
    resolve({}),
    babel({
      plugins: [
        '@babel/proposal-class-properties',
        '@babel/syntax-jsx',
        ['@babel/transform-react-jsx', { pragma: 'h' }],
      ],
    }),
  ],
};
