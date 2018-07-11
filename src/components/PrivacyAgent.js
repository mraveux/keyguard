class PrivacyAgent { // eslint-disable-line no-unused-vars
    /**
     * @param {string} nexthash - the hash to route to when the user clicked "ok"
     * @param {HTMLElement} [el]
     */
    constructor(nexthash = 'continue', el) {
        this.$el = el || this._createElement(nexthash);
    }

    /**
     * @param {string} nextHash
     * @returns {HTMLElement}
     */
    _createElement(nextHash) {
        /** @type HTMLElement */
        const el = document.createElement('div');
        el.classList.add('privacy-agent');
        /* eslint-disable max-len */
        el.innerHTML = `
            <div class="privacy-agent-container">
                <svg width="162" height="144" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink">
                    <defs>
                        <path d="M108 27.54l53.28 30.76a16 16 0 0 1 8 13.86v61.53a16 16 0 0 1-8 13.85L108 178.3a16 16 0 0 1-16 0l-53.28-30.76a16 16 0 0 1-8-13.85V72.16a16 16 0 0 1 8-13.86L92 27.54a16 16 0 0 1 16 0z"
                                id="a"/>
                    </defs>
                    <g transform="translate(-19 -31)" fill="none" fill-rule="evenodd">
                        <mask id="b" fill="#fff">
                            <use xlink:href="#a"/>
                        </mask>
                        <use stroke="#000" stroke-width="5" transform="rotate(30 100 102.92)" xlink:href="#a"/>
                        <path d="M86.38 50c-3.45 0-6.33 2.07-8.52 4.82-2.2 2.77-3.9 6.35-5.35 10.26-2.7 7.3-4.34 15.57-5.34 21.62-5.07.98-9.64 2.12-12.86 3.58-1.8.82-3.3 1.7-4.45 2.82a5.94 5.94 0 0 0-2.05 4.23 5.7 5.7 0 0 0 1.6 3.78 12.95 12.95 0 0 0 3.51 2.6c2.84 1.5 6.64 2.74 11.28 3.8.08 0 .17.02.24.04a6.03 6.03 0 0 0-.75 2.86c0 1.46.45 2.71.8 3.93l.48 1.62c.11.44.14.86.14.53 0 3.07 2.59 5.46 5.64 5.57.07 1.63.3 3.21.62 4.75-3.87.7-7.41 2.74-10.23 4.69a45.92 45.92 0 0 0-5.87 4.82l-1.48 1.49 6.8 7.74a54.56 54.56 0 0 0-12.36 10.93C44.1 161.44 41 166.71 41 171.71V192h118v-20.29c0-5.04-3.01-10.41-7.06-15.45a53.15 53.15 0 0 0-12.2-11.1l6.47-7.35-1.48-1.49s-2.4-2.42-5.87-4.82c-2.82-1.95-6.36-3.98-10.23-4.69.33-1.54.55-3.13.62-4.75 3.05-.1 5.64-2.5 5.64-5.57 0 .33.03-.1.14-.53l.47-1.62c.36-1.22.8-2.47.8-3.93 0-1.04-.28-2-.74-2.86l.24-.05c4.64-1.05 8.44-2.29 11.28-3.8 1.4-.75 2.6-1.58 3.52-2.59a5.7 5.7 0 0 0 1.6-3.78c0-1.67-.9-3.13-2.06-4.23-1.16-1.11-2.65-2-4.45-2.82-3.22-1.46-7.79-2.6-12.86-3.58-1-6.05-2.64-14.32-5.34-21.62-1.45-3.9-3.16-7.49-5.35-10.26-2.19-2.75-5.07-4.82-8.52-4.82-3.91 0-6.72 1.37-8.79 2.55-2.06 1.17-3.31 1.96-4.83 1.96s-2.77-.79-4.83-1.96A17.01 17.01 0 0 0 86.38 50zm0 4.5c2.9 0 4.63.89 6.54 1.97 1.9 1.08 4.06 2.55 7.08 2.55 3.02 0 5.18-1.47 7.08-2.55 1.9-1.08 3.64-1.96 6.54-1.96 1.65 0 3.26.96 4.96 3.1 1.7 2.16 3.3 5.39 4.65 9.03 2.7 7.3 4.44 16.25 5.38 22.19.16.95.9 1.7 1.85 1.86 5.69 1.02 10.32 2.32 13.34 3.7 1.5.68 2.6 1.4 3.2 1.96.61.57.65.86.65.98 0 .1-.01.31-.42.77a9.13 9.13 0 0 1-2.3 1.63c-2.23 1.19-5.74 2.38-10.14 3.38-1.66.37-3.5.71-5.4 1.03-.2.03-.4.04-.5.09a184.71 184.71 0 0 1-28.89 2.12c-10.83 0-20.82-.81-28.9-2.12-.1-.05-.3-.06-.5-.1-1.9-.3-3.73-.65-5.4-1.02-4.39-1-7.9-2.2-10.12-3.38a9.13 9.13 0 0 1-2.3-1.63c-.42-.46-.43-.66-.43-.77 0-.12.04-.41.64-.98.6-.57 1.7-1.28 3.21-1.97 3.02-1.37 7.65-2.67 13.34-3.69.26-.04.5-.14.74-.27l1.25.1 1.35-1.5-.4-1.98-.6-.53-.09-.05c1-5.8 2.6-13.4 4.98-19.82 1.34-3.64 2.95-6.87 4.65-9.02 1.7-2.15 3.3-3.11 4.96-3.11zm38.63 34.44l-.78.13-.22.08-1.42 1.45.33 1.99 1.8.94.8-.13.21-.08 1.41-1.45-.33-2-1.8-.93zm-45.4 1.02l-2.01.33-.92 1.8.9 1.82.71.36.21.06 2-.34.93-1.8-.9-1.8-.7-.37-.22-.06zm36.74 1.35l-.81.03-.22.04-1.6 1.23.04 2.03 1.65 1.18.8-.03.22-.04 1.6-1.23-.03-2.02-1.65-1.19zm-28.02.67l-1.93.63-.65 1.9 1.16 1.67.75.26.22.02 1.94-.62.65-1.91-1.15-1.67-.76-.25-.23-.03zm18.3.59h-.21l-1.77 1.03-.23 2 1.47 1.39.81.09.22-.02 1.76-1 .23-2.01-1.47-1.4-.8-.08zm-9.32.2l-1.84.87-.4 1.98 1.36 1.5.78.15.23.01 1.83-.86.4-1.98-1.35-1.5-.8-.17h-.21zM70 108.66l.1.06c.39.19.93.49 1.52.82l3.4 2v-2.2c1.59.21 3.2.4 4.87.57a5.4 5.4 0 0 0-.32 1.84c0 4.48 4.06 8.11 9.07 8.11 5.02 0 9.08-3.63 9.08-8.1 0-.35-.07-.64-.11-.94.8.01 1.57.03 2.38.03.8 0 1.59-.02 2.38-.03-.04.3-.11.6-.11.93 0 4.48 4.06 8.11 9.08 8.11 5.01 0 9.07-3.63 9.07-8.1 0-.72-.13-1.3-.32-1.85 1.67-.17 3.28-.36 4.86-.57v2.2l3.41-2c.59-.33 1.13-.63 1.51-.82l.1-.06c1.04.1 1.79.83 1.79 1.74 0 .17-.27 1.49-.61 2.67-.18.58-.36 1.17-.5 1.7-.16.54-.3.92-.3 1.71 0 .6-.5 1.13-1.29 1.13h-4.1v3.08a24.81 24.81 0 0 1-20.56 24.39l-.65.1-.49.45a4.8 4.8 0 0 1-6.54 0l-.49-.45-.65-.1a24.81 24.81 0 0 1-20.55-24.39v-3.08h-4.11c-.78 0-1.28-.53-1.28-1.13 0-.79-.15-1.17-.3-1.7l-.5-1.71a20.4 20.4 0 0 1-.62-2.67c0-.9.75-1.63 1.78-1.74zm2.66 22.5a29.25 29.25 0 0 0 11.47 14.05c.13 9.44 3.56 20.04 6.95 28.46a143.28 143.28 0 0 0 6.37 13.81h-9.79l-23.02-18.35 11.1-13.24-15.63-17.74c.83-.77 1.47-1.48 3.62-2.97 2.66-1.84 6-3.56 8.93-4.02zm54.66 0c2.93.46 6.27 2.18 8.93 4.02 2.15 1.5 2.79 2.2 3.62 2.97l-15.63 17.74 11.1 13.24-23.02 18.35h-9.79c.72-1.35 3.35-6.33 6.37-13.81 3.4-8.42 6.82-19.01 6.95-28.45a29.23 29.23 0 0 0 11.47-14.06zm-38.54 16.48c1.73.7 3.52 1.28 5.4 1.66a9.35 9.35 0 0 0 5.81 2.12 9.4 9.4 0 0 0 5.78-2.11c1.89-.37 3.7-.95 5.43-1.66-.63 7.85-3.54 16.98-6.5 24.34-2.36 5.85-3.52 7.82-4.71 10.13-1.19-2.3-2.35-4.28-4.7-10.13-2.97-7.36-5.88-16.49-6.51-24.35zm47.93.93a49.02 49.02 0 0 1 11.67 10.5c3.7 4.6 6.07 9.57 6.07 12.63v15.78h-34.89l22.23-17.71-11.6-13.8 6.52-7.4zm-73.09.41l6.16 6.98-11.6 13.8 22.24 17.72h-34.9V171.7c0-2.93 2.41-7.82 6.2-12.35a50.38 50.38 0 0 1 11.9-10.37z"
                                fill="#000" fill-rule="nonzero" mask="url(#b)"/>
                    </g>
                </svg>
                <h1 data-i18n="privacy-agent-headline">Are you being watched?</h1>
                <p data-i18n="privacy-agent-info">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder
                    spies?</p>
                <p><strong data-i18n="privacy-agent-warning">Anyone that can see your Recovery Words can steal all your funds!</strong></p>
            </div>
            <div class="grow"></div>
            <a href="#continue"><button data-i18n="privacy-agent-ok">OK, all good</button></a>
        `;
        this.$ok = el.querySelector('a');
        if (!this.$ok) {
            throw new Error('Next link not found');
        }
        this.$ok.href = `#${nextHash}`;
        /* eslint-enable max-len */
        I18n.translateDom(el);
        return el;
    }

    /** @returns {HTMLElement} */
    getElement() {
        return this.$el;
    }
}
