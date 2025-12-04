import { cryptoApiClient } from "../../apiClient/crypto.api-client"
import { TrendingCoinResponseInterface } from "./interface/trendingCoin.interface"

export const TrendingCoinFunctionProcessor = async () => {
    try {
        
        // becouse coingGeeko dose not includes some filtering parametrs we should filter on our own so that got whont have to deal wiht large data
        const response = await cryptoApiClient.get<TrendingCoinResponseInterface>('search/trending')
        
        
        // it returns first top 10 coins it its not big of data i have  not more then 1000
        // in production i whould build pagination but i dont have time at the moment
        const trendingCoins = response.data.coins.slice(0, 10).map((coin) => ({
            coinName: coin.item.id,
            coinPrice: coin.item.price_btc,
            price: coin.item.data.price,
            priceInCurrency: [coin.item.data.price_change_percentage_24h.eur,coin.item.data.price_change_percentage_24h.gel,coin.item.data.price_change_percentage_24h.usd],
            market_cap: coin.item.market_cap,
            marketRank: coin.item.market_cap_rank,
            totalVolume: coin.item.total_volume,
            totalVolumeBtc: coin.item.total_volume_btc
        }))
        return JSON.stringify(trendingCoins)
    } catch (error) {
     console.log(error)
     return 'thea wos error when fetching data'   
    }
}