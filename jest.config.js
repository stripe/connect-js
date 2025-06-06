module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { diagnostics: { ignoreCodes: [151001] } }],
  },
  setupFilesAfterEnv: ["<rootDir>/src/utils/jestSetup.ts"],
  testEnvironment: "jsdom",
};
