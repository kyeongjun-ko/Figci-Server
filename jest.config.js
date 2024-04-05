module.exports = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  testMatch: ["**/*.spec.js"],
  collectCoverageFrom: ["./src/**/*.js"],
  coveragePathIgnorePatterns: ["/services/"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "testCoverage",
};
