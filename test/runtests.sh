#!/bin/bash -ve
# USAGE: Run this file using `npm test` (must run from repository root)

# Run tests
mocha                               \
  test/localhost_test.js            \
  ;
