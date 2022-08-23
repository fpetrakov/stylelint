'use strict';

const mediaParser = require('postcss-media-query-parser').default;

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const isRangeContextMediaFeature = require('../../utils/isRangeContextMediaFeature');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const optionsMatches = require('../../utils/optionsMatches');
const rangeContextNodeParser = require('../rangeContextNodeParser');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
// const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
// const { isString, isRegExp } = require('../../utils/validateTypes');
const vendor = require('../../utils/vendor');

const ruleName = 'media-feature-range-notation';

const messages = ruleMessages(ruleName, {
	rejected: (primary) => `Expected ${primary} media feature range notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/media-feature-range-notation',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['prefix', 'context'],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			mediaParser(atRule.params).walk(/^media-feature-expression$/i, (node) => {
				if (!node.nodes) return;

				const mediaFeatureRangeContext = isRangeContextMediaFeature(node.parent.value);

				// Ignore boolean
				if (!node.value.includes(':') && !mediaFeatureRangeContext) {
					return;
				}

				const mediaFeatureNode = node.nodes.find((n) => n.type === 'media-feature');

				if (mediaFeatureNode == null) throw new Error('A `media-feature` node must be present');

				let mediaFeatureName;
				let values;

				if (mediaFeatureRangeContext) {
					const parsedRangeContext = rangeContextNodeParser(mediaFeatureNode);

					mediaFeatureName = parsedRangeContext.name.value;
					values = parsedRangeContext.values;
				} else {
					mediaFeatureName = mediaFeatureNode.value;
					const valueNode = node.nodes.find((n) => n.type === 'value');

					if (valueNode == null) throw new Error('A `value` node must be present');

					values = [valueNode];
				}

				for (const valueNode of values) {
					const value = valueNode.value;
					const unprefixedMediaFeatureName = vendor.unprefixed(mediaFeatureName);

					const allowedValuesKey = Object.keys(primary).find((featureName) =>
						matchesStringOrRegExp(unprefixedMediaFeatureName, featureName),
					);

					if (allowedValuesKey == null) {
						return;
					}

					if (optionsMatches(primary, allowedValuesKey, value)) {
						return;
					}

					const index = atRuleParamIndex(atRule) + valueNode.sourceIndex;
					const endIndex = index + value.length;

					report({
						index,
						endIndex,
						message: messages.rejected(mediaFeatureName),
						node: atRule,
						ruleName,
						result,
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
