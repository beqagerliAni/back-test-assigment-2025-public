export interface CryptoChartPoint {
  time: string; 
  price: number;
  marketCap: number;
  volume: number;
}
export interface CoinGeckoMarketChartResponse {
  prices: [number, number][];       
  market_caps: [number, number][];   
  total_volumes: [number, number][]; 
}