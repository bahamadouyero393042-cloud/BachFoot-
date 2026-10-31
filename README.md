# BachFoot — mise en ligne

Cette version utilise une fonction serveur Vercel pour appeler SportsAPI. La clé API n'est jamais envoyée au navigateur.

## Fichiers
- `index.html` : interface multisport
- `api/sports.js` : proxy sécurisé vers SportsAPI
- `package.json` : configuration minimale

## Déploiement
1. Crée un dépôt GitHub nommé `bachfoot`.
2. Téléverse le contenu de ce dossier à la racine du dépôt (pas le dossier parent).
3. Dans Vercel, choisis **Add New → Project**, importe le dépôt `bachfoot`, puis déploie.
4. Dans Vercel → Project → Settings → Environment Variables, ajoute :
   - Name : `SPORTSAPI_KEY`
   - Value : ta clé API SportsAPI
   - Environments : Production, Preview, Development
5. Enregistre, puis redéploie le projet.

Ne mets jamais la clé API dans `index.html`, GitHub, ni dans un message public.

## Limites de l'offre SportsAPI gratuite
L'offre gratuite annoncée par SportsAPI indique 100 requêtes par jour, 10 par minute, 7 jours d'historique et pas de WebSocket. Cette application actualise les données à la demande et utilise un cache côté Vercel pour réduire les appels. Vérifie les conditions de ton compte avant une diffusion à grande échelle.

## Important
- Les événements affichés viennent de SportsAPI ; aucun faux score n'est ajouté.
- Les sports de type course (par exemple motorsport/cycling) utilisent la route `/races`.
- Les autres sports utilisent `/livescores` et `/fixtures`.
- Le classement, les actualités, les comptes utilisateurs et les notifications ne sont pas encore inclus dans cette première version connectée.
