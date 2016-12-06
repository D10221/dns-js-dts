/// <reference path="./index.d.ts" />

import  assert  = require('assert');
import dns = require('dns-js');

assert.equal(typeof dns.DNSPacket, 'function');
assert.equal(typeof dns.DNSRecord, 'function');
assert.equal(typeof dns.errors.MalformedPacket, 'function');
assert.equal(dns.errors.MalformedPacket.name, 'MalformedPacket');
assert.equal(typeof dns.parse, 'function');
console.log('test ok');

