export declare type MemberID = string & {
    readonly _: unique symbol;
};
export declare type GuildID = string & {
    readonly _: unique symbol;
};
export declare type GameID = string & {
    readonly _: unique symbol;
};
export declare type FundraiseID = string & {
    readonly _: unique symbol;
};
export declare type WalletAddress = string & {
    readonly _: unique symbol;
};
export declare type ContractAddress = string & {
    readonly _: unique symbol;
};
export declare type Address = WalletAddress | ContractAddress;
export declare type BlockchainID = string & {
    readonly _: unique symbol;
};
export declare type TokenTemplateID = string & {
    readonly _: unique symbol;
};
export declare type GuildTemplateID = string & {
    readonly _: unique symbol;
};
export declare type urlImage = string;
export declare type urlVideo = string;
export declare type urlFile = string;
export declare type BigNumberString = string;
export interface SocialSet {
    socialNetwork: SocialNetwork;
    alias: string;
}
export declare type SocialNetwork = 'TWITTER' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE' | 'EMAIL' | 'TWITCH' | 'DISCORD' | 'YOUTUBE' | 'HEARTBEAT' | 'TELEGRAM';
