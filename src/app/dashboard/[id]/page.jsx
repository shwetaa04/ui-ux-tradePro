"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  Eye,
  PlusCircle,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  BarChart2,
  Zap,
  Globe,
} from "lucide-react";
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { useCurrency } from "../../context/CurrencyContext";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  return (
    <motion.header
      {...fadeInUp}
      className="flex justify-between items-center p-4 bg-gray-900 text-white sticky top-0 z-10"
    >
      <div className="flex items-center space-x-8">
        <motion.span
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          TradePro
        </motion.span>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <a
                href="/dashboard"
                className="text-blue-500 font-semibold flex items-center"
              >
                <Zap className="mr-1" size={16} />
                Explore
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
              >
                <BarChart2 className="mr-1" size={16} />
                Investments
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="What are you looking for today?"
            className="pl-10 pr-4 py-2 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Bell className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <ShoppingCart className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <User className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
        <motion.div
          className="md:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-full w-64 bg-gray-800 p-4 z-50"
          >
            <motion.button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X />
            </motion.button>
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-blue-500 font-semibold flex items-center"
                  >
                    <Zap className="mr-2" size={16} />
                    Explore
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-500 transition-colors flex items-center"
                  >
                    <BarChart2 className="mr-2" size={16} />
                    Investments
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const Breadcrumb = ({ stock }) => (
  <motion.div
    {...fadeInUp}
    className="flex items-center space-x-2 text-sm text-gray-400 my-4"
  >
    <a href="/" className="hover:text-blue-500">
      Home
    </a>
    <span>/</span>
    <a href="/dashboard" className="hover:text-blue-500">
      Stocks
    </a>
    <span>/</span>
    <span className="text-blue-500">{stock}</span>
  </motion.div>
);

const CURRENCY_RATES = {
  INR: 1,
  USD: 0.012,  // 1 INR = 0.012 USD
  EUR: 0.011,  // 1 INR = 0.011 EUR
  GBP: 0.0095, // 1 INR = 0.0095 GBP
};

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const CurrencySelector = ({ selectedCurrency, onCurrencyChange }) => {
  return (
    <motion.div className="relative inline-block">
      <div className="flex items-center space-x-2">
        <Globe size={16} className="text-gray-400" />
        <select
          value={selectedCurrency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-gray-700 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(CURRENCY_RATES).map((currency) => (
            <option key={currency} value={currency}>
              {currency} ({CURRENCY_SYMBOLS[currency]})
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

const formatCurrency = (value, currency) => {
  const convertedValue = value * CURRENCY_RATES[currency];
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(convertedValue);
};

const generateRandomData = (currentValue, points) => {
  const data = [["Time", "Low", "Open", "Close", "High"]];

  for (let i = 0; i < points; i++) {
    const time = new Date(Date.now() - i * 5000).toLocaleTimeString();
    const open = currentValue + Math.random() * 10 - 5;
    const close = open + Math.random() * 10 - 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const high = Math.max(open, close) + Math.random() * 5;
    data.push([time, low, open, close, high]);
  }

  return data;
};

const StockChart = ({ stock }) => {
  const [timeRange, setTimeRange] = useState("5M");
  const [data, setData] = useState([["Time", "Low", "Open", "Close", "High"]]);
  const [currentValue, setCurrentValue] = useState(425371);
  const [change, setChange] = useState({ value: 0, percentage: 0 });
  const { selectedCurrency } = useCurrency();
  // const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    // Initialize with some data
    const initialData = generateRandomData(currentValue, getDataPoints(timeRange));
    setData(initialData);
    
    // Set up interval for updates
    const interval = setInterval(() => {
      const newData = generateRandomData(currentValue, getDataPoints(timeRange));
      setData(newData);
      setCurrentValue(newData[newData.length - 1][3]);
      
      const initialValue = newData[1][2];
      const changeValue = currentValue - initialValue;
      const changePercentage = (changeValue / initialValue) * 100;
      setChange({ value: changeValue, percentage: changePercentage });
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const getDataPoints = (range) => {
    switch (range) {
      case "5M":
        return 5;
      case "10M":
        return 10;
      case "15M":
        return 15;
      case "30M":
        return 30;
      case "1H":
        return 60;
      default:
        return 5;
    }
  };

  const convertDataToCurrency = (data) => {
    if (data.length <= 1) return data;
    return data.map((row, index) => {
      if (index === 0) return row;
      return [
        row[0],
        row[1] * CURRENCY_RATES[selectedCurrency],
        row[2] * CURRENCY_RATES[selectedCurrency],
        row[3] * CURRENCY_RATES[selectedCurrency],
        row[4] * CURRENCY_RATES[selectedCurrency],
      ];
    });
  };

  const options = {
    backgroundColor: "transparent",
    chartArea: { width: "90%", height: "80%" },
    hAxis: {
      textStyle: { color: "#9CA3AF" },
      baselineColor: "#4B5563",
      gridlines: { color: "transparent" },
      format: "HH:mm",
    },
    vAxis: {
      textStyle: { color: "#9CA3AF" },
      baselineColor: "#4B5563",
      gridlines: { color: "#4B5563" },
      format: `${CURRENCY_SYMBOLS[selectedCurrency]}#,###.##`,
    },
    legend: { position: "none" },
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: "#EF4444" },
      risingColor: { strokeWidth: 0, fill: "#10B981" },
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: "out",
    },
  };

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-6 rounded-lg shadow-lg my-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h2 className="text-2xl font-bold text-white">{stock}</h2>
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              // onCurrencyChange={(newCurrency) => {
              //   // Implement currency change logic
              // }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">
              {formatCurrency(currentValue, selectedCurrency)}
            </span>
            <motion.span
              className={`flex items-center ${
                change.value >= 0 ? "text-green-500" : "text-red-500"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={change.value}
            >
              {change.value >= 0 ? (
                <ArrowUpRight size={20} className="mr-1" />
              ) : (
                <ArrowDownRight size={20} className="mr-1" />
              )}
              {change.value > 0 ? "+" : ""}
              {formatCurrency(change.value, selectedCurrency)} ({change.percentage.toFixed(2)}%)
            </motion.span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <motion.button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="inline-block mr-2" size={16} />
            Create Alert
          </motion.button>
          <motion.button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="inline-block mr-2" size={16} />
            Watchlist
          </motion.button>
        </div>
      </div>
      
      {data.length > 1 && (
        <Chart
          chartType="CandlestickChart"
          width="100%"
          height="400px"
          data={convertDataToCurrency(data)}
          options={options}
          chartPackages={["corechart"]}
        />
      )}
      
      <div className="flex justify-between mt-4 overflow-x-auto">
        {["5M", "10M", "15M", "30M", "1H"].map((range) => (
          <motion.button
            key={range}
            className={`text-sm ${
              timeRange === range ? "text-blue-500" : "text-gray-300"
            } hover:text-blue-500 transition-colors flex items-center`}
            onClick={() => setTimeRange(range)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Clock size={14} className="mr-1" />
            {range}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const OptionsTable = ({ stock }) => {
  const [options, setOptions] = useState([
    {
      strike: 25400,
      callPrice: 115.15,
      callChange: 17.0,
      putPrice: 97.55,
      putChange: -15.55,
    },
    {
      strike: 25300,
      callPrice: 95.4,
      callChange: -10.9,
      putPrice: 96.65,
      putChange: 28.85,
    },
    {
      strike: 25200,
      callPrice: 78.5,
      callChange: 32.78,
      putPrice: 73.65,
      putChange: -12.25,
    },
    {
      strike: 25100,
      callPrice: 29.7,
      callChange: -10.14,
      putPrice: 28.3,
      putChange: 20.74,
    },
  ]);
  const { selectedCurrency } = useCurrency();

  useEffect(() => {
    const interval = setInterval(() => {
      setOptions((prevOptions) =>
        prevOptions.map((option) => ({
          ...option,
          callPrice: option.callPrice + (Math.random() - 0.5) * 5,
          callChange: (Math.random() - 0.5) * 10,
          putPrice: option.putPrice + (Math.random() - 0.5) * 5,
          putChange: (Math.random() - 0.5) * 10,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div {...fadeInUp} className="bg-gray-800 p-6 rounded-lg shadow-lg my-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <DollarSign size={24} className="mr-2" />
          Top {stock} Options
        </h3>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="py-2">Strike</th>
            <th className="py-2">Call</th>
            <th className="py-2">Put</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index) => (
            <motion.tr
              key={index}
              className="border-b border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="py-2 text-white">
                {formatCurrency(option.strike, selectedCurrency)}
              </td>
              <td className="py-2">
                <div className="text-white">
                  {formatCurrency(option.callPrice, selectedCurrency)}
                </div>
                <motion.div
                  className={option.callChange >= 0 ? "text-green-500" : "text-red-500"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={option.callChange}
                >
                  {option.callChange > 0 ? (
                    <ArrowUpRight size={14} className="inline mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="inline mr-1" />
                  )}
                  {option.callChange.toFixed(2)}%
                </motion.div>
              </td>
              <td className="py-2">
                <div className="text-white">
                  {formatCurrency(option.putPrice, selectedCurrency)}
                </div>
                <motion.div
                  className={option.putChange >= 0 ? "text-green-500" : "text-red-500"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={option.putChange}
                >
                  {option.putChange > 0 ? (
                    <ArrowUpRight size={14} className="inline mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="inline mr-1" />
                  )}
                  {option.putChange.toFixed(2)}%
                </motion.div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

const OpenInterest = () => {
  const [oiData, setOiData] = useState({
    totalPutOI: 3513795,
    putCallRatio: 0.99,
    totalCallOI: 3555969,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOiData((prevData) => ({
        totalPutOI:
          prevData.totalPutOI + Math.floor((Math.random() - 0.5) * 10000),
        putCallRatio: prevData.putCallRatio + (Math.random() - 0.5) * 0.02,
        totalCallOI:
          prevData.totalCallOI + Math.floor((Math.random() - 0.5) * 10000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      {...fadeInUp}
      className="bg-gray-800 p-6 rounded-lg shadow-lg py-6"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <BarChart2 size={24} className="mr-2" />
        Open Interest (OI)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-gray-400">Total Put OI</div>
          <div className="text-white text-xl">
            {oiData.totalPutOI.toLocaleString()}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-gray-400">Put/Call ratio</div>
          <div className="text-white text-xl">
            {oiData.putCallRatio.toFixed(2)}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-gray-400">Total Call OI</div>
          <div className="text-white text-xl">
            {oiData.totalCallOI.toLocaleString()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function GrowwNIFTY50Page({ params }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <motion.div
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="h-40 w-40 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Loading...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <Header />
      <main className="container mx-auto px-4">
        <Breadcrumb stock={params.id} />
        <StockChart stock={params.id} />
        <OptionsTable stock={params.id} />
        <OpenInterest />
      </main>
    </div>
  );
}
