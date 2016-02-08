#!/bin/bash

# Check for syntax errors
npm run lint

# Run Unit Tests
npm run unitTest

# Run Integration Tests
npm run integrationTest

# Run Code Coverage --> output as HTML Page at ./coverage/lcov-report/application/index.html
npm run coverage
