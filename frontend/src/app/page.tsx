'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plane, TrendingDown, Brain, Shield, Zap, ArrowRight, Star, User } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Plane className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FlightPulse AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-gray-400 hover:text-white flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{user?.firstName || 'Profil'}</span>
                </Link>
                <Link href="/dashboard">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium text-sm">
                    Dashboard
                  </button>
                </Link>
                <button onClick={() => { logout(); router.push('/'); }} className="text-red-400 hover:text-red-300 text-sm">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-4 py-2 text-white hover:text-purple-400 transition-colors">
                    Connexion
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                    Essayer Gratuitement
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <section className="container mx-auto px-4 pt-20 pb-32 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white">Ne payez plus jamais</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              trop cher vos vols
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            L'IA qui analyse des millions de prix en temps réel pour vous dire exactement 
            quand acheter vos billets d'avion au meilleur prix.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-lg font-medium hover:shadow-xl hover:shadow-purple-500/25 transition-all flex items-center space-x-2">
                <span>{isAuthenticated ? 'Voir le dashboard' : 'Commencer maintenant'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div><div className="text-3xl font-bold text-purple-400">-40%</div><div className="text-gray-500 text-sm mt-1">D'économies</div></div>
            <div><div className="text-3xl font-bold text-purple-400">+1M</div><div className="text-gray-500 text-sm mt-1">Vols analysés</div></div>
            <div><div className="text-3xl font-bold text-purple-400">95%</div><div className="text-gray-500 text-sm mt-1">De précision</div></div>
          </motion.div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-32">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-4xl font-bold text-white text-center mb-16">
          Pourquoi choisir FlightPulse AI ?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Brain, title: 'IA Prédictive', desc: 'Algorithme qui prédit les baisses de prix.' },
            { icon: TrendingDown, title: 'Alertes temps réel', desc: 'Notifié dès que le prix baisse.' },
            { icon: Shield, title: '100% Sécurisé', desc: 'Données protégées.' },
            { icon: Zap, title: 'Ultra rapide', desc: 'Interface fluide.' },
          ].map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer">
              <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 FlightPulse AI. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
