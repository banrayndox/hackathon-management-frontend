import React from 'react';
import { FaHardHat, FaWrench } from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';

const UnderDevelopment = ({ featureName = "This Feature", onBackClick }) => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center
     justify-center bg-white p-8 text-center backdrop-blur-sm dark:bg-slate-900">
      
      {/* Icon Animation Container */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
        <FaHardHat size={36} className="animate-bounce" />
        <FaWrench 
          size={20} 
          className="absolute -right-1 -top-1 animate-pulse text-amber-500" 
        />
      </div>

      {/* Content */}
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
        {featureName} is Under Development
      </h2>
      
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 mb-8">
        We are currently building this section to improve your experience. Grab a coffee and check back soon!
      </p>

      {/* Progress Bar Placeholder */}
      <div className="mb-8 w-full max-w-xs rounded-full bg-slate-200 h-2 dark:bg-slate-700 overflow-hidden">
        <div 
          className="bg-amber-500 h-2 rounded-full animate-pulse" 
          style={{ width: '65%' }}
        />
      </div>

      {/* Action Button */}
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <IoArrowBackOutline size={16} />
          Go Back
        </button>
      )}
    </div>
  );
};

export default UnderDevelopment;