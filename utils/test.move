public struct NFTWrapper<T: key + store> has key, store {
    id: UID,
    nft: T,
}

// Individual auction struct
public struct Auction<T: key + store> has key, store {
    id: UID,
    creator: address,
    title: String,
    description: String,
    starting_bid: u64,
    current_bid: u64,
    highest_bidder: address,
    start_time: u64,
    end_time: u64,
    status: AuctionStatus,
    bid_count: u64,
    // NFT being auctioned (wrapped)
    nft: NFTWrapper<T>,
    // Bid tracking
    bid_history: vector<BidEntry>,
    bidder_info: VecMap<address, BidderInfo>,
    unique_bidders: u64,
    // Bid storage for refunds
    stored_bids: VecMap<address, Balance<SUI>>,
    // Current highest bid balance
    highest_bid_balance: Balance<SUI>,
    // Store NFT metadata for later use in auction history
    nft_id: object::ID,
    nft_type: String,
    nft_name: String,
    nft_description: String,
    nft_image_url: String,
}

// Bid history entry
public struct BidEntry has store, drop, copy {
    bidder: address,
    amount: u64,
    timestamp: u64,
}

// Bidder info for leaderboard
public struct BidderInfo has store, drop, copy {
    total_bid_amount: u64,
    bid_count: u64,
    highest_bid: u64,
    latest_bid_time: u64,
}

// Auction history for completed auctions (preserves data without NFT)
public struct AuctionHistory has key, store {
    id: UID,
    original_auction_id: object::ID,
    creator: address,
    title: String,
    description: String,
    starting_bid: u64,
    final_bid: u64,
    winner: address,
    start_time: u64,
    end_time: u64,
    completion_time: u64,
    total_bids: u64,
    // NFT metadata for easier frontend querying
    nft_id: object::ID,
    nft_type: String,
    nft_name: String,
    nft_description: String,
    nft_image_url: String,
    // Bid tracking (preserved for history)
    bid_history: vector<BidEntry>,
    bidder_info: VecMap<address, BidderInfo>,
    unique_bidders: u64,
}

// Auction registry to track all auctions
public struct AuctionRegistry has key {
    id: UID,
    auctions: Table<object::ID, bool>, // auction_id -> is_active
    auction_histories: Table<object::ID, object::ID>, // original_auction_id -> history_object_id
    auction_count: u64,
    completed_auction_count: u64,
    // Fee collection
    fee_balance: Balance<SUI>,
    treasury_address: address,
}

// Events
public struct AuctionCreated has copy, drop {
    auction_id: object::ID,
    creator: address,
    title: String,
    starting_bid: u64,
    end_time: u64,
    nft_type: String,
}

public struct BidPlaced has copy, drop {
    auction_id: object::ID,
    bidder: address,
    bid_amount: u64,
    timestamp: u64,
}

public struct AuctionEnded has copy, drop {
    auction_id: object::ID,
    winner: address,
    winning_bid: u64,
    total_bids: u64,
}

public struct AuctionClaimed has copy, drop {
    auction_id: object::ID,
    winner: address,
    final_amount: u64,
    fee_collected: u64,
}

public struct CreatorClaimedProceeds has copy, drop {
    auction_id: object::ID,
    creator: address,
    amount_claimed: u64,
    fee_collected: u64,
    grace_period_expired: bool,
}

public struct BidderLeaderboard has copy, drop {
    auction_id: object::ID,
    bidder: address,
    total_bid_amount: u64,
    bid_count: u64,
    highest_bid: u64,
    latest_bid_time: u64,
}