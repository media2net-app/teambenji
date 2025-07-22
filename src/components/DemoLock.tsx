import React from 'react';

const DemoLock: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1F1F1F] border border-[#E33412] rounded-lg p-8 max-w-md w-full text-center shadow-2xl">
        <div className="mb-6">
          <div className="w-16 h-16 bg-[#E33412] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Demo Weergave Offline
          </h2>
          <p className="text-gray-300 mb-6">
            Deze demo is tijdelijk vergrendeld. Plan een call om de applicatie te bespreken met Chiel.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="mailto:chiel@media2net.nl?subject=Demo Call Team Benji App&body=Hallo Chiel,%0D%0A%0D%0AIk ben geïnteresseerd in de Team Benji applicatie en zou graag een call willen plannen om deze te bespreken.%0D%0A%0D%0AMet vriendelijke groet"
            className="block w-full bg-[#E33412] text-white py-3 px-6 rounded-md hover:bg-[#b9260e] transition-all duration-200 font-semibold"
          >
            📧 Email Chiel
          </a>
          
          <div className="text-xs text-gray-400 mt-4">
            <p>Of neem contact op via:</p>
            <p className="text-[#E33412] font-semibold">chiel@media2net.nl</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLock; 