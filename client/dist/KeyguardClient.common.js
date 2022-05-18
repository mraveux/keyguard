'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rpc = require('@nimiq/rpc');

var BehaviorType;
(function (BehaviorType) {
    BehaviorType[BehaviorType["REDIRECT"] = 0] = "REDIRECT";
    BehaviorType[BehaviorType["IFRAME"] = 1] = "IFRAME";
})(BehaviorType || (BehaviorType = {}));
class RequestBehavior {
    static getAllowedOrigin(endpoint) {
        const url = new URL(endpoint);
        return url.origin;
    }
    constructor(type) {
        this._type = type;
    }
    async request(endpoint, command, args) {
        throw new Error('Not implemented');
    }
    get type() {
        return this._type;
    }
}
class RedirectRequestBehavior extends RequestBehavior {
    static getRequestUrl(endpoint, command) {
        return `${endpoint}/request/${command}/`;
    }
    constructor(returnUrl, localState, handleHistoryBack = false) {
        super(BehaviorType.REDIRECT);
        const location = window.location;
        this._returnUrl = returnUrl || `${location.origin}${location.pathname}`;
        this._localState = localState || {};
        this._handleHistoryBack = handleHistoryBack;
        // Reject local state with reserved property.
        if (typeof this._localState.__command !== 'undefined') {
            throw new Error('Invalid localState: Property \'__command\' is reserved');
        }
    }
    async request(endpoint, command, args) {
        const url = RedirectRequestBehavior.getRequestUrl(endpoint, command);
        const allowedOrigin = RequestBehavior.getAllowedOrigin(endpoint);
        const client = new rpc.RedirectRpcClient(url, allowedOrigin);
        const state = Object.assign({ __command: command }, this._localState);
        client.callAndSaveLocalState(this._returnUrl, state, 'request', this._handleHistoryBack, ...args);
    }
}
class IFrameRequestBehavior extends RequestBehavior {
    get IFRAME_PATH_SUFFIX() {
        return '/request/iframe/';
    }
    constructor() {
        super(BehaviorType.IFRAME);
        this._iframe = null;
        this._client = null;
    }
    async request(endpoint, command, args) {
        if (this._iframe && this._iframe.src !== `${endpoint}${this.IFRAME_PATH_SUFFIX}`) {
            throw new Error('Keyguard iframe is already opened with another endpoint');
        }
        const origin = RequestBehavior.getAllowedOrigin(endpoint);
        if (!this._iframe) {
            this._iframe = await this.createIFrame(endpoint);
        }
        if (!this._iframe.contentWindow) {
            throw new Error(`IFrame contentWindow is ${typeof this._iframe.contentWindow}`);
        }
        if (!this._client) {
            this._client = new rpc.PostMessageRpcClient(this._iframe.contentWindow, origin);
            await this._client.init();
        }
        return await this._client.call(command, ...args);
    }
    async createIFrame(endpoint) {
        return new Promise((resolve, reject) => {
            const $iframe = document.createElement('iframe');
            $iframe.name = 'NimiqKeyguardIFrame';
            $iframe.style.display = 'none';
            document.body.appendChild($iframe);
            $iframe.src = `${endpoint}${this.IFRAME_PATH_SUFFIX}`;
            $iframe.onload = () => resolve($iframe);
            $iframe.onerror = reject;
        });
    }
}
class SwapIFrameRequestBehavior extends IFrameRequestBehavior {
    get IFRAME_PATH_SUFFIX() {
        return '/request/swap-iframe/';
    }
}

(function (KeyguardCommand) {
    KeyguardCommand["CREATE"] = "create";
    KeyguardCommand["REMOVE"] = "remove-key";
    KeyguardCommand["IMPORT"] = "import";
    KeyguardCommand["EXPORT"] = "export";
    KeyguardCommand["CHANGE_PASSWORD"] = "change-password";
    KeyguardCommand["SIGN_TRANSACTION"] = "sign-transaction";
    KeyguardCommand["SIGN_STAKING"] = "sign-staking";
    KeyguardCommand["SIGN_MESSAGE"] = "sign-message";
    KeyguardCommand["DERIVE_ADDRESS"] = "derive-address";
    // Bitcoin
    KeyguardCommand["SIGN_BTC_TRANSACTION"] = "sign-btc-transaction";
    KeyguardCommand["DERIVE_BTC_XPUB"] = "derive-btc-xpub";
    // Swap
    KeyguardCommand["SIGN_SWAP"] = "sign-swap";
    // Iframe requests
    KeyguardCommand["LIST"] = "list";
    KeyguardCommand["HAS_KEYS"] = "hasKeys";
    KeyguardCommand["DERIVE_ADDRESSES"] = "deriveAddresses";
    KeyguardCommand["RELEASE_KEY"] = "releaseKey";
    // SwapIframe requests
    KeyguardCommand["SIGN_SWAP_TRANSACTIONS"] = "signSwapTransactions";
    // Deprecated iframe requests
    KeyguardCommand["LIST_LEGACY_ACCOUNTS"] = "listLegacyAccounts";
    KeyguardCommand["HAS_LEGACY_ACCOUNTS"] = "hasLegacyAccounts";
    KeyguardCommand["MIGRATE_ACCOUNTS_TO_KEYS"] = "migrateAccountsToKeys";
})(exports.KeyguardCommand || (exports.KeyguardCommand = {}));

/**
 * TypeScript port of @nimiq/core/src/main/generic/utils/Observable.js
 */
class Observable {
    static get WILDCARD() {
        return '*';
    }
    constructor() {
        this._listeners = new Map();
    }
    on(type, callback) {
        if (!this._listeners.has(type)) {
            this._listeners.set(type, [callback]);
            return 0;
        }
        else {
            return this._listeners.get(type).push(callback) - 1;
        }
    }
    off(type, id) {
        if (!this._listeners.has(type) || !this._listeners.get(type)[id])
            return;
        delete this._listeners.get(type)[id];
    }
    fire(type, ...args) {
        const promises = [];
        // Notify listeners for this event type.
        if (this._listeners.has(type)) {
            const listeners = this._listeners.get(type);
            for (const key in listeners) {
                // Skip non-numeric properties.
                // @ts-ignore (Argument of type 'string' is not assignable to parameter of type 'number'.)
                if (isNaN(key))
                    continue;
                const listener = listeners[key];
                const res = listener.apply(null, args);
                if (res instanceof Promise)
                    promises.push(res);
            }
        }
        // Notify wildcard listeners. Pass event type as first argument
        if (this._listeners.has(Observable.WILDCARD)) {
            const listeners = this._listeners.get(Observable.WILDCARD);
            for (const key in listeners) {
                // Skip non-numeric properties.
                // @ts-ignore (Argument of type 'string' is not assignable to parameter of type 'number'.)
                if (isNaN(key))
                    continue;
                const listener = listeners[key];
                const res = listener.apply(null, [...arguments]);
                if (res instanceof Promise)
                    promises.push(res);
            }
        }
        if (promises.length > 0)
            return Promise.all(promises);
        return null;
    }
    bubble(observable, ...types) {
        for (const type of types) {
            let callback;
            if (type === Observable.WILDCARD) {
                callback = function () {
                    this.fire.apply(this, [...arguments]);
                };
            }
            else {
                callback = function () {
                    this.fire.apply(this, [type, ...arguments]);
                };
            }
            observable.on(type, callback.bind(this));
        }
    }
    _offAll() {
        this._listeners.clear();
    }
}

const SignMessageConstants = {
    SIGN_MSG_PREFIX: '\x16Nimiq Signed Message:\n',
};

// 'export' to client via side effects
window.__messageSigningPrefix = {
    MSG_PREFIX: SignMessageConstants.SIGN_MSG_PREFIX,
};

class KeyguardClient {
    // getter to help with tree-shaking
    static get DEFAULT_ENDPOINT() {
        return window.location.origin === 'https://hub.nimiq.com' ? 'https://keyguard.nimiq.com'
            : window.location.origin === 'https://hub.nimiq-testnet.com' ? 'https://keyguard.nimiq-testnet.com'
                : `${location.protocol}//${location.hostname}:8000/src`;
    }
    constructor(endpoint = KeyguardClient.DEFAULT_ENDPOINT, returnURL, localState, preserveRequests, handleHistoryBack) {
        this._endpoint = endpoint;
        this._redirectBehavior = new RedirectRequestBehavior(returnURL, localState, handleHistoryBack);
        this._iframeBehavior = new IFrameRequestBehavior();
        const allowedOrigin = RequestBehavior.getAllowedOrigin(this._endpoint);
        // Listen for response
        this._redirectClient = new rpc.RedirectRpcClient('', allowedOrigin, preserveRequests);
        this._redirectClient.onResponse('request', this._onResolve.bind(this), this._onReject.bind(this));
        this._observable = new Observable();
    }
    init() {
        return this._redirectClient.init();
    }
    on(command, resolve, reject) {
        this._observable.on(`${command}-resolve`, resolve);
        this._observable.on(`${command}-reject`, reject);
    }
    /* TOP-LEVEL REQUESTS */
    create(request) {
        this._redirectRequest(exports.KeyguardCommand.CREATE, request);
    }
    remove(request) {
        this._redirectRequest(exports.KeyguardCommand.REMOVE, request);
    }
    import(request) {
        this._redirectRequest(exports.KeyguardCommand.IMPORT, request);
    }
    export(request) {
        this._redirectRequest(exports.KeyguardCommand.EXPORT, request);
    }
    changePassword(request) {
        this._redirectRequest(exports.KeyguardCommand.CHANGE_PASSWORD, request);
    }
    resetPassword(request) {
        this._redirectRequest(exports.KeyguardCommand.IMPORT, request);
    }
    signTransaction(request) {
        this._redirectRequest(exports.KeyguardCommand.SIGN_TRANSACTION, request);
    }
    signStaking(request) {
        this._redirectRequest(exports.KeyguardCommand.SIGN_STAKING, request);
    }
    deriveAddress(request) {
        this._redirectRequest(exports.KeyguardCommand.DERIVE_ADDRESS, request);
    }
    signMessage(request) {
        this._redirectRequest(exports.KeyguardCommand.SIGN_MESSAGE, request);
    }
    signBtcTransaction(request) {
        this._redirectRequest(exports.KeyguardCommand.SIGN_BTC_TRANSACTION, request);
    }
    deriveBtcXPub(request) {
        this._redirectRequest(exports.KeyguardCommand.DERIVE_BTC_XPUB, request);
    }
    signSwap(request) {
        this._redirectRequest(exports.KeyguardCommand.SIGN_SWAP, request);
    }
    /* IFRAME REQUESTS */
    async list() {
        return this._iframeRequest(exports.KeyguardCommand.LIST);
    }
    async hasKeys() {
        return this._iframeRequest(exports.KeyguardCommand.HAS_KEYS);
    }
    async deriveAddresses(keyId, paths) {
        return this._iframeRequest(exports.KeyguardCommand.DERIVE_ADDRESSES, { keyId, paths });
    }
    async releaseKey(keyId, shouldBeRemoved = false) {
        return this._iframeRequest(exports.KeyguardCommand.RELEASE_KEY, { keyId, shouldBeRemoved });
    }
    async listLegacyAccounts() {
        return this._iframeRequest(exports.KeyguardCommand.LIST_LEGACY_ACCOUNTS);
    }
    async hasLegacyAccounts() {
        return this._iframeRequest(exports.KeyguardCommand.HAS_LEGACY_ACCOUNTS);
    }
    async migrateAccountsToKeys() {
        return this._iframeRequest(exports.KeyguardCommand.MIGRATE_ACCOUNTS_TO_KEYS);
    }
    async signSwapTransactions(request) {
        return this._iframeRequest(exports.KeyguardCommand.SIGN_SWAP_TRANSACTIONS, request);
    }
    /* PRIVATE METHODS */
    async _redirectRequest(command, request) {
        this._redirectBehavior.request(this._endpoint, command, [request]);
        // return value of redirect call is received in _onResolve()
    }
    async _iframeRequest(command, request) {
        const args = request ? [request] : [];
        const behavior = command === exports.KeyguardCommand.SIGN_SWAP_TRANSACTIONS
            ? new SwapIFrameRequestBehavior()
            : this._iframeBehavior;
        return behavior.request(this._endpoint, command, args);
    }
    _onReject(error, id, state) {
        const [parsedState, command] = this._parseState(state);
        this._observable.fire(`${command}-reject`, error, parsedState);
    }
    _onResolve(result, id, state) {
        const [parsedState, command] = this._parseState(state);
        this._observable.fire(`${command}-resolve`, result, parsedState);
    }
    _parseState(state) {
        if (state) {
            const command = state.__command;
            if (command) {
                delete state.__command;
                return [state, command];
            }
        }
        throw new Error('Invalid state after RPC request');
    }
}
// tslint:disable-next-line:variable-name
const MSG_PREFIX = window.__messageSigningPrefix.MSG_PREFIX;

/** @type KeyguardRequest.KeyguardError */
const ErrorConstants = {
    Types: {
        // used for request parsing errors.
        INVALID_REQUEST: 'InvalidRequest',
        // used for errors thrown from core methods
        CORE: 'Core',
        // used for other internal keyguard Errors.
        KEYGUARD: 'Keyguard',
        // used for the remaining Errors which are not assigned an own type just yet.
        UNCLASSIFIED: 'Unclassified',
    },
    Messages: {
        // specifically used to trigger a redirect to create after returning to caller
        GOTO_CREATE: 'GOTO_CREATE',
        // Specifically used to trigger a redirect to a special import after returning to caller
        GOTO_RESET_PASSWORD: 'GOTO_RESET_PASSWORD',
        // used to signal a user initiated cancelation of the request
        CANCELED: 'CANCELED',
        // used to signal that the request expired
        EXPIRED: 'EXPIRED',
        // used to signal that a given keyId no longer exist in KG, to be treated by caller.
        KEY_NOT_FOUND: 'keyId not found',
        // network name does not exist
        INVALID_NETWORK_CONFIG: 'Invalid network config',
    },
};

// 'export' to client via side effects
window.__keyguardErrorContainer = {
    ErrorConstants,
};

// tslint:disable-next-line:variable-name
const Errors = window.__keyguardErrorContainer.ErrorConstants;

(function (BitcoinTransactionInputType) {
    BitcoinTransactionInputType["STANDARD"] = "standard";
    BitcoinTransactionInputType["HTLC_REDEEM"] = "htlc-redeem";
    BitcoinTransactionInputType["HTLC_REFUND"] = "htlc-refund";
})(exports.BitcoinTransactionInputType || (exports.BitcoinTransactionInputType = {}));

exports.KeyguardClient = KeyguardClient;
exports.MSG_PREFIX = MSG_PREFIX;
exports.RequestBehavior = RequestBehavior;
exports.RedirectRequestBehavior = RedirectRequestBehavior;
exports.IFrameRequestBehavior = IFrameRequestBehavior;
exports.SwapIFrameRequestBehavior = SwapIFrameRequestBehavior;
exports.Errors = Errors;
