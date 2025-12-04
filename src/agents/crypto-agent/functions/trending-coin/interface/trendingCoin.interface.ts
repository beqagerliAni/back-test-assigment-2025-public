export interface TrendingCoinResponseInterface {
    coins: {
        item: {
            id: string,
            market_cap_rank: number,
            price_btc: number
            data: {
                price: number,
                price_change_percentage_24h: {
                    gel:number,
                    eur:number,
                    usd:number
                }
            }
            market_cap: string
            market_cap_btc: string
            total_volume: string
            total_volume_btc: string
            content: {
                description: string
            } | null
        }
    }[]
}