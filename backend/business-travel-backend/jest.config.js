// jest.config.js
module.exports = {
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@supabase/supabase-js$': '<rootDir>/src/__mocks__/@supabase/supabase.js',
    },
};
