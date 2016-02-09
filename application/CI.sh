#!/bin/bash

npm install

# Check for syntax errors
npm run lint

# Run Unit Tests
npm run test:unit

# Run Integration Tests
npm run test:integration

# Run Code Coverage --> output as HTML Page at ./coverage/lcov-report/application/index.html
npm run coverage
