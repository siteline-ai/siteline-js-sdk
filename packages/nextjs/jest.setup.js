require('@testing-library/jest-dom');

const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

const { Request, Response, Headers, ReadableStream } = require('next/dist/compiled/@edge-runtime/primitives');

global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.ReadableStream = ReadableStream;

// Mock performance.now
global.performance = {
  now: jest.fn(() => Date.now()),
};
