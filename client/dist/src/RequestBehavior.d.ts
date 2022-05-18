import { KeyguardCommand } from './KeyguardCommand';
import { ObjectType } from './PublicRequest';
declare enum BehaviorType {
    REDIRECT = 0,
    IFRAME = 1
}
export declare class RequestBehavior {
    static getAllowedOrigin(endpoint: string): string;
    private readonly _type;
    constructor(type: BehaviorType);
    request(endpoint: string, command: KeyguardCommand, args: any[]): Promise<void>;
    readonly type: BehaviorType;
}
export declare class RedirectRequestBehavior extends RequestBehavior {
    static getRequestUrl(endpoint: string, command: KeyguardCommand): string;
    private readonly _returnUrl;
    private readonly _localState;
    private readonly _handleHistoryBack;
    constructor(returnUrl?: string, localState?: ObjectType | null, handleHistoryBack?: boolean);
    request(endpoint: string, command: KeyguardCommand, args: any[]): Promise<void>;
}
export declare class IFrameRequestBehavior extends RequestBehavior {
    private _iframe;
    private _client;
    protected readonly IFRAME_PATH_SUFFIX: string;
    constructor();
    request(endpoint: string, command: KeyguardCommand, args: any[]): Promise<any>;
    createIFrame(endpoint: string): Promise<HTMLIFrameElement>;
}
export declare class SwapIFrameRequestBehavior extends IFrameRequestBehavior {
    protected readonly IFRAME_PATH_SUFFIX: string;
}
export {};
