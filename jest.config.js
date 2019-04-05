module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	coverageDirectory: "doc/code-coverage",
	collectCoverageFrom: [
		"src/**/*.{js,ts}",
		"!**/node_modules/**",
		"!**/vendor/**",
		"!src/index.ts"
	],
	coverageReporters: ["json", "html", "json-summary", "jest-junit", "lcov"]
};
