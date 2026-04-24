import { Router, Request, Response } from 'express';

const router = Router();
let alerts: any[] = [];
let triggeredAlerts: any[] = [];

// Créer une alerte
router.post('/', (req: Request, res: Response) => {
  const { origin, destination, targetPrice } = req.body;
  const alert = {
    id: Date.now().toString(),
    origin,
    destination,
    targetPrice,
    active: true,
    createdAt: new Date().toISOString()
  };
  alerts.push(alert);
  res.status(201).json(alert);
});

// Lister les alertes actives
router.get('/', (req: Request, res: Response) => {
  res.json(alerts.filter(a => a.active));
});

// Lister les alertes déclenchées
router.get('/triggered', (req: Request, res: Response) => {
  res.json(triggeredAlerts);
});

// Vérifier les alertes (appelé périodiquement par le frontend)
router.post('/check', (req: Request, res: Response) => {
  const { origin, destination, currentPrice } = req.body;
  
  const matchedAlerts = alerts.filter(a => 
    a.active && 
    a.origin === origin && 
    a.destination === destination && 
    currentPrice <= a.targetPrice
  );

  matchedAlerts.forEach(alert => {
    alert.active = false;
    alert.triggeredAt = new Date().toISOString();
    alert.triggeredPrice = currentPrice;
    triggeredAlerts.push(alert);
    alerts = alerts.filter(a => a.id !== alert.id);
  });

  res.json({ triggered: matchedAlerts });
});

// Supprimer une alerte
router.delete('/:id', (req: Request, res: Response) => {
  alerts = alerts.filter(a => a.id !== req.params.id);
  res.json({ message: 'Alerte supprimée' });
});

export default router;
