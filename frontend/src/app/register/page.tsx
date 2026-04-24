'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plane, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  lastName: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

export default function RegisterPage() {
  const router = useRouter();
  const loginUser = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
      loginUser(response.data.user, response.data.accessToken);
      toast.success('Compte créé !');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Plane className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Inscription</h1>
          <p className="text-gray-400 mt-2">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Prénom</label>
              <input {...register('firstName')} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500" />
              {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message?.toString()}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nom</label>
              <input {...register('lastName')} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500" />
              {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message?.toString()}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input {...register('email')} type="email" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500" />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message?.toString()}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Mot de passe</label>
            <input {...register('password')} type="password" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500" />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message?.toString()}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Confirmer</label>
            <input {...register('confirmPassword')} type="password" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500" />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message?.toString()}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Déjà un compte ? <Link href="/login" className="text-purple-400 hover:underline">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}
