/* global Constants */

// We want to only allow this config file in dev environments. Supporting IPs as hostname is nice for debugging e.g.
// on mobile devices, though. We assume that any keyguard instance hosted in production would be accessed by DNS.
const ipRegEx = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
if (window.location.hostname !== 'localhost' && !ipRegEx.test(window.location.hostname)) {
    throw new Error('Using development config is only allowed locally');
}

// @ts-ignore
const CONFIG = { // eslint-disable-line no-unused-vars
    ALLOWED_ORIGIN: '*',
    NETWORK: Constants.NETWORK.TEST,
    BTC_NETWORK: /** @type {'MAIN' | 'TEST'} */ ('TEST'), // BitcoinConstants is not included in the common bundle
    ROOT_REDIRECT: 'https://wallet.nimiq-testnet.com',

    RSA_KEY_BITS: 2048, // Possible values are 1024 (fast, but unsafe), 2048 (good compromise), 4096 (slow, but safe)
    RSA_KDF_FUNCTION: 'PBKDF2-SHA512',
    RSA_KDF_ITERATIONS: 1024,

    RSA_SUPPORTED_KEY_BITS: [2048],
    RSA_SUPPORTED_KDF_FUNCTIONS: ['PBKDF2-SHA512'],
    /** @type {Record<string, number[]>} */
    RSA_SUPPORTED_KDF_ITERATIONS: {
        'PBKDF2-SHA512': [1024],
    },
};
