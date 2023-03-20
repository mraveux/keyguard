import * as Nimiq from '@nimiq/core-web';
import { ForwardRequest } from '@opengsn/common/dist/EIP712/ForwardRequest';
import { RelayData } from '@opengsn/common/dist/EIP712/RelayData';
import { KeyguardCommand } from './KeyguardCommand';
export { ForwardRequest, RelayData, };
export type ObjectType = {
    [key: string]: any;
};
export type Is<T, B> = keyof T extends keyof B ? keyof B extends keyof T ? B : never : never;
export type Transform<T, K extends keyof T, E> = Omit<T, K> & E;
export type BasicRequest = {
    appName: string;
};
export type SingleKeyResult = {
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
    polygonAddresses?: Array<{
        address: string;
        keyPath: string;
    }>;
    tmpCookieEncryptionKey?: Uint8Array;
};
export type TransactionInfo = {
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
export type BitcoinTransactionInput = {
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
export type BitcoinTransactionOutput = {
    address: string;
    value: number;
    label?: string;
};
export type BitcoinTransactionChangeOutput = {
    keyPath: string;
    address?: string;
    value: number;
};
export type BitcoinTransactionInfo = {
    inputs: BitcoinTransactionInput[];
    recipientOutput: BitcoinTransactionOutput;
    changeOutput?: BitcoinTransactionChangeOutput;
    locktime?: number;
};
export type SignTransactionRequestLayout = 'standard' | 'checkout' | 'cashlink';
export type SignBtcTransactionRequestLayout = 'standard' | 'checkout';
export type CreateRequest = BasicRequest & {
    defaultKeyPath: string;
    enableBackArrow?: boolean;
    bitcoinXPubPath: string;
    polygonAccountPath: string;
};
export type DeriveAddressRequest = SimpleRequest & {
    baseKeyPath: string;
    indicesToDerive: string[];
};
export type DeriveAddressesRequest = {
    keyId: string;
    paths: string[];
    tmpCookieEncryptionKey?: Uint8Array;
};
export type EmptyRequest = null;
export type ImportRequest = BasicRequest & {
    requestedKeyPaths: string[];
    isKeyLost?: boolean;
    enableBackArrow?: boolean;
    wordsOnly?: boolean;
    bitcoinXPubPath: string;
    polygonAccountPath: string;
};
export type ResetPasswordRequest = ImportRequest & {
    expectedKeyId: string;
};
export type ReleaseKeyRequest = {
    keyId: string;
    shouldBeRemoved: boolean;
};
export type RemoveKeyRequest = BasicRequest & {
    keyId: string;
    keyLabel: string;
};
export type SignatureResult = {
    publicKey: Uint8Array;
    signature: Uint8Array;
};
export type SimpleRequest = BasicRequest & {
    keyId: string;
    keyLabel?: string;
};
export type ExportRequest = SimpleRequest & {
    fileOnly?: boolean;
    wordsOnly?: boolean;
};
export type ExportResult = {
    fileExported: boolean;
    wordsExported: boolean;
};
type SignTransactionRequestCommon = SimpleRequest & TransactionInfo;
export type SignTransactionRequestStandard = SignTransactionRequestCommon & {
    layout?: 'standard';
    recipientLabel?: string;
};
export type SignTransactionRequestCheckout = SignTransactionRequestCommon & {
    layout: 'checkout';
    shopOrigin: string;
    shopLogoUrl?: string;
    time?: number;
    expires?: number;
    fiatCurrency?: string;
    fiatAmount?: number;
    vendorMarkup?: number;
};
export type SignTransactionRequestCashlink = SignTransactionRequestCommon & {
    layout: 'cashlink';
    cashlinkMessage?: string;
};
export type SignTransactionRequest = SignTransactionRequestStandard | SignTransactionRequestCheckout | SignTransactionRequestCashlink;
export type SignStakingRequest = SignTransactionRequestCommon & {
    type: number;
    recipientLabel?: string;
    delegation?: string;
};
export type SignBtcTransactionRequestStandard = SimpleRequest & BitcoinTransactionInfo & {
    layout?: 'standard';
};
export type SignBtcTransactionRequestCheckout = SimpleRequest & BitcoinTransactionInfo & {
    layout: 'checkout';
    shopOrigin: string;
    shopLogoUrl?: string;
    time?: number;
    expires?: number;
    fiatCurrency?: string;
    fiatAmount?: number;
    vendorMarkup?: number;
};
export type SignBtcTransactionRequest = SignBtcTransactionRequestStandard | SignBtcTransactionRequestCheckout;
export type PolygonTransactionInfo = {
    keyPath: string;
    request: ForwardRequest;
    relayData: RelayData;
    /**
     * For refund and redeem transactions from HTLCs the amount is not part of the forward request / relay request and
     * needs to be specified separately.
     */
    amount?: number;
    /**
     * The sender's nonce in the token contract, required when calling the
     * contract function `transferWithApproval`.
     */
    approval?: {
        tokenNonce: number;
    };
};
export type SignPolygonTransactionRequest = Omit<SimpleRequest, 'keyLabel'> & PolygonTransactionInfo & {
    keyLabel: string;
    senderLabel?: string;
    recipientLabel?: string;
};
export type MockSettlementInstruction = {
    type: 'mock';
    contractId: string;
};
export type SepaSettlementInstruction = {
    type: 'sepa';
    contractId: string;
    recipient: {
        name: string;
        iban: string;
        bic: string;
    };
};
export type SettlementInstruction = MockSettlementInstruction | SepaSettlementInstruction;
export type SignSwapRequestLayout = 'standard' | 'slider';
export type KycProvider = 'TEN31 Pass';
export type SignSwapRequestCommon = SimpleRequest & {
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
        type: 'USDC';
    } & Omit<PolygonTransactionInfo, 'amount'>) | ({
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
        type: 'USDC';
    } & Omit<PolygonTransactionInfo, 'approval' | 'amount'> & {
        amount: number;
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
    kyc?: {
        provider: KycProvider;
        s3GrantToken: string;
        oasisGrantToken?: string;
    };
};
export type SignSwapRequestStandard = SignSwapRequestCommon & {
    layout: 'standard';
};
export type SignSwapRequestSlider = SignSwapRequestCommon & {
    layout: 'slider';
    direction: 'left-to-right' | 'right-to-left';
    nimiqAddresses: Array<{
        address: string;
        balance: number;
    }>;
    bitcoinAccount: {
        balance: number;
    };
    polygonAddresses: Array<{
        address: string;
        balance: number;
    }>;
};
export type SignSwapRequest = SignSwapRequestStandard | SignSwapRequestSlider;
export type SignSwapResult = SimpleResult & {
    eurPubKey?: string;
    tmpCookieEncryptionKey?: Uint8Array;
};
export type SignSwapTransactionsRequest = {
    swapId: string;
    fund: {
        type: 'NIM';
        htlcData: Uint8Array;
    } | {
        type: 'BTC';
        htlcScript: Uint8Array;
    } | {
        type: 'USDC';
        htlcData: string;
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
        type: 'USDC';
        hash: string;
        timeout: number;
        htlcId: string;
    } | {
        type: 'EUR';
        hash: string;
        timeout: number;
        htlcId: string;
    };
    tmpCookieEncryptionKey?: Uint8Array;
};
export type SignMessageRequest = SimpleRequest & {
    keyPath: string;
    message: Uint8Array | string;
    signer: Uint8Array;
    signerLabel: string;
};
export type DeriveBtcXPubRequest = SimpleRequest & {
    bitcoinXPubPath: string;
};
export type DeriveBtcXPubResult = {
    bitcoinXPub: string;
};
export type DerivePolygonAddressRequest = SimpleRequest & {
    polygonAccountPath: string;
};
export type DerivePolygonAddressResult = {
    polygonAddresses: Array<{
        address: string;
        keyPath: string;
    }>;
};
export type RedirectRequest = CreateRequest | DeriveAddressRequest | ExportRequest | ImportRequest | RemoveKeyRequest | SignMessageRequest | SignTransactionRequest | SignStakingRequest | SignBtcTransactionRequest | SignPolygonTransactionRequest | SimpleRequest | DeriveBtcXPubRequest | DerivePolygonAddressRequest | SignSwapRequest;
export type IFrameRequest = EmptyRequest | DeriveAddressesRequest | ReleaseKeyRequest | SignSwapTransactionsRequest;
export type Request = RedirectRequest | IFrameRequest;
export type KeyInfoObject = {
    id: string;
    type: Nimiq.Secret.Type;
    hasPin: boolean;
};
export type LegacyKeyInfoObject = KeyInfoObject & {
    legacyAccount: {
        label: string;
        address: Uint8Array;
    };
};
export type DerivedAddress = {
    address: Uint8Array;
    keyPath: string;
};
export type KeyResult = SingleKeyResult[];
export type ListResult = KeyInfoObject[];
export type ListLegacyResult = LegacyKeyInfoObject[];
export type SignTransactionResult = SignatureResult;
export type SignStakingResult = SignatureResult & {
    data: Uint8Array;
};
export type SimpleResult = {
    success: boolean;
};
export type SignedBitcoinTransaction = {
    transactionHash: string;
    raw: string;
};
export type SignedPolygonTransaction = {
    message: Record<string, any>;
    signature: string;
};
export type SignSwapTransactionsResult = {
    nim?: SignatureResult;
    btc?: SignedBitcoinTransaction;
    usdc?: SignedPolygonTransaction;
    eur?: string;
    refundTx?: string;
};
export type IFrameResult = DerivedAddress[] | ListLegacyResult | ListResult | SimpleResult | SignSwapTransactionsResult;
export type RedirectResult = DerivedAddress[] | ExportResult | KeyResult | SignTransactionResult | SignStakingResult | SignedBitcoinTransaction | SignedPolygonTransaction | SimpleResult | DeriveBtcXPubResult | DerivePolygonAddressResult | SignSwapResult;
export type Result = RedirectResult | IFrameResult;
export type ResultType<T extends RedirectRequest> = T extends Is<T, SignMessageRequest> | Is<T, SignTransactionRequest> ? SignatureResult : T extends Is<T, SignStakingRequest> ? SignStakingResult : T extends Is<T, DeriveAddressRequest> ? DerivedAddress[] : T extends Is<T, CreateRequest> | Is<T, ImportRequest> | Is<T, ResetPasswordRequest> ? KeyResult : T extends Is<T, ExportRequest> ? ExportResult : T extends Is<T, RemoveKeyRequest> | Is<T, SimpleRequest> ? SimpleResult : T extends Is<T, SignBtcTransactionRequest> ? SignedBitcoinTransaction : T extends Is<T, DeriveBtcXPubRequest> ? DeriveBtcXPubResult : T extends Is<T, DerivePolygonAddressRequest> ? DerivePolygonAddressResult : T extends Is<T, SignPolygonTransactionRequest> ? SignedPolygonTransaction : T extends Is<T, SignSwapRequest> ? SignSwapResult : never;
export type ResultByCommand<T extends KeyguardCommand> = T extends KeyguardCommand.SIGN_MESSAGE | KeyguardCommand.SIGN_TRANSACTION ? SignatureResult : T extends KeyguardCommand.SIGN_STAKING ? SignStakingResult : T extends KeyguardCommand.DERIVE_ADDRESS ? DerivedAddress[] : T extends KeyguardCommand.CREATE | KeyguardCommand.IMPORT ? KeyResult : T extends KeyguardCommand.EXPORT ? ExportResult : T extends KeyguardCommand.REMOVE ? SimpleResult : T extends KeyguardCommand.SIGN_BTC_TRANSACTION ? SignedBitcoinTransaction : T extends KeyguardCommand.DERIVE_BTC_XPUB ? DeriveBtcXPubResult : T extends KeyguardCommand.DERIVE_POLYGON_ADDRESS ? DerivePolygonAddressResult : T extends KeyguardCommand.SIGN_POLYGON_TRANSACTION ? SignedPolygonTransaction : T extends KeyguardCommand.SIGN_SWAP ? SignSwapResult : never;
export type KeyguardError = {
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
