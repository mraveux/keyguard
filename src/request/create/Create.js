/* global Nimiq */
/* global IdenticonSelector */
/* global PassphraseSetterBox */
/* global DownloadKeyfile */
/* global PrivacyAgent */
/* global RecoveryWords */
/* global ValidateWords */
/* global Key */
/* global KeyStore */
/* global ProgressIndicator */

class Create {
    /**
     * @param {CreateRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        this._resolve = resolve;

        this._passphrase = '';

        /** @type {HTMLDivElement} */
        const $identiconSelector = (document.querySelector('.identicon-selector'));

        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.querySelector('.passphrase-box'));

        /** @type {HTMLElement} */
        const $downloadKeyfile = (document.querySelector('.download-keyfile'));

        /** @type {HTMLElement} */
        const $privacyAgent = (document.querySelector('.privacy-agent'));

        /** @type {HTMLElement} */
        const $recoveryWords = (document.querySelector('.recovery-words'));
        /** @type {HTMLElement} */
        const $recoveryWordsButton = (document.querySelector('#recovery-words button'));
        /** @type {HTMLElement} */
        const $recoveryWordsSkip = (document.querySelector('#recovery-words .skip'));

        /** @type {HTMLElement} */
        const $validateWords = (document.querySelector('.validate-words'));

        // Create components

        this._identiconSelector = new IdenticonSelector($identiconSelector, request.defaultKeyPath);
        this._downloadKeyfile = new DownloadKeyfile($downloadKeyfile);
        this._privacyAgent = new PrivacyAgent($privacyAgent);
        this._recoveryWords = new RecoveryWords($recoveryWords, false);
        this._validateWords = new ValidateWords($validateWords);
        this._passphraseSetter = new PassphraseSetterBox($setPassphrase);

        // Wire up logic

        this._identiconSelector.on(
            IdenticonSelector.Events.IDENTICON_SELECTED,
            /** @param {Nimiq.Entropy} entropy */
            entropy => {
                this._selectedEntropy = entropy;
                const mnemonic = Nimiq.MnemonicUtils.entropyToMnemonic(entropy);
                this._recoveryWords.setWords(mnemonic);
                this._validateWords.setWords(mnemonic);
                window.location.hash = Create.Pages.SET_PASSPHRASE;
                this._passphraseSetter.reset();
                this._passphraseSetter.focus();
            },
        );

        this._passphraseSetter.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ passphrase => {
            this._passphrase = passphrase;
            // TODO Generate secret for key file
            this._downloadKeyfile.setSecret(new Uint8Array(0), true);
            const keyfileIcon = /** @type {HTMLElement} */ (document.querySelector('.page#download-keyfile .icon'));
            keyfileIcon.classList.remove('icon-keyfile-insecure');
            keyfileIcon.classList.add('icon-keyfile-secure');
            window.location.hash = Create.Pages.DOWNLOAD_KEYFILE;
            this._passphraseSetter.reset();
        });

        this._passphraseSetter.on(PassphraseSetterBox.Events.SKIP, () => {
            // TODO Generate secret for key file
            this._downloadKeyfile.setSecret(new Uint8Array(0), false);
            const keyfileIcon = /** @type {HTMLElement} */ (document.querySelector('.page#download-keyfile .icon'));
            keyfileIcon.classList.remove('icon-keyfile-secure');
            keyfileIcon.classList.add('icon-keyfile-insecure');
            window.location.hash = Create.Pages.DOWNLOAD_KEYFILE;
            this._passphraseSetter.reset();
        });

        this._downloadKeyfile.on(DownloadKeyfile.Events.DOWNLOADED, () => {
            window.location.hash = Create.Pages.PRIVACY_AGENT;
        });

        this._privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = Create.Pages.RECOVERY_WORDS;
        });

        $recoveryWordsButton.addEventListener('click', () => {
            window.location.hash = Create.Pages.VALIDATE_WORDS;
        });

        $recoveryWordsSkip.addEventListener('click', () => {
            this.finish(request);
        });

        this._validateWords.on(ValidateWords.Events.BACK, () => {
            window.location.hash = Create.Pages.RECOVERY_WORDS;
            this._validateWords.reset();
        });

        this._validateWords.on(ValidateWords.Events.VALIDATED, () => {
            this.finish(request);
        });

        this._validateWords.on(ValidateWords.Events.SKIP, () => {
            this.finish(request);
        });

        /** @type {HTMLElement} */
        const $appName = (document.querySelector('#app-name'));
        $appName.textContent = request.appName;
        /** @type HTMLAnchorElement */
        const $cancelLink = ($appName.parentNode);
        $cancelLink.classList.remove('display-none');
        $cancelLink.addEventListener('click', () => window.close());

        // Set up progress indicators
        /* eslint-disable no-new */
        new ProgressIndicator(document.querySelector(`#${Create.Pages.CHOOSE_IDENTICON} .progress-indicator`), 6, 2);
        new ProgressIndicator(document.querySelector(`#${Create.Pages.SET_PASSPHRASE}   .progress-indicator`), 6, 3);
        new ProgressIndicator(document.querySelector(`#${Create.Pages.DOWNLOAD_KEYFILE} .progress-indicator`), 6, 3);
        new ProgressIndicator(document.querySelector(`#${Create.Pages.PRIVACY_AGENT}    .progress-indicator`), 6, 4);
        new ProgressIndicator(document.querySelector(`#${Create.Pages.RECOVERY_WORDS}   .progress-indicator`), 6, 4);
        new ProgressIndicator(document.querySelector(`#${Create.Pages.VALIDATE_WORDS}   .progress-indicator`), 6, 5);
        /* eslint-enable no-new */
    } // constructor

    /**
     * @param {CreateRequest} request
     */
    async finish(request) {
        document.body.classList.add('loading');
        const key = new Key(this._selectedEntropy.serialize());
        // XXX Should we use utf8 encoding here instead?
        const passphrase = Nimiq.BufferUtils.fromAscii(this._passphrase);
        await KeyStore.instance.put(key, passphrase);

        const keyPath = request.defaultKeyPath;

        /** @type {CreateResult} */
        const result = {
            keyId: key.id,
            keyPath,
            address: key.deriveAddress(keyPath).serialize(),
        };

        this._resolve(result);
    }

    run() {
        // go to start page
        window.location.hash = Create.Pages.CHOOSE_IDENTICON;
        this._identiconSelector.generateIdenticons();
    }
}

Create.Pages = {
    CHOOSE_IDENTICON: 'choose-identicon',
    SET_PASSPHRASE: 'set-passphrase',
    DOWNLOAD_KEYFILE: 'download-keyfile',
    PRIVACY_AGENT: 'privacy-agent',
    RECOVERY_WORDS: 'recovery-words',
    VALIDATE_WORDS: 'validate-words',
};
