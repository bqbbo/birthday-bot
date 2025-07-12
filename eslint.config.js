import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
            },
            sourceType: "module",
        },
        rules: {
            "no-console": "off",
        },
    },
];
