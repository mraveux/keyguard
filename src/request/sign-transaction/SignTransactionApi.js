class SignTransactionApi extends PopupApi {
    /**
     * @param {TransactionRequest} txRequest
     */
    async onRequest(txRequest) {
        if (Nimiq.Policy.coinsToSatoshis(txRequest.value) < 1) {
            throw new AmountTooSmallError();
        }

        if (txRequest.network !== Nimiq.GenesisConfig.NETWORK_NAME) {
            throw new NetworkMissmatchError(txRequest.network, Nimiq.GenesisConfig.NETWORK_NAME);
        }

        txRequest.value = Nimiq.Policy.coinsToSatoshis(txRequest.value);
        txRequest.fee = Nimiq.Policy.coinsToSatoshis(txRequest.fee);

        // get key from keystore
        const keyStore = KeyStore.instance;
        const keyType = await keyStore.getType(txRequest.sender);

        keyType === EncryptionType.HIGH
            ? new SignTransactionWithPassphrase(txRequest, this.resolve.bind(this), this.reject.bind(this))
            : new SignTransactionWithPin(txRequest, this.resolve.bind(this), this.reject.bind(this));
    }
}
