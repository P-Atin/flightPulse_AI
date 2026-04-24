'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, Calendar, DollarSign, Percent } from 'lucide-react';
import api from '@/lib/api';

interface PriceChartProps {
  origin: string;
  destination: string;
}

export default function PriceChart({ origin, destination }: PriceChartProps) {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getPrediction = async () => {
    setLoading(true);
    try {
      const response = await api.post('/predictions/predict', { origin, destination });
      setPrediction(response.data);
    } catch (error) {
      console.error('Erreur prédiction:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = prediction
    ? [...prediction.priceHistory, ...prediction.predictions]
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-white font-bold text-lg">{payload[0].value}€</p>
          <p className={`text-xs ${data.type === 'prediction' ? 'text-yellow-400' : 'text-green-400'}`}>
            {data.type === 'prediction' ? '🔮 Prédiction' : '📊 Historique'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">📈 Prédiction des prix</h3>
        <button
          onClick={getPrediction}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
        >
          {loading ? 'Analyse...' : 'Analyser les prix'}
        </button>
      </div>

      {prediction && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <DollarSign className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-gray-400 text-sm">Prix le plus bas</p>
              <p className="text-2xl font-bold text-green-400">{prediction.predictedLowest}€</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <TrendingDown className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-gray-400 text-sm">Économie potentielle</p>
              <p className="text-2xl font-bold text-purple-400">{prediction.potentialSaving}€</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <Calendar className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-gray-400 text-sm">Meilleur jour</p>
              <p className="text-lg font-bold text-blue-400">{prediction.bestDayToBook}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <Percent className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-gray-400 text-sm">Confiance</p>
              <p className="text-2xl font-bold text-yellow-400">{prediction.confidence}%</p>
            </div>
          </div>

          {/* Graphique */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', r: 3 }}
                />
                {prediction.predictedLowest && (
                  <ReferenceLine 
                    y={prediction.predictedLowest} 
                    stroke="#10B981" 
                    strokeDasharray="5 5" 
                    label={{ value: 'Meilleur prix', fill: '#10B981', fontSize: 12 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recommandation */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <p className="text-purple-300">{prediction.recommendation}</p>
          </div>
        </>
      )}
    </div>
  );
}
