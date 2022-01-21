import { Address, BigNumberString, BlockchainID, ContractAddress, FundraiseID, GameID, GuildID, GuildTemplateID, MemberID, SocialSet, TokenTemplateID, urlFile, urlImage, urlVideo } from './baseTypes';
export interface Guild {
    id: GuildID;
    name: string;
    isActive: boolean;
    isFundraising: boolean;
    socials: SocialSet[];
    emblems: GuildEmblems;
    stats: GuildStats;
    kyc?: GuildKYC;
}
export interface GuildKYC {
    guildID: GuildID;
    approvalStatus: GuildStatus;
    ownerAddress: Address;
    vips: TeammateFactoid[];
}
export declare type GuildStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'RETIRED';
export interface GuildEmblems {
    guildID: GuildID;
    squareImage?: urlImage;
    bannerImage?: urlImage;
    primaryColor?: string;
    secondaryColor?: string;
    logo: urlImage;
    thumbnail?: urlImage;
}
export interface GuildStats {
    guildID: GuildID;
    marketCap?: BigNumberString;
    totalSupply?: BigNumberString;
    circulatingSupply?: BigNumberString;
    totalRaised?: BigNumberString;
}
export interface Fundraise {
    id: FundraiseID;
    guildID: GuildID;
    title: string;
    bio: string;
    createdAt: Date;
    isActive: boolean;
    openDate: Date;
    closeDate: Date;
    media: FundraiseMedia;
    financials: FundraiseFinancials;
    games: GameFactoid[];
    team: TeammateFactoid[];
}
export interface FundraiseMedia {
    fundraiseID: FundraiseID;
    guildID: GuildID;
    mainPromoVideo?: urlVideo;
    bannerImage?: urlImage;
    squareImage?: urlImage;
    thumbnail?: urlImage;
    supplementaryImages?: urlImage[];
    supplementaryVideos?: urlVideo[];
}
export interface FundraiseFinancials {
    fundraiseID: FundraiseID;
    guildID: GuildID;
    guildTemplateID: GuildTemplateID;
    financialStatementsUrl?: urlFile;
    gameplanUrl?: urlFile;
    fundraiseTokenPairs: FundraiseTokenPair[];
    targetFundingAmountUSD: BigNumberString;
}
export interface FundraiseTokenPair {
    acceptedPayments: ContractAddress[];
    soldToken: ContractAddress;
    tokenTemplateID: TokenTemplateID;
    blockchainID: BlockchainID;
    maxCrowdsaleAmountUSD: BigNumberString;
    maxSoldTokenAmount: BigNumberString;
    targetCrowdsaleAmountUSD: BigNumberString;
    targetSoldTokenAmount: BigNumberString;
}
export interface GameFactoid {
    fundraiseID: FundraiseID;
    gameID: GameID;
    guildID: GuildID;
    title: string;
    subtitle: string;
    description: string;
    image: urlImage;
    video?: urlVideo;
}
export interface TeammateFactoid {
    fundraiseID: FundraiseID;
    guildID: GuildID;
    memberID: MemberID;
    oneLiner: string;
    image: urlImage;
    socials: SocialSet[];
}
