import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
// import typescript from '@rollup/plugin-typescript'

const minifier = [
	terser({
		compress: true,
		mangle: {
			properties: {
				regex: /^_/, // mangle properties whose name starts with _
			},
		},
	}),
];

// CJS (Node.js)
const cjsProd = {
	file: './dist/nue.cjs.prod.js',
	format: 'cjs',
	plugins: minifier,
};

const cjsDev = {
	file: './dist/nue.cjs.dev.js',
	format: 'cjs',
};

// UMD (Browser + Node)
const umdProd = {
	file: './dist/nue.umd.prod.js',
	format: 'umd',
	plugins: minifier,
	name: 'nue',
};

const umdDev = {
	file: './dist/nue.umd.dev.js',
	format: 'umd',
	name: 'nue',
};

// ESM
const es = {
	file: './dist/nue.es.js',
	format: 'es',
	plugins: minifier,
};

const outputConfigs = {
	cjsProd,
	cjsDev,
	umdProd,
	umdDev,
	es,
};

export default info => {
	// on ESM, replace _DEV_ with process.env.NODE_ENV !== 'production
	// for others, replace _DEV_ with either true or false
	let replaceValues = {
		_DEV_: info.bundle === 'es' ? "process.env.NODE_ENV !== 'production'" : Boolean(info.dev),
	};

	return {
		input: './src/index.js',
		output: outputConfigs[info.bundle],
		plugins: [
			replace({
				values: replaceValues,
			}),
		],
	};
};
