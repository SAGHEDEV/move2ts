export interface NFTWrapper<T> {
  id: string
  nft: any
}

export interface Auction<T> {
  id: string
  creator: string
  title: string
  description: string
  starting_bid: number
  current_bid: number
  highest_bidder: string
  start_time: number
  end_time: number
  status: any
  bid_count: number
  nft: NFTWrapper<any>
  bid_history: BidEntry[]
  bidder_info: Record<string, any>
  unique_bidders: number
  stored_bids: Record<string, any>
  highest_bid_balance: string
  nft_id: string
  nft_type: string
  nft_name: string
  nft_description: string
  nft_image_url: string
}

export interface BidEntry {
  bidder: string
  amount: number
  timestamp: number
}

export interface BidderInfo {
  total_bid_amount: number
  bid_count: number
  highest_bid: number
  latest_bid_time: number
}

export interface AuctionHistory {
  id: string
  original_auction_id: string
  creator: string
  title: string
  description: string
  starting_bid: number
  final_bid: number
  winner: string
  start_time: number
  end_time: number
  completion_time: number
  total_bids: number
  nft_id: string
  nft_type: string
  nft_name: string
  nft_description: string
  nft_image_url: string
  bid_history: BidEntry[]
  bidder_info: Record<string, any>
  unique_bidders: number
}

export interface AuctionRegistry {
  id: string
  auctions: any
  auction_histories: any
  auction_count: number
  completed_auction_count: number
  fee_balance: string
  treasury_address: string
}

export interface AuctionCreated {
  auction_id: string
  creator: string
  title: string
  starting_bid: number
  end_time: number
  nft_type: string
}

export interface BidPlaced {
  auction_id: string
  bidder: string
  bid_amount: number
  timestamp: number
}

export interface AuctionEnded {
  auction_id: string
  winner: string
  winning_bid: number
  total_bids: number
}

export interface AuctionClaimed {
  auction_id: string
  winner: string
  final_amount: number
  fee_collected: number
}

export interface CreatorClaimedProceeds {
  auction_id: string
  creator: string
  amount_claimed: number
  fee_collected: number
  grace_period_expired: boolean
}

export interface BidderLeaderboard {
  auction_id: string
  bidder: string
  total_bid_amount: number
  bid_count: number
  highest_bid: number
  latest_bid_time: number
}