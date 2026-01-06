module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/app.js',
        '!src/db.js',
        '!src/routes/*.js' // Exclude routes from unit coverage if focusing on controllers/services logic, but they might be covered by integration tests. 
        // Requirement says "branches, functions, lines". Let's include everything in metrics but ignore thin wrappers if needed.
        // User asked to "NO conectarse a una base de datos MySQL real durante los tests".
        // "Simular el acceso a datos mediante mocks".
    ],
    testMatch: ['**/tests/**/*.test.js'],
};
