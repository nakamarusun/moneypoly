#### Mini journal of trying to make sense different javascript modules used in this project

## Dependencies explanation:
- eslint-config-prettier: Make sure ESLint does not conflict with prettier formatting
- eslint-plugin-prettier: [UNUSED] Plugin to integrate prettier directly to ESLint. Running ESLint will also apply prettier and IDE will also check prettier coding styles. The disadvantages is that a small whitespace error will cause a squiggly line, and will be annoying.
- prettier-eslint: A module that first applies prettier, and then applies eslint --fix on a string.
- prettier-eslint-cli: prettier-eslint can only do its stuff on a string, this module allows it to be done on multiple files.
- @babel/eslint-parser: Do eslint formatting to parse with babel 

## General explanation
- Babel: converts javascript code from modern ECMAscript code to backwards compatible code for older browsers (IE)
- ESLint: Reads the entire codebase, and provides style error, common bugs, errors, and inefficient code.
- prettier: Similar to ESLint, but more focused towards keeping coding style consistent (Such as indentations, enter when if, whitespaces, etc)
- jest: Provides testing library for javascript code, and code coverage. Testing is checking whether a function or module doesn't output something unexpected by the programming. code coverage tells when certain lines in the function or module have not been covered by the test suite