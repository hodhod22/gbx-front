'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GBXCard from '@/components/gbx/GBXCard';
import MetalsCard from '@/components/gbx/MetalsCard';
import CurrencyTable from '@/components/gbx/CurrencyTable';
import CrisisIndicator from '@/components/gbx/CrisisIndicator';

export default function GbxPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/gbx/prices`,
      );
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setData(json);
      setError('');
    } catch (err) {
      setError(t('gbx.fetch_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
     (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  } 

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400 text-center p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-yellow-400">
          {t('gbx.title')}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          {t('gbx.subtitle')}
        </p>

        {data?.crisis && <CrisisIndicator crisis={data.crisis} />}
        {data?.gbx && data?.crisis && <GBXCard gbx={data.gbx} crisis={data.crisis} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {data?.metals && <MetalsCard metals={data.metals} />}
          <div className="lg:col-span-2">
            {data?.currencies && <CurrencyTable currencies={data.currencies} />}
          </div>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          {t('gbx.last_updated')}: {data?.updated_at ? new Date(data.updated_at).toLocaleString() : ''}
        </div>
      </div>
    </div>
  );
}