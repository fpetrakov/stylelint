// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const keywords = require('../../reference/keywords.cjs');
const regexes = require('../../utils/regexes.cjs');
const getRuleSelector = require('../../utils/getRuleSelector.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const parser = require('postcss-selector-parser');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'keyframe-selector-notation';

const messages = ruleMessages(ruleName, {
	expected: (selector, fixedSelector) => `Expected "${selector}" to be "${fixedSelector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/keyframe-selector-notation',
	fixable: true,
};

const PERCENTAGE_SELECTORS = new Set(['0%', '100%']);

const PERCENTAGE_TO_KEYWORD = new Map([
	['0%', 'from'],
	['100%', 'to'],
]);

const KEYWORD_TO_PERCENTAGE = new Map([
	['from', '0%'],
	['to', '100%'],
]);

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['keyword', 'percentage', 'percentage-unless-within-keyword-only-block'],
		});

		if (!validOptions) return;

		/**
		 * @typedef {{
		 *   expFunc: (selector: string, selectorsInBlock: string[]) => boolean,
		 *   fixFunc: (selector: string) => string,
		 * }} OptionFuncs
		 *
		 * @type {Record<typeof primary, OptionFuncs>}
		 */
		const optionFuncs = {
			keyword: {
				expFunc: (selector) => keywords.keyframeSelectorKeywords.has(selector),
				fixFunc: (selector) => getFromMap(PERCENTAGE_TO_KEYWORD, selector),
			},
			percentage: {
				expFunc: (selector) => PERCENTAGE_SELECTORS.has(selector),
				fixFunc: (selector) => getFromMap(KEYWORD_TO_PERCENTAGE, selector),
			},
			'percentage-unless-within-keyword-only-block': {
				expFunc: (selector, selectorsInBlock) => {
					if (selectorsInBlock.every((s) => keywords.keyframeSelectorKeywords.has(s))) return true;

					return PERCENTAGE_SELECTORS.has(selector);
				},
				fixFunc: (selector) => getFromMap(KEYWORD_TO_PERCENTAGE, selector),
			},
		};

		const { expFunc, fixFunc } = optionFuncs[primary];

		root.walkAtRules(regexes.atRuleRegexes.keyframesName, (atRuleKeyframes) => {
			const selectorsInBlock =
				primary === 'percentage-unless-within-keyword-only-block'
					? getSelectorsInBlock(atRuleKeyframes)
					: [];

			atRuleKeyframes.walkRules((keyframeRule) => {
				const selectors = parseSelector(getRuleSelector(keyframeRule), result, keyframeRule);

				if (!selectors) return;

				selectors.each((selector) => {
					const parsed = parseKeyframeSelector(selector);

					if (!parsed) return;

					const [keyframeSelector, normalizedSelector] = parsed;

					if (expFunc(normalizedSelector, selectorsInBlock)) return;

					const fixedSelector = fixFunc(normalizedSelector);

					const fix = () => {
						keyframeSelector.value = fixedSelector;
						keyframeRule.selector = selectors.toString();
					};

					report({
						message: messages.expected,
						messageArgs: [keyframeSelector.value, fixedSelector],
						node: keyframeRule,
						result,
						ruleName,
						index: keyframeSelector.sourceIndex,
						endIndex: keyframeSelector.sourceIndex + normalizedSelector.length,
						fix: {
							apply: fix,
							node: keyframeRule,
						},
					});
				});
			});
		});
	};
};

/** @import { Selector, Tag } from 'postcss-selector-parser' */

/**
 * Full syntax is:
 * `<keyframe-selector> = from | to | <percentage [0,100]> | <timeline-range-name> <percentage>`
 *
 * Only parses `from | to | <percentage [0,100]>` and returns `undefined` in any other case.
 *
 * @param {Selector} selector
 * @returns {[Tag,string]|undefined}
 */
function parseKeyframeSelector(selector) {
	const relevantNodes = selector.nodes.filter((node) => {
		if (parser.isComment(node)) return false;

		if (parser.isCombinator(node) && node.value.trim() === '') return false;

		return true;
	});

	if (relevantNodes.length !== 1) return;

	if (!relevantNodes.every(parser.isTag)) return;

	const keyframeSelector = relevantNodes[0];

	if (!keyframeSelector) return;

	const normalizedSelector = keyframeSelector.value.toLowerCase();

	if (
		!keywords.keyframeSelectorKeywords.has(normalizedSelector) &&
		!PERCENTAGE_SELECTORS.has(normalizedSelector)
	) {
		return;
	}

	return [keyframeSelector, normalizedSelector];
}

/**
 * @param {Map<string, string>} map
 * @param {string} key
 * @returns {string}
 */
function getFromMap(map, key) {
	const value = map.get(key);

	validateTypes.assertString(value);

	return value;
}

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {string[]}
 */
function getSelectorsInBlock(atRule) {
	/** @type {string[]} */
	const selectors = [];

	atRule.walkRules((r) => {
		selectors.push(...r.selectors.map((selector) => selector.toLowerCase()));
	});

	return selectors;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
