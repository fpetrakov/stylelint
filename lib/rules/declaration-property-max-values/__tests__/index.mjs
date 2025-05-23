import rule from '../index.mjs';
const { messages, ruleName } = rule;

testRule({
	ruleName,

	config: [
		{
			border: 2,
			'/^margin/': 1,
		},
	],

	accept: [
		{
			code: 'a { margin: 0; }',
		},
		{
			code: 'a { margin: 1px; }',
		},
		{
			code: 'a { margin: var(--foo); }',
			description: 'deals with CSS variables',
		},
		{
			code: 'a { margin: 1px /* 3px */; }',
			description: 'ignore values in comments',
		},
		{
			code: 'a { margin-inline: 1px; }',
		},
		{
			code: 'a { margin: ; }',
		},
		{
			code: 'a { border: 1px; }',
		},
		{
			code: 'a { border: 1px solid; }',
		},
		{
			code: 'a { transition: margin-right 2s ease-in-out; }',
			description: 'irrelevant shorthand',
		},
	],

	reject: [
		{
			code: 'a { margin: 1px 2px; }',
			message: messages.expected('margin', 1),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { margin-inline: 1px 2px; }',
			message: messages.expected('margin-inline', 1),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 28,
		},
		{
			code: 'a { margin: var(--foo) var(--bar); }',
			message: messages.expected('margin', 1),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 35,
			description: 'deals with CSS variables',
		},
		{
			code: 'a { margin: 1px 2px 3px 4px; }',
			message: messages.expected('margin', 1),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 29,
		},
		{
			code: 'a { margin: 0 0 0 0; }',
			message: messages.expected('margin', 1),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 21,
		},
		{
			code: 'a { border: 1px solid blue; }',
			message: messages.expected('border', 2),
			line: 1,
			column: 5,
			endLine: 1,
			endColumn: 28,
		},
	],
});
