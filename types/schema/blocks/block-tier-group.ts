import type { BlockTier } from './block-tier';

export interface BlockTierGroup {
	id: string;
	tiers: number[] | BlockTierGroupBlockTier[];
}

export interface BlockTierGroupBlockTier {
	id: number;
	block_tier_group_id: string | BlockTierGroup;
	block_tier_id: string | BlockTier;
}
