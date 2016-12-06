/// <reference path="./index.d.ts" />

import  assert  = require('assert');
import dns = require('dns-js');
const BufferConsumer: dns.BufferConsumer = require('dns-js/lib/bufferconsumer');
const BufferWriter: dns.BufferWriter = require('dns-js/lib/bufferwriter');

assert.equal(typeof dns.DNSPacket, 'function');
assert.equal(typeof dns.DNSRecord, 'function');
assert.equal(typeof dns.errors.MalformedPacket, 'function');
assert.equal(dns.errors.MalformedPacket.name, 'MalformedPacket');
assert.equal(typeof dns.parse, 'function');
assert.equal(typeof BufferConsumer, 'function');
assert.equal(typeof BufferWriter, 'function');

console.log('test ok');

