import { Router, Request, Response } from 'express';

const router = Router();

let favorites: any[] = [];

// Ajouter un favori
router.post('/', (req: Request, res: Response) => {
  const { origin, destination } = req.body;
  
  const exists = favorites.find(f => f.origin === origin && f.destination === destination);
  if (exists) {
    return res.status(400).json({ error: 'Ce trajet est déjà en favori' });
  }
  
  const favorite = {
    id: Date.now().toString(),
    origin,
    destination,
    createdAt: new Date().toISOString()
  };
  
  favorites.push(favorite);
  res.status(201).json(favorite);
});

// Lister les favoris
router.get('/', (req: Request, res: Response) => {
  res.json(favorites);
});

// Supprimer un favori
router.delete('/:id', (req: Request, res: Response) => {
  favorites = favorites.filter(f => f.id !== req.params.id);
  res.json({ message: 'Favori supprimé' });
});

export default router;
