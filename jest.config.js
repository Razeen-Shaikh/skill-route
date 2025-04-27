import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/app/components/$1",
    "^@/lib/(.*)$": "<rootDir>/app/lib/$1",
  },
};

export default createJestConfig(customJestConfig);
