import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test-id' })

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};