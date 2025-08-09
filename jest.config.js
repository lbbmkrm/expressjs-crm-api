export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  moduleFileExtensions: ["js"],
  coverageDirectory: "coverage",
  roots: ["<rootDir>/tests"],
};
