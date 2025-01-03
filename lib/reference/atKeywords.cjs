// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const uniteSets = require('../utils/uniteSets.cjs');

// https://www.w3.org/TR/css-nesting-1/#conditionals
const nestingSupportedAtKeywords = new Set([
	'container',
	'layer',
	'media',
	'scope',
	'starting-style',
	'supports',
]);

// https://www.w3.org/TR/css-page-3/#syntax-page-selector
const pageMarginAtKeywords = new Set([
	'top-left-corner',
	'top-left',
	'top-center',
	'top-right',
	'top-right-corner',
	'bottom-left-corner',
	'bottom-left',
	'bottom-center',
	'bottom-right',
	'bottom-right-corner',
	'left-top',
	'left-middle',
	'left-bottom',
	'right-top',
	'right-middle',
	'right-bottom',
]);

// https://www.w3.org/TR/css-fonts-4/#font-feature-values-font-feature-value-type
const fontFeatureValueTypes = new Set([
	'annotation',
	'character-variant',
	'historical-forms',
	'ornaments',
	'styleset',
	'stylistic',
	'swash',
]);

// https://developer.mozilla.org/en/docs/Web/CSS/At-rule
const atKeywords = uniteSets(
	nestingSupportedAtKeywords,
	pageMarginAtKeywords,
	fontFeatureValueTypes,
	[
		'apply',
		'counter-style',
		'custom-media',
		'custom-selector',
		'document',
		'font-face',
		'font-feature-values',
		'font-palette-values',
		'import',
		'keyframes',
		'namespace',
		'nest',
		'page',
		'position-try',
		'property',
		'scroll-timeline',
		'view-transition',
		'viewport',
	],
);

exports.atKeywords = atKeywords;
exports.nestingSupportedAtKeywords = nestingSupportedAtKeywords;
