'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plane, Search, LogOut, ArrowRightLeft, Star, Clock, Bell, Heart, X, User, ExternalLink, Filter, Calendar, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import PriceChart from '@/components/PriceChart';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [origin, setOrigin] = useState('CDG');
  const [destination, setDestination] = useState('ORY');
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAlertInput, setShowAlertInput] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtres
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('ECONOMY');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    loadFavorites();
    loadHistory();
    loadAlerts();
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try { const res = await api.get('/favorites'); setFavorites(res.data); } catch (e) {}
  };

  const loadHistory = () => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) setHistory(JSON.parse(saved));
  };

  const loadAlerts = async () => {
    try { const res = await api.get('/alerts'); setAlerts(res.data); } catch (e) {}
  };

  const saveToHistory = (orig: string, dest: string) => {
    const newHistory = [{ origin: orig, destination: dest, date: new Date().toISOString() }, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const addFavorite = async () => {
    try {
      await api.post('/favorites', { origin, destination });
      await loadFavorites();
      toast.success('Ajouté aux favoris !');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Déjà en favori');
    }
  };

  const removeFavorite = async (id: string) => {
    await api.delete(`/favorites/${id}`);
    loadFavorites();
  };

  const createAlert = async () => {
    if (!alertPrice) return;
    await api.post('/alerts', { origin, destination, targetPrice: parseFloat(alertPrice) });
    setAlertPrice('');
    setShowAlertInput(false);
    loadAlerts();
    toast.success('Alerte créée !');
  };

  const removeAlert = async (id: string) => {
    await api.delete(`/alerts/${id}`);
    loadAlerts();
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.post('/flights/search', {
        origin,
        destination,
        departureDate: departureDate || null,
        returnDate: returnDate || null,
        passengers,
        cabinClass
      });
      setFlights(res.data.flights || []);
      setSearched(true);
      saveToHistory(origin, destination);
      
      if (res.data.flights?.length > 0) {
        const avgPrice = res.data.flights.reduce((acc: number, f: any) => acc + f.price, 0) / res.data.flights.length;
        const checkRes = await api.post('/alerts/check', { origin, destination, currentPrice: Math.round(avgPrice) });
        if (checkRes.data.triggered?.length > 0) {
          toast.success(`🎉 Alerte déclenchée ! Prix sous ${checkRes.data.triggered[0].targetPrice}€`);
        }
      }
    } catch (e: any) {
      toast.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const quickSearch = (orig: string, dest: string) => {
    setOrigin(orig);
    setDestination(dest);
  };

  const viewFlightDetail = (flight: any) => {
    const params = new URLSearchParams({
      airline: flight.airline,
      price: flight.price,
      departure: flight.departure,
      arrival: flight.arrival,
      duration: flight.duration,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      aircraft: flight.aircraft,
      seatsLeft: flight.seatsLeft,
      stops: flight.stops
    });
    router.push(`/flight?${params.toString()}`);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Plane className="w-6 h-6 text-purple-400" />
            <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">FlightPulse AI</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="text-gray-400 hover:text-white flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{user?.firstName || user?.email}</span>
            </Link>
            <button onClick={() => { logout(); router.push('/login'); }} className="text-red-400 hover:text-red-300">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-2" /> Favoris
              </h3>
              {favorites.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun favori</p>
              ) : (
                <div className="space-y-2">
                  {favorites.map((fav: any) => (
                    <div key={fav.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <button onClick={() => quickSearch(fav.origin, fav.destination)} className="text-white text-sm hover:text-purple-400">
                        {fav.origin} → {fav.destination}
                      </button>
                      <button onClick={() => removeFavorite(fav.id)} className="text-red-400"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Clock className="w-4 h-4 text-blue-400 mr-2" /> Historique
              </h3>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune recherche</p>
              ) : (
                <div className="space-y-2">
                  {history.slice(0, 5).map((item: any, i: number) => (
                    <button key={i} onClick={() => quickSearch(item.origin, item.destination)}
                      className="w-full text-left text-gray-400 text-sm hover:text-white bg-white/5 rounded-lg p-2">
                      {item.origin} → {item.destination}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Bell className="w-4 h-4 text-yellow-400 mr-2" /> Alertes actives
              </h3>
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune alerte</p>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert: any) => (
                    <div key={alert.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <div>
                        <p className="text-white text-sm">{alert.origin} → {alert.destination}</p>
                        <p className="text-xs text-gray-500">&lt; {alert.targetPrice}€</p>
                      </div>
                      <button onClick={() => removeAlert(alert.id)} className="text-red-400"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">
                <Search className="w-6 h-6 text-purple-400 inline mr-2" />
                Rechercher un vol
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                  <option value="CDG">Paris CDG</option>
                  <option value="ORY">Paris Orly</option>
                  <option value="NCE">Nice</option>
                  <option value="LYS">Lyon</option>
                </select>
                <button onClick={() => { const t = origin; setOrigin(destination); setDestination(t); }}
                  className="flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-purple-400" />
                </button>
                <select value={destination} onChange={(e) => setDestination(e.target.value)} className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                  <option value="ORY">Paris Orly</option>
                  <option value="CDG">Paris CDG</option>
                  <option value="JFK">New York JFK</option>
                  <option value="LHR">Londres Heathrow</option>
                  <option value="DXB">Dubaï</option>
                  <option value="BCN">Barcelone</option>
                </select>
              </div>

              {/* Filtres avancés */}
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-400 hover:text-white mb-4 text-sm">
                <Filter className="w-4 h-4 mr-1" />
                Filtres avancés
              </button>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white/5 rounded-lg">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      <Calendar className="w-3 h-3 inline mr-1" /> Date de départ
                    </label>
                    <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      <Calendar className="w-3 h-3 inline mr-1" /> Date de retour
                    </label>
                    <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      <Users className="w-3 h-3 inline mr-1" /> Passagers
                    </label>
                    <select value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
                      {[1,2,3,4,5,6].map(n => (
                        <option key={n} value={n}>{n} passager{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      <Briefcase className="w-3 h-3 inline mr-1" /> Classe
                    </label>
                    <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm">
                      <option value="ECONOMY">Économique</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="BUSINESS">Business</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={handleSearch} disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50">
                  {loading ? 'Recherche...' : 'Rechercher les vols'}
                </button>
                <button onClick={addFavorite} className="px-4 py-3 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/10">
                  <Heart className="w-5 h-5" />
                </button>
                <button onClick={() => setShowAlertInput(!showAlertInput)} className="px-4 py-3 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/10">
                  <Bell className="w-5 h-5" />
                </button>
              </div>

              {showAlertInput && (
                <div className="mt-4 flex gap-2">
                  <input type="number" placeholder="Prix maximum (€)" value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white" />
                  <button onClick={createAlert} className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400">
                    Créer
                  </button>
                </div>
              )}
            </div>

            {searched && <PriceChart origin={origin} destination={destination} />}

            {flights.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{flights.length} vols trouvés</h3>
                <div className="space-y-4">
                  {flights.map((flight: any, i: number) => (
                    <div key={i} onClick={() => viewFlightDetail(flight)}
                      className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{flight.airline}</h4>
                          <p className="text-gray-400 text-sm">{flight.flightNumber} • {flight.aircraft}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div>
                              <p className="text-xl font-bold text-white">{flight.departureTime}</p>
                              <p className="text-gray-400 text-sm">{flight.departure}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-500 text-xs">{flight.duration}</p>
                              <div className="border-t border-white/20 w-16 my-1"></div>
                              <p className="text-xs text-green-400">{flight.stops === 0 ? 'Direct' : `${flight.stops} escale`}</p>
                            </div>
                            <div>
                              <p className="text-xl font-bold text-white">{flight.arrivalTime}</p>
                              <p className="text-gray-400 text-sm">{flight.arrival}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-400">{flight.price}€</p>
                          <p className="text-xs text-gray-500">{flight.cabinClass === 'BUSINESS' ? 'Business' : flight.cabinClass === 'PREMIUM' ? 'Premium' : 'Éco'}</p>
                          <p className="text-xs text-orange-400 mt-1">{flight.seatsLeft} places</p>
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white mt-2 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
