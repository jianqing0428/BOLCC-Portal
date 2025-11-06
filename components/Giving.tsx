
import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { LockIcon } from './icons/Icons';

const Giving: React.FC = () => {
  const { t } = useLocalization();
  const [donationType, setDonationType] = useState<'one-time' | 'recurring'>('one-time');
  const [amount, setAmount] = useState('50');
  const presetAmounts = [50, 100, 200, 500];

  const handleAmountClick = (presetAmount: number) => {
    setAmount(String(presetAmount));
  };

  return (
    <section id="giving" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{t('giving.title')}</h2>
          <p className="text-lg text-gray-600 mb-10">{t('giving.subtitle')}</p>
        </div>
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-2 gap-2 bg-gray-200 p-1 rounded-full mb-6">
            <button
              onClick={() => setDonationType('one-time')}
              className={`w-full py-2 rounded-full font-semibold transition-colors ${donationType === 'one-time' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-300'}`}
            >
              {t('giving.oneTime')}
            </button>
            <button
              onClick={() => setDonationType('recurring')}
              className={`w-full py-2 rounded-full font-semibold transition-colors ${donationType === 'recurring' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-300'}`}
            >
              {t('giving.recurring')}
            </button>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">{t('giving.amount')}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleAmountClick(preset)}
                  className={`py-3 px-4 border rounded-lg font-semibold transition-all ${String(preset) === amount ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xl">$</span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Other Amount"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-lg hover:bg-blue-700 transition-all mt-8">
            {t('giving.giveNow')}
          </button>
          
          <p className="text-xs text-gray-500 mt-6 text-center">
            <LockIcon />
            {t('giving.securityNote')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Giving;
