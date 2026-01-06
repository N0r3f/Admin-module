# Module d'Administration

Ce module fournit une interface d'administration complète avec gestion des utilisateurs et suivi des actions.

## Installation

1. Copier le dossier `admin-module` dans votre projet
2. Installer les dépendances :
```bash
npm install
```

3. Configurer la base de données dans `.env` :
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialiser la base de données :
```bash
npx prisma generate
npx prisma migrate dev
```

## Utilisation

Importer les composants nécessaires :

```javascript
import UserManagement from 'admin-module/components/UserManagement';
import { authenticateUser, logUserAction } from 'admin-module/api/auth';
import AuthLayout from 'admin-module/components/Layout/AuthLayout';
import { withAuth, withAuthAdmin } from 'admin-module/utils/withAuth';

## Fonctionnalités

- Gestion complète des utilisateurs (CRUD)
- Authentification sécurisée
- Suivi des actions utilisateurs
- Interface moderne et responsive
- Support des rôles (ADMIN/USER)


Pour utiliser ce module dans un autre projet :
1. Copier le dossier `admin-module`
2. Installer les dépendances requises
3. Configurer la base de données
4. Importer les composants et les API nécessaires

Le module est maintenant autonome et peut être facilement intégré dans d'autres projets Next.js.