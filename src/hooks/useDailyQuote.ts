import {useEffect, useState} from 'react';
import {DailyQuotes} from '../types';
import {getDailyQuote} from '../utils/getDailyQuote';

export const useDailyQuote = () => {
  const [quote, setQuote] = useState<DailyQuotes | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const dailyQuote = await getDailyQuote();
        setQuote(dailyQuote);
      } catch (error) {
        console.log('Failed to fetch quote:', error);
      }
    };

    fetchQuote();
  }, []);

  return {quote};
};
