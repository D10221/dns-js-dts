
declare module 'dns-js' {

    /**
     * Not exported by dns-js
     */
    interface BufferConsumer {
        new (arg?: Buffer): BufferConsumer;
        tell(): number;
        seek(pos: number): this;
        slice(n: number): this;
        isEOF(): boolean;
        byte(): number;
        short(): number;
        long(): number;
        string(enc?: string, i?: number): string;

        /** Getter */
        name(): string;
    }

    /**
     * Not exported by dns-js
     */
    interface BufferWriter {
        /**
         * @size {number} defaults to 512
         */
        new (size?: number): BufferWriter;

        /**
         * @returns {buff.offset}
         */
        tell(): number;

        /**
         * Writes a DNS name. If ref is specified, will finish this name with a
         * suffix reference (i.e., 0xc0 <ref>). If not, then will terminate with a NULL
         * byte.
         */
        name(value: string): BufferWriter;

        // TODO:
        indexOf(text: string): number;

        slice(start: number, end: number): Buffer;

        dump(): Buffer;

        byte(value: number): BufferWriter;

        seek(pos: number): BufferWriter;

        // 4 bytes
        long(value: number): BufferWriter;

        // two bytes
        short(): BufferWriter;

        buffer(value?: Buffer | BufferWriter): BufferWriter;

    }
    /**
     * from DNSRecord.parse 
     */
    export function parse(consumer: Buffer | BufferConsumer): DNSRecord;

    export namespace DNSRecord {

        export enum Class {
            IN = 0x01,
            ANY = 0xff,
            FLUSH = 0x8000,
            IS_QM = 0x8000,
            // typo?
            IS_OM = 0x8000,
        }

        /**
         * Enum for record type values
         * @readonly
         * @enum {number}
         */
        export enum Type {
            A = 0x01, // 1
            NS = 0x02, // 2
            CNAME = 0x05, // 5
            SOA = 0x06, // 6
            PTR = 0x0c, // 12
            MX = 0x0f, // 15
            TXT = 0x10, // 16
            AAAA = 28, // 0x16
            SRV = 0x21, // 33
            OPT = 0x29, // 41 RFC6981 -needed for EDNS
            NSEC = 0x2f, // 47
            TLSA = 0x34, // 52 RFC6698 - associate TLS server certificate.
            ANY = 0xff
        }
    }

    /**
     * DNSRecord is a record inside a DNS packet; e.g. a QUESTION, or an ANSWER,
     * AUTHORITY, or ADDITIONAL record. Note that QUESTION records are special,
     * and do not have ttl or data.
     * @class
     * @param {string} name
     * @param {number} type
     * @param {number} cl - class
     * @param {number} [optTTL] - time to live in seconds
     */
    export class DNSRecord {
        static TTL: number;

        // static Type: DNSRecord.Type;
        name: string;
        type: DNSRecord.Type;
        port: number;
        data?: any;
        ttl?: number;

        /**
         * getter
         */
        readonly typeName: string;

        /**
         *  getter
         */
        readonly className: string;

        /**
         * getter
         */
        readonly flag: number;

        'class': number;

        constructor(name: string, type: DNSRecord.Type, cl: DNSRecord.Class, optTTL?: number);

        static parse(consumer: Buffer | BufferConsumer): DNSRecord;
        static parseQuestion(consumer: Buffer | BufferConsumer): DNSRecord;
        static write(w: BufferWriter, record: DNSRecord, withLength: boolean): Buffer;

        asName(): string;

    }
    export type DNSPacketHeader = {
        id: number,
        qr: number,
        opcode: number,
        aa: number,
        tc: number,
        rd: number,
        ra: number,
        res1: number,
        res2: number,
        res3: number,
        rcode: number
    }

    export namespace DNSPacket {

        /**
         * Enum identifying DNSPacket flags
         * @readonly
         * @enum {number}
         */
        export enum Flag {
            RESPONSE = 0x8000,
            AUTHORATIVE = 0x400,
            TRUNCATED = 0x200,
            RECURSION = 0x100
        }

        /**
         * Enum identifying DNSPacket rcode flag values
         * @readonly
         * @enum {number}
         */
        export enum DNSPacketRCODE {
            NoError = 0,
            FormErr = 1,
            ServFail = 2,
            NXDomain = 3
        }
    }

    /**
     * DNSPacket holds the state of a DNS packet. It can be modified or serialized
     * in-place.
     *
     * @constructor
     */
    export class DNSPacket {

        constructor(flags?: DNSPacket.Flag)

        header: DNSPacketHeader;

        /**
         * Section
         */
        question: any[];

        /**
         * Section
         */
        answer: any[];

        /**
         * Section
         */
        authority: any[];

        /**
         * Section
         */
        additional: any[];

        edns_options: any[];
        payload: any;


        /**
         * Parse a DNSPacket from an Buffer
         * @param {Buffer} buffer - A Node.js Buffer instance
         * @returns {DNSPacket} Instance of DNSPacket
         */
        static parse(buffer: Buffer): DNSPacket | DNSPacket[];

        /**
         * Get records from packet
         * @param {DNSPacket.Section} section - record section [qd|an|ns|ar],
         * @param {DNSRecord.Type} [filter] - DNSRecord.Type to filter on
         * @param {DNSPacket~eachCallback} callback - Function callback
         */
        static each(section: DNSRecord[], filter?: DNSRecord.Type, callback?: (rec: DNSRecord) => void): void;

        /**
         * Serialize this DNSPacket into an Buffer for sending over UDP.
         * @returns {Buffer} A Node.js Buffer
         */
        static toBuffer(packet: DNSPacket): Buffer;

    }

    namespace errors {
        export class MalformedPacket extends Error {
            constructor(...args: any[]);
        }

    }
}
