# Bonavis — Site + Redirection NFC

Système d’abonnement pour collecter des Google Reviews via puces NFC.

## Ce qui est déjà codé

- **Landing page** (`/`) : présentation, fonctionnement, pricing.
- **Page de redirection** (`/r/[code]`) : 
  - Vérifie que le lien existe et que l’abonnement est actif.
  - Logue le tap.
  - Affiche une page brandée puis redirige vers Google Review.
- **Dashboard client** (`/dashboard`) : liste des puces, nombre de taps, statut d’abonnement.
- **Store de démo** (`lib/store.ts`) : données en mémoire (à remplacer par une vraie base).

## Lancer en local

```bash
cd bonavie
npm install
npm run dev
```

Puis ouvre http://localhost:3000

### Liens de test
- Redirection active : http://localhost:3000/r/demo123
- Abonnement expiré : http://localhost:3000/r/expired456
- Dashboard : http://localhost:3000/dashboard

## Ce que TU dois faire (interventions nécessaires)

1. **Compte Stripe**  
   Crée un compte sur stripe.com → récupère les clés API (test puis live).  
   On les branchera ensuite dans le code.

2. **Nom de domaine**  
   Achète bonavie.com (ou autre) et pointe-le vers ton hébergement.

3. **Hébergement**  
   Recommandé : Vercel (connexion GitHub + déploiement en 2 clics).

4. **Base de données**  
   Remplace le store en mémoire par PostgreSQL (Supabase ou Neon recommandé).

5. **Puces NFC physiques**  
   Commande des puces NTAG213/215, programme-les avec les URLs `https://tondomaine.com/r/CODE`.

6. **Liens Google Review**  
   Pour chaque client, récupère le lien exact depuis Google Business Profile (« Obtenir plus d’avis »).

## Prochaines étapes techniques recommandées

- Ajouter l’authentification (Clerk ou Supabase Auth).
- Brancher Stripe Subscriptions + webhooks.
- Passer le store en base de données réelle.
- Ajouter la génération de QR codes.
- Mettre en place le portail client Stripe.

---

Le code est prêt pour être étendu. Dis-moi ce que tu veux ajouter en priorité.
