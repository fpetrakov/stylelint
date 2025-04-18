import { stripIndent } from 'common-tags';

import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: ['*=', '~='],

	accept: [
		{
			code: 'a[target] { }',
		},
		{
			code: 'a[target="_blank"] { }',
		},
		{
			code: '[class|="top"] { }',
		},
		{
			code: '[class^=top] { }',
		},
		{
			code: '[class$="test"] { }',
		},
		{
			code: ':root { --foo: 1px; }',
			description: 'custom property in root',
		},
		{
			code: 'html { --foo: 1px; }',
			description: 'custom property in selector',
		},
		{
			code: ':root { --custom-property-set: {} }',
			description: 'custom property set in root',
		},
		{
			code: 'html { --custom-property-set: {} }',
			description: 'custom property set in selector',
		},
		{
			code: stripIndent`
				/* stylelint-disable-next-line selector-attribute-operator-disallowed-list */
				a[class*="foo"], /* stylelint-disable-next-line selector-attribute-operator-disallowed-list */
				a[id~="foo"],
				/* stylelint-disable-next-line selector-attribute-operator-disallowed-list */
				a[data-foo*="foo"]
				{ }
			`,
		},
	],

	reject: [
		{
			code: '[title~="flower"] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: '[ title~="flower" ] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '[title ~= "flower"] { }',
			message: messages.rejected('~='),
			line: 1,
			column: 8,
			endLine: 1,
			endColumn: 10,
		},
		{
			code: '[class*=test] { }',
			message: messages.rejected('*='),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 9,
		},
		{
			code: stripIndent`
				/* a comment */
				a[class*="foo"], /* a comment */
				a[id~="foo"],
				/* a comment */
				a[data-foo*="foo"]
				{ }
			`,
			warnings: [
				{
					line: 2,
					column: 8,
					endLine: 2,
					endColumn: 10,
					message: messages.rejected('*='),
				},
				{
					line: 3,
					column: 5,
					endLine: 3,
					endColumn: 7,
					message: messages.rejected('~='),
				},
				{
					line: 5,
					column: 11,
					endLine: 5,
					endColumn: 13,
					message: messages.rejected('*='),
				},
			],
		},
	],
});

testRule({
	ruleName,

	config: '*=',

	accept: [
		{
			code: 'a[target="_blank"] { }',
		},
	],

	reject: [
		{
			code: '[title*="foo"] { }',
			message: messages.rejected('*='),
			line: 1,
			column: 7,
		},
	],
});
