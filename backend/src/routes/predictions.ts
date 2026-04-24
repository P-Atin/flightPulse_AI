import { Router, Request, Response } from 'express';

const router = Router();

router.post('/predict', async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.body;
    
    const today = new Date();
    const priceHistory = [];
    
    // Prix de base selon la destination
    const basePrices: any = {
      'JFK': 450, 'LHR': 180, 'DXB': 380, 'BCN': 120,
      'NCE': 100, 'LYS': 90, 'MRS': 110, 'ORY': 80, 'CDG': 80
    };
    
    let currentPrice = basePrices[destination] || 250;
    
    // Historique des 30 derniers jours (prix autour du prix actuel)
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 40;
      priceHistory.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(currentPrice + variation),
        type: 'historical'
      });
    }
    
    // Prix actuel = dernière valeur de l'historique
    const actualCurrentPrice = priceHistory[priceHistory.length - 1].price;
    
    // Prédictions : tendance à la baisse ou hausse
    const trend = Math.random() > 0.5 ? -1 : 1;
    const predictions = [];
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const predictedPrice = actualCurrentPrice + (trend * i * (5 + Math.random() * 15));
      predictions.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(Math.max(predictedPrice, actualCurrentPrice * 0.7)),
        type: 'prediction'
      });
    }
    
    // Trouver le prix le plus bas parmi les prédictions
    let predictedLowest = predictions[0].price;
    let bestDay = predictions[0].date;
    
    predictions.forEach(p => {
      if (p.price < predictedLowest) {
        predictedLowest = p.price;
        bestDay = p.date;
      }
    });
    
    const potentialSaving = actualCurrentPrice - predictedLowest;
    
    res.json({
      currentPrice: actualCurrentPrice,
      predictedLowest,
      potentialSaving: potentialSaving > 0 ? potentialSaving : 0,
      bestDayToBook: bestDay,
      priceHistory,
      predictions,
      recommendation: predictedLowest < actualCurrentPrice 
        ? `📉 Les prix devraient baisser jusqu'à ${predictedLowest}€. Attendez le ${bestDay} pour économiser ${potentialSaving}€ !`
        : `📈 Les prix risquent de monter. Réservez maintenant à ${actualCurrentPrice}€.`,
      confidence: Math.round(75 + Math.random() * 20)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
