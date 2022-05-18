import * as Nimiq from '@nimiq/core-web';
import { KeyguardCommand } from './KeyguardCommand';
export declare type ObjectType = {
    [key: string]: any;
};
export declare type Is<T, B> = keyof T extends keyof B ? keyof B extends keyof T ? B : never : never;
export declare type Transform<T, K extends keyof T, E> = Omit<T, K> & E;
export declare type BasicRequest = {
    appName: string;
};
export declare type SingleKeyResult = {
    keyId: string;
    keyType: Nimiq.Secret.Type;
    keyLabel?: string;
    addresses: Array<{
        keyPath: string;
        address: Uint8Array;
    }>;
    fileExported: boolean;
    wordsExported: boolean;
    bitcoinXPub?: string;
};
export declare type TransactionInfo = {
    keyPath: string;
    senderLabel?: string;
    sender: Uint8Array;
    senderType: Nimiq.Account.Type | 3;
    recipient: Uint8Array;
    recipientType?: Nimiq.Account.Type;
    value: number;
    fee: number;
    validityStartHeight: number;
    data?: Uint8Array;
    flags?: number;
};
export declare enum BitcoinTransactionInputType {
    STANDARD = "standard",
    HTLC_REDEEM = "htlc-redeem",
    HTLC_REFUND = "htlc-refund"
}
export declare type BitcoinTransactionInput = {
    keyPath: string;
    transactionHash: string;
    outputIndex: number;
    outputScript: string;
    value: number;
} & ({
    type?: BitcoinTransactionInputType.STANDARD;
} | {
    type: BitcoinTransactionInputType.HTLC_REDEEM | BitcoinTransactionInputType.HTLC_REFUND;
    witnessScript: string;
    sequence?: number;
});
export declare type BitcoinTransactionOutput = {
    address: string;
    value: number;
    label?: string;
};
export declare type BitcoinTransactionChangeOutput = {
    keyPath: string;
    address?: string;
    value: number;
};
export declare type BitcoinTransactionInfo = {
    inputs: BitcoinTransactionInput[];
    recipientOutput: BitcoinTransactionOutput;
    changeOutput?: BitcoinTransactionChangeOutput;
    locktime?: number;
};
export declare type SignTransactionRequestLayout = 'standard' | 'checkout' | 'cashlink';
export declare type SignBtcTransactionRequestLayout = 'standard' | 'checkout';
export declare type CreateRequest = BasicRequest & {
    defaultKeyPath: string;
    enableBackArrow?: boolean;
    bitcoinXPubPath: string;
};
export declare type DeriveAddressRequest = SimpleRequest & {
    baseKeyPath: string;
    indicesToDerive: string[];
};
export declare type DeriveAddressesRequest = {
    keyId: string;
    paths: string[];
};
export declare type EmptyRequest = null;
export declare type ImportRequest = BasicRequest & {
    requestedKeyPaths: string[];
    isKeyLost?: boolean;
    enableBackArrow?: boolean;
    wordsOnly?: boolean;
    bitcoinXPubPath: string;
};
export declare type ResetPasswordRequest = ImportRequest & {
    expectedKeyId: string;
};
export declare type ReleaseKeyRequest = {
    keyId: string;
    shouldBeRemoved: boolean;
};
export declare type RemoveKeyRequest = BasicRequest & {
    keyId: string;
    keyLabel: string;
};
export declare type SignatureResult = {
    publicKey: Uint8Array;
    signature: Uint8Array;
};
export declare type SimpleRequest = BasicRequest & {
    keyId: string;
    keyLabel?: string;
};
export declare type ExportRequest = SimpleRequest & {
    fileOnly?: boolean;
    wordsOnly?: boolean;
};
export declare type ExportResult = {
    fileExported: boolean;
    wordsExported: boolean;
};
declare type SignTransactionRequestCommon = SimpleRequest & TransactionInfo;
export declare type SignTransactionRequestStandard = SignTransactionRequestCommon & {
    layout?: 'standard';
    recipientLabel?: string;
};
export declare type SignTransactionRequestCheckout = SignTransactionRequestCommon & {
    layout: 'checkout';
    shopOrigin: string;
    shopLogoUrl?: string;
    time?: number;
    expires?: number;
    fiatCurrency?: string;
    fiatAmount?: number;
    vendorMarkup?: number;
};
export declare type SignTransactionRequestCashlink = SignTransactionRequestCommon & {
    layout: 'cashlink';
    cashlinkMessage?: string;
};
export declare type SignTransactionRequest = SignTransactionRequestStandard | SignTransactionRequestCheckout | SignTransactionRequestCashlink;
export declare type SignStakingRequest = SignTransactionRequestCommon & {
    type: number;
    recipientLabel?: string;
    delegation?: string;
};
export declare type SignBtcTransactionRequestStandard = SimpleRequest & BitcoinTransactionInfo & {
    layout?: 'standard';
};
export declare type SignBtcTransactionRequestCheckout = SimpleRequest & BitcoinTransactionInfo & {
    layout: 'checkout';
    shopOrigin: string;
    shopLogoUrl?: string;
    time?: number;
    expires?: number;
    fiatCurrency?: string;
    fiatAmount?: number;
    vendorMarkup?: number;
};
export declare type SignBtcTransactionRequest = SignBtcTransactionRequestStandard | SignBtcTransactionRequestCheckout;
export declare type MockSettlementInstruction = {
    type: 'mock';
    contractId: string;
};
export declare type SepaSettlementInstruction = {
    type: 'sepa';
    contractId: string;
    recipient: {
        name: string;
        iban: string;
        bic: string;
    };
};
export declare type SettlementInstruction = MockSettlementInstruction | SepaSettlementInstruction;
export declare type SignSwapRequestLayout = 'standard' | 'slider';
export declare type SignSwapRequestCommon = SimpleRequest & {
    swapId: string;
    fund: ({
        type: 'NIM';
    } & Omit<TransactionInfo, 'recipient' | 'recipientType' | 'recipientLabel' | 'data' | 'flags'> & {
        senderLabel: string;
    }) | ({
        type: 'BTC';
    } & Transform<BitcoinTransactionInfo, 'recipientOutput', {
        recipientOutput: Omit<BitcoinTransactionOutput, 'address' | 'label'>;
        refundKeyPath: string;
    }>) | ({
        type: 'EUR';
    } & {
        amount: number;
        fee: number;
        bankLabel?: string;
    });
    redeem: ({
        type: 'NIM';
    } & Omit<TransactionInfo, 'sender' | 'senderType' | 'senderLabel' | 'recipientType' | 'flags'> & {
        recipientLabel: string;
    }) | ({
        type: 'BTC';
    } & {
        input: Omit<BitcoinTransactionInput, // Only allow one input (the HTLC UTXO)
        'transactionHash' | 'outputIndex' | 'outputScript' | 'witnessScript' | 'type'>;
        output: BitcoinTransactionChangeOutput;
    }) | ({
        type: 'EUR';
    } & {
        keyPath: string;
        settlement: Omit<SettlementInstruction, 'contractId'>;
        amount: number;
        fee: number;
        bankLabel?: string;
    });
    fiatCurrency: string;
    fundingFiatRate: number;
    redeemingFiatRate: number;
    fundFees: {
        processing: number;
        redeeming: number;
    };
    redeemFees: {
        funding: number;
        processing: number;
    };
    serviceSwapFee: number;
};
export declare type SignSwapRequestStandard = SignSwapRequestCommon & {
    layout: 'standard';
};
export declare type SignSwapRequestSlider = SignSwapRequestCommon & {
    layout: 'slider';
    nimiqAddresses: Array<{
        address: string;
        balance: number;
    }>;
    bitcoinAccount: {
        balance: number;
    };
};
export declare type SignSwapRequest = SignSwapRequestStandard | SignSwapRequestSlider;
export declare type SignSwapResult = SimpleResult & {
    eurPubKey?: string;
};
export declare type SignSwapTransactionsRequest = {
    swapId: string;
    fund: {
        type: 'NIM';
        htlcData: Uint8Array;
    } | {
        type: 'BTC';
        htlcScript: Uint8Array;
    } | {
        type: 'EUR';
        hash: string;
        timeout: number;
        htlcId: string;
    };
    redeem: {
        type: 'NIM';
        htlcData: Uint8Array;
        htlcAddress: string;
    } | {
        type: 'BTC';
        htlcScript: Uint8Array;
        transactionHash: string;
        outputIndex: number;
    } | {
        type: 'EUR';
        hash: string;
        timeout: number;
        htlcId: string;
    };
};
export declare type SignMessageRequest = SimpleRequest & {
    keyPath: string;
    message: Uint8Array | string;
    signer: Uint8Array;
    signerLabel: string;
};
export declare type DeriveBtcXPubRequest = SimpleRequest & {
    bitcoinXPubPath: string;
};
export declare type DeriveBtcXPubResult = {
    bitcoinXPub: string;
};
export declare type RedirectRequest = CreateRequest | DeriveAddressRequest | ExportRequest | ImportRequest | RemoveKeyRequest | SignMessageRequest | SignTransactionRequest | SignStakingRequest | SignBtcTransactionRequest | SimpleRequest | DeriveBtcXPubRequest | SignSwapRequest;
export declare type IFrameRequest = EmptyRequest | DeriveAddressesRequest | ReleaseKeyRequest | SignSwapTransactionsRequest;
export declare type Request = RedirectRequest | IFrameRequest;
export declare type KeyInfoObject = {
    id: string;
    type: Nimiq.Secret.Type;
    hasPin: boolean;
};
export declare type LegacyKeyInfoObject = KeyInfoObject & {
    legacyAccount: {
        label: string;
        address: Uint8Array;
    };
};
export declare type DerivedAddress = {
    address: Uint8Array;
    keyPath: string;
};
export declare type KeyResult = SingleKeyResult[];
export declare type ListResult = KeyInfoObject[];
export declare type ListLegacyResult = LegacyKeyInfoObject[];
export declare type SignTransactionResult = SignatureResult;
export declare type SignStakingResult = SignatureResult & {
    data: Uint8Array;
};
export declare type SimpleResult = {
    success: boolean;
};
export declare type SignedBitcoinTransaction = {
    transactionHash: string;
    raw: string;
};
export declare type SignSwapTransactionsResult = {
    nim?: SignatureResult;
    btc?: SignedBitcoinTransaction;
    eur?: string;
    refundTx?: string;
};
export declare type IFrameResult = DerivedAddress[] | ListLegacyResult | ListResult | SimpleResult | SignSwapTransactionsResult;
export declare type RedirectResult = DerivedAddress[] | ExportResult | KeyResult | SignTransactionResult | SignStakingResult | SignedBitcoinTransaction | SimpleResult | DeriveBtcXPubResult | SignSwapResult;
export declare type Result = RedirectResult | IFrameResult;
export declare type ResultType<T extends RedirectRequest> = T extends Is<T, SignMessageRequest> | Is<T, SignTransactionRequest> ? SignatureResult : T extends Is<T, SignStakingRequest> ? SignStakingResult : T extends Is<T, DeriveAddressRequest> ? DerivedAddress[] : T extends Is<T, CreateRequest> | Is<T, ImportRequest> | Is<T, ResetPasswordRequest> ? KeyResult : T extends Is<T, ExportRequest> ? ExportResult : T extends Is<T, RemoveKeyRequest> | Is<T, SimpleRequest> ? SimpleResult : T extends Is<T, SignBtcTransactionRequest> ? SignedBitcoinTransaction : T extends Is<T, DeriveBtcXPubRequest> ? DeriveBtcXPubResult : T extends Is<T, SignSwapRequest> ? SignSwapResult : never;
export declare type ResultByCommand<T extends KeyguardCommand> = T extends KeyguardCommand.SIGN_MESSAGE | KeyguardCommand.SIGN_TRANSACTION ? SignatureResult : T extends KeyguardCommand.SIGN_STAKING ? SignStakingResult : T extends KeyguardCommand.DERIVE_ADDRESS ? DerivedAddress[] : T extends KeyguardCommand.CREATE | KeyguardCommand.IMPORT ? KeyResult : T extends KeyguardCommand.EXPORT ? ExportResult : T extends KeyguardCommand.REMOVE ? SimpleResult : T extends KeyguardCommand.SIGN_BTC_TRANSACTION ? SignedBitcoinTransaction : T extends KeyguardCommand.DERIVE_BTC_XPUB ? DeriveBtcXPubResult : T extends KeyguardCommand.SIGN_SWAP ? SignSwapResult : never;
export declare type KeyguardError = {
    Types: {
        INVALID_REQUEST: 'InvalidRequest';
        CORE: 'Core';
        KEYGUARD: 'Keyguard';
        UNCLASSIFIED: 'Unclassified';
    };
    Messages: {
        GOTO_CREATE: 'GOTO_CREATE';
        GOTO_RESET_PASSWORD: 'GOTO_RESET_PASSWORD';
        CANCELED: 'CANCELED';
        EXPIRED: 'EXPIRED';
        KEY_NOT_FOUND: 'keyId not found';
        INVALID_NETWORK_CONFIG: 'Invalid network config';
    };
};
export {};
