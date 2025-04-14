"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCw, TrendingUp, TrendingDown, Bot } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface Trade {
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  timestamp: Date;
  profit?: number;
}

interface BotState {
  isActive: boolean;
  balance: number;
  holdings: number;
  trades: Trade[];
  totalProfits: number;
  lastPrice: number;
}

const INITIAL_BALANCE = 100000; // Initial balance in INR
const TRADE_QUANTITY = 10; // Number of shares per trade
const INITIAL_PRICE = 18000;

const formatCurrency = (value: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export default function TradingBot() {
  const { selectedCurrency } = useCurrency();
  const [botState, setBotState] = useState<BotState>({
    isActive: false,
    balance: INITIAL_BALANCE,
    holdings: 0,
    trades: [],
    totalProfits: 0,
    lastPrice: INITIAL_PRICE,
  });

  const [currentPrice, setCurrentPrice] = useState<number>(INITIAL_PRICE);
  // const [movingAverage, setMovingAverage] = useState<number>(INITIAL_PRICE);
  // const [priceHistory, setPriceHistory] = useState<number[]>([INITIAL_PRICE]);

  // Adjusted Trading Strategy Parameters
  // const MA_PERIOD = 3; // Shorter period for more frequent signals
  const BUY_THRESHOLD = 0.005; // 0.5% below moving average
  const SELL_THRESHOLD = 0.005; // 0.5% above moving average

  const generateNewPrice = useCallback(() => {
    const volatility = 0.008; // 0.8% volatility per update
    const randomFactor = Math.random() * 2 - 1; // Random number between -1 and 1
    const trend = Math.sin(Date.now() / 10000) * 0.002; // Add a slight trend component
    const change = currentPrice * (1 + (randomFactor * volatility + trend));
    return Math.max(change, 100);
  }, [currentPrice]);

  const calculateMA = useCallback((prices: number[]): number => {
    if (prices.length === 0) return INITIAL_PRICE;
    // Using exponential moving average for more responsiveness
    const alpha = 2 / (prices.length + 1);
    let ema = prices[0];
    for (let i = 1; i < prices.length; i++) {
      ema = prices[i] * alpha + ema * (1 - alpha);
    }
    return ema;
  }, []);

  const executeTradingStrategy = useCallback((price: number, ma: number) => {
    if (!botState.isActive) return;

    const priceVsMA = price / ma - 1;
    const shouldBuy = priceVsMA < -BUY_THRESHOLD && botState.balance >= price * TRADE_QUANTITY;
    const shouldSell = priceVsMA > SELL_THRESHOLD && botState.holdings >= TRADE_QUANTITY;

    if (shouldBuy) {
      const cost = price * TRADE_QUANTITY;
      const newTrade: Trade = {
        type: 'BUY',
        price,
        quantity: TRADE_QUANTITY,
        timestamp: new Date(),
      };

      setBotState(prev => ({
        ...prev,
        balance: prev.balance - cost,
        holdings: prev.holdings + TRADE_QUANTITY,
        trades: [newTrade, ...prev.trades].slice(0, 50),
        lastPrice: price,
      }));
    } else if (shouldSell) {
      const revenue = price * TRADE_QUANTITY;
      const profit = revenue - (botState.lastPrice * TRADE_QUANTITY);
      
      const newTrade: Trade = {
        type: 'SELL',
        price,
        quantity: TRADE_QUANTITY,
        timestamp: new Date(),
        profit,
      };

      setBotState(prev => ({
        ...prev,
        balance: prev.balance + revenue,
        holdings: prev.holdings - TRADE_QUANTITY,
        trades: [newTrade, ...prev.trades].slice(0, 50),
        totalProfits: prev.totalProfits + profit,
        lastPrice: price,
      }));
    }
  }, [botState.isActive, botState.balance, botState.holdings, botState.lastPrice]);

  // Main simulation loop
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (botState.isActive) {
      // Execute immediately when starting
      const newPrice = generateNewPrice();
      setCurrentPrice(newPrice);
      // setPriceHistory(prev => {
      //   const newHistory = [...prev, newPrice].slice(-MA_PERIOD);
      //   const newMA = calculateMA(newHistory);
      //   // setMovingAverage(newMA);
      //   executeTradingStrategy(newPrice, newMA);
      //   return newHistory;
      // });

      // Then set up the interval
      intervalId = setInterval(() => {
        const newPrice = generateNewPrice();
        setCurrentPrice(newPrice);
        
        // setPriceHistory(prev => {
        //   const newHistory = [...prev, newPrice].slice(-MA_PERIOD);
        //   const newMA = calculateMA(newHistory);
        //   // setMovingAverage(newMA);
        //   executeTradingStrategy(newPrice, newMA);
        //   return newHistory;
        // });
      }, 500); // Update twice per second for more active trading
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [botState.isActive, generateNewPrice, calculateMA, executeTradingStrategy]);

  const toggleBot = () => {
    setBotState(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetBot = () => {
    setCurrentPrice(INITIAL_PRICE);
    // setMovingAverage(INITIAL_PRICE);
    // setPriceHistory([INITIAL_PRICE]);
    // setBotState({
    //   isActive: false,
    //   balance: INITIAL_BALANCE,
    //   holdings: 0,
    //   trades: [],
    //   totalProfits: 0,
    //   lastPrice: INITIAL_PRICE,
    // });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg my-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Bot className="text-blue-500" size={24} />
          <h2 className="text-xl font-bold text-white">Trading Bot Simulation</h2>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleBot}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              botState.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {botState.isActive ? (
              <>
                <Pause size={16} />
                <span>Stop Bot</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Start Bot</span>
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetBot}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Reset</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-400 mb-1">Current Price</div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(currentPrice, selectedCurrency)}
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-400 mb-1">Bot Balance</div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(botState.balance, selectedCurrency)}
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="text-gray-400 mb-1">Total Profits/Losses</div>
          <div className={`text-2xl font-bold ${botState.totalProfits >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(botState.totalProfits, selectedCurrency)}
          </div>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
        <div className="space-y-4">
          {botState.trades.slice(0, 5).map((trade, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between border-b border-gray-600 pb-2"
            >
              <div className="flex items-center space-x-4">
                {trade.type === 'BUY' ? (
                  <TrendingUp className="text-green-500" size={20} />
                ) : (
                  <TrendingDown className="text-red-500" size={20} />
                )}
                <div>
                  <div className="text-white">{trade.type}</div>
                  <div className="text-sm text-gray-400">
                    {trade.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-white">
                  {formatCurrency(trade.price * trade.quantity, selectedCurrency)}
                </div>
                {trade.type === 'SELL' && (
                  <div className={`text-sm ${trade.profit && trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trade.profit && formatCurrency(trade.profit, selectedCurrency)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 