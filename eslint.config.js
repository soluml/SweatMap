import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      indent: [
        1,
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: { var: 1, let: 1, const: 1 }
        }
      ],
      quotes: 0,
      "no-console": 0,
      semi: [2, "always"]
    }
  }
];
