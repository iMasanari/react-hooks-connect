// @ts-check

import typescript from 'rollup-plugin-typescript2'
import { camelCase } from 'lodash'
import pkg from './package.json'

const globals = {
  'react': 'React',
}

const baseConfig = {
  input: './src/react-hooks-connect.tsx',
  plugins: [
    typescript({ tsconfig: 'tsconfig.build.json' }),
  ],
  external: Object.keys(globals),
}

export default [{
  ...baseConfig,
  output: [
    { format: 'cjs', file: pkg.main, exports: 'named' },
    { format: 'umd', file: pkg.unpkg, exports: 'named', name: camelCase(pkg.name), globals },
  ],
}, {
  ...baseConfig,
  output: [
    { format: 'es', file: pkg.module },
  ],
  external: [...baseConfig.external, 'tslib'],
}]
