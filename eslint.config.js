import eslintPluginPrettier from "eslint-plugin-prettier";
import fs from "fs";

const prettierConfigPath = new URL("./prettier.config.json", import.meta.url);
const prettierConfig = JSON.parse(fs.readFileSync(prettierConfigPath, "utf-8"));

export default [
	{
		ignores: ["node_modules/", "dist/"]
	},
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module"
		},
		plugins: {
			prettier: eslintPluginPrettier
		},
		rules: {
			"prettier/prettier": ["error", prettierConfig],
			indent: ["error", "tab"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"no-unused-vars": "warn",
			"no-console": "warn",
			eqeqeq: "error"
		}
	}
];
