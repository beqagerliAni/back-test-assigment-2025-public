export interface CoinResponseInterface {
  [key: string]:
    | { [key: string]: number }
    | {
        current_price: {
          [key: string]: number;
        };
      };
  market_data: {
    current_price: {
      [key: string]: number;
    };
  };
}
