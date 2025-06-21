
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  change: string;
  changeText: string;
  isPositive: boolean;
}

const StatsCard = ({ title, value, icon, iconBg, iconColor, change, changeText, isPositive }: StatsCardProps) => {
  return (
    <div className="bg-white rounded shadow p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${title === 'Sistemas em Risco Alto' ? 'text-red-500' : 'text-gray-800'}`}>
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {change && (
          <span className={`text-sm flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <i className="ri-arrow-up-s-line"></i> : <i className="ri-information-line"></i>}
            {change}
          </span>
        )}
        {!change && title === 'Sistemas em Risco Alto' && (
          <span className="text-red-500 text-sm flex items-center">
            <i className="ri-information-line"></i>
          </span>
        )}
        <span className="text-gray-400 text-sm ml-2">{changeText}</span>
      </div>
    </div>
  );
};

export default StatsCard;
