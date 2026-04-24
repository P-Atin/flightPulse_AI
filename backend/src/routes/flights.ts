import { Router, Request, Response } from 'express';

const router = Router();

const distances: any = {
  'CDG-ORY': 40, 'ORY-CDG': 40,
  'CDG-JFK': 5835, 'JFK-CDG': 5835,
  'CDG-LHR': 345, 'LHR-CDG': 345,
  'CDG-DXB': 5240, 'DXB-CDG': 5240,
  'CDG-BCN': 860, 'BCN-CDG': 860,
  'ORY-JFK': 5830, 'ORY-LHR': 350,
  'ORY-DXB': 5235, 'ORY-BCN': 855,
  'NCE-JFK': 6410, 'LYS-JFK': 6215,
};

function getDuration(origin: string, destination: string): string {
  const key = `${origin}-${destination}`;
  const distance = distances[key] || 1000;
  const hours = Math.floor(distance / 800);
  const minutes = Math.round((distance % 800) / 800 * 60);
  return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
}

function estimatePrice(origin: string, destination: string): number {
  const key = `${origin}-${destination}`;
  const distance = distances[key] || 1000;
  const basePrice = distance * 0.08;
  return Math.round(basePrice + (Math.random() - 0.5) * basePrice * 0.4);
}

router.post('/search', async (req: Request, res: Response) => {
  try {
    const { origin, destination, departureDate, passengers, cabinClass } = req.body;

    const airlines = ['Air France', 'Lufthansa', 'British Airways', 'Delta', 'United', 'Emirates', 'Qatar Airways', 'KLM'];
    const aircrafts = ['Boeing 777-300ER', 'Airbus A350-900', 'Boeing 787-9', 'Airbus A380'];
    const classes = cabinClass || 'ECONOMY';
    const classMultiplier = classes === 'BUSINESS' ? 3.5 : classes === 'PREMIUM' ? 2 : 1;
    
    let flights: any[] = [];

    // Générer des vols simulés
    for (let i = 0; i < 6; i++) {
      const depHour = Math.floor(6 + Math.random() * 16);
      const depMin = Math.floor(Math.random() * 60);
      const durationStr = getDuration(origin, destination);
      const [durHours, durMins] = durationStr.split(/[hm]+/).map(Number);
      const totalMins = depHour * 60 + depMin + (durHours || 0) * 60 + (durMins || 0);
      const arrHour = Math.floor(totalMins / 60) % 24;
      const arrMin = totalMins % 60;

      flights.push({
        id: Date.now() + i,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        flightNumber: `AF${Math.floor(1000 + Math.random() * 9000)}`,
        departure: origin,
        arrival: destination,
        departureTime: `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`,
        arrivalTime: `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`,
        duration: durationStr,
        price: Math.round(estimatePrice(origin, destination) * classMultiplier),
        aircraft: aircrafts[Math.floor(Math.random() * aircrafts.length)],
        stops: Math.random() > 0.7 ? 1 : 0,
        seatsLeft: Math.floor(2 + Math.random() * 30),
        cabinClass: classes,
        currency: 'EUR'
      });
    }

    // Appliquer filtre passagers
    const requestedPassengers = passengers || 1;
    flights = flights.map((f: any) => ({
      ...f,
      seatsLeft: Math.max(0, f.seatsLeft - requestedPassengers + 1)
    }));

    res.json({ 
      flights: flights.slice(0, 10),
      searchParams: { origin, destination, departureDate, passengers, cabinClass },
      totalResults: flights.length 
    });
  } catch (error: any) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
