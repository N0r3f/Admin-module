import { useSession } from 'next-auth/react';
import styles from '../styles/Header.module.css';

export default function UserBanner() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className={styles.userBanner}>
      <div className={styles.userInfo}>
        <span>Connecté en tant que: {session.user.name || session.user.username}</span>
        <span className={styles.userRole}>Rôle: {session.user.role}</span>
      </div>
    </div>
  );
}
