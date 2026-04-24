import { Suspense } from 'react';
import FlightDetail from './FlightDetail';

export default function FlightPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>}>
      <FlightDetail />
    </Suspense>
  );
}
