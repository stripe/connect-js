module.exports = {
  roots: ["<rootDir>/.generated/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { diagnostics: { ignoreCodes: [151001] } }],
  },
  setupFilesAfterEnv: ["<rootDir>/.generated/src/utils/jestSetup.ts"],
  testEnvironment: "jsdom",
};
