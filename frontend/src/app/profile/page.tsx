'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plane, User, Mail, Calendar, LogOut, Save, X, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, login } = useAuthStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  const handleSave = () => {
    if (user) {
      login({ ...user, firstName, lastName }, localStorage.getItem('token') || '');
      toast.success('Profil mis à jour !');
      setEditing(false);
    }
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
          <button onClick={() => router.push('/dashboard')} className="text-purple-400 hover:text-purple-300">
            ← Retour au dashboard
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Mon Profil</h1>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button onClick={() => setEditing(!editing)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Prénom</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                    <Save className="w-4 h-4 mr-2" /> Enregistrer
                  </button>
                  <button onClick={() => setEditing(false)}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="text-white">{user?.firstName} {user?.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-white">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Membre depuis</p>
                    <p className="text-white">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-white/10">
              <button onClick={() => { logout(); router.push('/login'); }}
                className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
