import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/Auth.module.css';
import UserBanner from '../../components/UserBanner';
import MainLayout from '../../components/Layout/MainLayout';

export default function SignIn() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      username: credentials.username,
      password: credentials.password,
      redirect: false
    });

    if (result.error) {
      setError('Identifiants incorrects');
    } else {
      router.push('/');
    }
  };

  return (
    <MainLayout>
      <UserBanner />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1>Connexion</h1>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
