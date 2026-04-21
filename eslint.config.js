import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import-x";
import playwright from "eslint-plugin-playwright";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier/recommended";

export default [
	{
		ignores: [
			"dist/**",
			".astro/**",
			"node_modules/**",
			"pagefind/**",
			".prettierrc.cjs",
			"lighthouserc.cjs",
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	{
		files: ["**/*.{ts,js,mjs,cjs,astro}"],
		plugins: {
			"unused-imports": unusedImports,
		},
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{ vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
			],
			"import-x/order": [
				"error",
				{
					groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
					"newlines-between": "always",
				},
			],
			"import-x/no-named-as-default-member": "off",
			"import-x/no-named-as-default": "off",
			"import-x/no-unresolved": ["error", { ignore: ["^astro:", "^/pagefind/"] }],
		},
	},
	{
		files: ["tests/**/*.ts"],
		...playwright.configs["flat/recommended"],
	},
	{
		files: ["scripts/**/*.{js,mjs}"],
		languageOptions: {
			globals: {
				console: "readonly",
				process: "readonly",
				Buffer: "readonly",
				URL: "readonly",
			},
		},
	},
	prettier,
	{
		files: ["**/*.astro/*.ts"],
		rules: {
			"prettier/prettier": "off",
		},
	},
];
