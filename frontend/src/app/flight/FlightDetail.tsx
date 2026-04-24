'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Plane, Clock, Luggage, Users, ArrowLeft } from 'lucide-react';

export default function FlightDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const flight = {
    airline: searchParams.get('airline') || 'Air France',
    price: searchParams.get('price') || '350',
    departure: searchParams.get('departure') || 'CDG',
    arrival: searchParams.get('arrival') || 'JFK',
    duration: searchParams.get('duration') || '3h 00min',
    departureTime: searchParams.get('departureTime') || '10:00',
    arrivalTime: searchParams.get('arrivalTime') || '13:00',
    aircraft: searchParams.get('aircraft') || 'Boeing 777',
    seatsLeft: searchParams.get('seatsLeft') || '12',
    stops: searchParams.get('stops') || '0'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white mb-6 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </button>

        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">{flight.airline}</h1>
            <p className="text-gray-400 mt-2">{flight.aircraft}</p>
          </div>

          <div className="flex items-center justify-between mb-8 p-6 bg-white/5 rounded-xl">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{flight.departureTime}</p>
              <p className="text-gray-400">{flight.departure}</p>
            </div>
            
            <div className="flex-1 mx-4 text-center">
              <div className="border-t border-white/20 relative mb-2">
                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm text-gray-400">{flight.duration}</p>
              <p className="text-xs text-green-400">{flight.stops === '0' ? 'Vol direct' : `${flight.stops} escale(s)`}</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-white">{flight.arrivalTime}</p>
              <p className="text-gray-400">{flight.arrival}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{flight.duration}</p>
              <p className="text-gray-500 text-sm">Durée</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <Luggage className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">2x23kg</p>
              <p className="text-gray-500 text-sm">Bagages</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{flight.seatsLeft}</p>
              <p className="text-gray-500 text-sm">Places</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-purple-400 mb-4">{flight.price}€</p>
            <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all">
              Réserver ce vol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
