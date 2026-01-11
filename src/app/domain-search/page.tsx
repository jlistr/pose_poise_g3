
'use client';

import React, { useState } from 'react';

const DomainSearchPage = () => {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // This is a mock API call. Replace with a real domain availability API.
      // You will likely need to sign up for a service and get an API key.
      const response = await fetch(`https://api.example.com/check-domain?domain=${domain}`);
      if (!response.ok) {
        throw new Error('Failed to fetch domain availability.');
      }
      const data = await response.json();
      
      // Mocking the response for demonstration as the API is fake
      const mockData = [
        { domain: `${domain}.com`, available: Math.random() > 0.5 },
        { domain: `${domain}.net`, available: Math.random() > 0.5 },
        { domain: `${domain}.org`, available: Math.random() > 0.5 },
        { domain: `${domain}.io`, available: Math.random() > 0.5 },
        { domain: `${domain}.ai`, available: Math.random() > 0.5 },
      ];

      setResults(mockData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDomain = (selectedDomain: string) => {
    console.log(`Selected domain: ${selectedDomain}`);
    // Here you would typically handle the selection, e.g.,
    // saving it to user's profile, proceeding to checkout, etc.
    alert(`You selected ${selectedDomain}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Search for a Custom Domain</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Search for a domain..."
          className="border border-gray-300 rounded-l px-4 py-2 w-full dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-r px-4 py-2 disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div>
        {results.length > 0 && (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {results.map((result) => (
              <li key={result.domain} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{result.domain}</p>
                  <p className={result.available ? 'text-green-500' : 'text-red-500'}>
                    {result.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
                {result.available && (
                  <button
                    onClick={() => handleSelectDomain(result.domain)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold rounded px-4 py-2"
                  >
                    Select
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DomainSearchPage;
