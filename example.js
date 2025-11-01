"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElearningClient = createElearningClient;
exports.createClient = createElearningClient;
exports.loadEnv = loadEnv;
var elearning_sdk_1 = require("@genixsuitecom/elearning-sdk");
var dotenv_1 = require("dotenv");
var promises_1 = require("node:timers/promises");
dotenv_1.default.config();
var DEBUG = process.env.GENIXSUITE_DEBUG === '1';
var log = {
    info: function (msg, meta) { return console.log("[elearning-sdk] ".concat(msg), meta !== null && meta !== void 0 ? meta : ''); },
    debug: function (msg, meta) { if (DEBUG)
        console.log("[elearning-sdk:debug] ".concat(msg), meta !== null && meta !== void 0 ? meta : ''); },
    error: function (msg, meta) { return console.error("[elearning-sdk:error] ".concat(msg), meta !== null && meta !== void 0 ? meta : ''); }
};
function requireNode(minMajor) {
    var major = Number(process.versions.node.split('.')[0]);
    if (isNaN(major) || major < minMajor) {
        throw new Error("Node ".concat(minMajor, "+ required (for native fetch). Detected: ").concat(process.versions.node, "."));
    }
}
function loadEnv() {
    var _a, _b, _c, _d;
    var env = process.env;
    var missing = [];
    if (!env.GENIXSUITE_CLIENT_ID)
        missing.push('GENIXSUITE_CLIENT_ID');
    if (!env.GENIXSUITE_CLIENT_SECRET)
        missing.push('GENIXSUITE_CLIENT_SECRET');
    if (missing.length) {
        throw new Error("Missing env: ".concat(missing.join(', '), ". Create a .env file with:\nGENIXSUITE_CLIENT_ID=...\nGENIXSUITE_CLIENT_SECRET=..."));
    }
    var timeoutMsRaw = (_a = env.REQUEST_TIMEOUT_MS) !== null && _a !== void 0 ? _a : '10000';
    var timeoutMs = Number(timeoutMsRaw);
    if (isNaN(timeoutMs) || timeoutMs <= 0) {
        throw new Error("Invalid REQUEST_TIMEOUT_MS: \"".concat(timeoutMsRaw, "\". Must be >0 number (ms)."));
    }
    var scopes = ((_b = env.GENIXSUITE_SCOPES) !== null && _b !== void 0 ? _b : 'jobs:read').trim();
    if (!scopes) {
        throw new Error('GENIXSUITE_SCOPES cannot be empty.');
    }
    var maxRetriesRaw = (_c = env.MAX_TOKEN_RETRIES) !== null && _c !== void 0 ? _c : '3';
    var maxRetries = Number(maxRetriesRaw);
    if (!Number.isInteger(maxRetries) || maxRetries < 1) {
        throw new Error("Invalid MAX_TOKEN_RETRIES: \"".concat(maxRetriesRaw, "\". Must be a positive integer."));
    }
    return {
        clientId: env.GENIXSUITE_CLIENT_ID,
        clientSecret: env.GENIXSUITE_CLIENT_SECRET,
        scopes: scopes,
        baseUrl: (_d = env.GENIXSUITE_BASE_URL) !== null && _d !== void 0 ? _d : 'https://app.genixsuite.com',
        timeoutMs: timeoutMs,
        maxRetries: maxRetries,
    };
}
function fetchWithTimeout(input_1) {
    return __awaiter(this, arguments, void 0, function (input, init) {
        var ac, timer;
        var _a;
        if (init === void 0) { init = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ac = new AbortController();
                    timer = setTimeout(function () { return ac.abort(); }, (_a = init.timeoutMs) !== null && _a !== void 0 ? _a : 10000);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fetch(input, __assign(__assign({}, init), { signal: ac.signal }))];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    clearTimeout(timer);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function explainStatus(status) {
    switch (status) {
        case 400: return 'Bad request. Check client_id/client_secret and grant_type.';
        case 401: return 'Unauthorized. Credentials incorrect or not authorized.';
        case 403: return 'Forbidden. Missing required scopes.';
        case 404: return 'Endpoint not found. Check baseUrl.';
        case 429: return 'Rate limited. Retry after a delay.';
        default:
            if (status >= 500)
                return 'Server error. Try again later.';
            return 'Unexpected response.';
    }
}
function getClientCredentialsToken(cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var url, body, lastErr, maxRetries, delayMs, attempt, res, text, json, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(cfg.baseUrl, "/api/oauth2/token");
                    body = new URLSearchParams({
                        grant_type: 'client_credentials',
                        scope: cfg.scopes,
                        client_id: cfg.clientId,
                        client_secret: cfg.clientSecret,
                    });
                    log.debug('Requesting token', { url: url, scopes: cfg.scopes });
                    maxRetries = cfg.maxRetries;
                    delayMs = 100;
                    attempt = 1;
                    _a.label = 1;
                case 1:
                    if (!(attempt <= maxRetries)) return [3 /*break*/, 11];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 10]);
                    return [4 /*yield*/, fetchWithTimeout(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: body,
                            timeoutMs: cfg.timeoutMs,
                        })];
                case 3:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 5];
                    return [4 /*yield*/, res.text().catch(function () { return ''; })];
                case 4:
                    text = _a.sent();
                    throw new Error("Token request failed ".concat(res.status, ": ").concat(explainStatus(res.status)).concat(text ? " | ".concat(text) : ''));
                case 5: return [4 /*yield*/, res.json()];
                case 6:
                    json = _a.sent();
                    if (!json || typeof json !== 'object' || typeof json.access_token !== 'string') {
                        throw new Error('Token response malformed; expected { access_token: string }');
                    }
                    return [2 /*return*/, json.access_token];
                case 7:
                    e_1 = _a.sent();
                    lastErr = e_1;
                    log.error("Token attempt ".concat(attempt, "/").concat(maxRetries, " failed"), { message: e_1 instanceof Error ? e_1.message : String(e_1) });
                    if (!(attempt < maxRetries)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, promises_1.setTimeout)(delayMs)];
                case 8:
                    _a.sent();
                    delayMs *= 2.5;
                    _a.label = 9;
                case 9: return [3 /*break*/, 10];
                case 10:
                    attempt++;
                    return [3 /*break*/, 1];
                case 11: throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
            }
        });
    });
}
function createElearningClient() {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requireNode(18);
                    cfg = loadEnv();
                    return [4 /*yield*/, getClientCredentialsToken({
                            baseUrl: cfg.baseUrl,
                            clientId: cfg.clientId,
                            clientSecret: cfg.clientSecret,
                            scopes: cfg.scopes,
                            timeoutMs: cfg.timeoutMs,
                            maxRetries: cfg.maxRetries,
                        })];
                case 1:
                    token = _a.sent();
                    return [2 /*return*/, new elearning_sdk_1.ElearningApiClient({ baseUrl: cfg.baseUrl, token: token })];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
                        log.debug('Proxy detected via env', { HTTPS_PROXY: process.env.HTTPS_PROXY ? 'set' : 'unset', HTTP_PROXY: process.env.HTTP_PROXY ? 'set' : 'unset' });
                    }
                    log.info('Environment', { node: process.versions.node, platform: process.platform, arch: process.arch });
                    return [4 /*yield*/, createElearningClient()];
                case 1:
                    client = _a.sent();
                    log.info('SDK client initialized');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    var message = e instanceof Error ? e.message : String(e);
    log.error('Startup failed', { message: message });
    process.exitCode = 1;
});
