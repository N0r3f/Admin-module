import MainLayout from '../../components/Layout/MainLayout';
import UserManagement from '../../components/UserManagement';
import UserBanner from '../../components/UserBanner';
import styles from '../../styles/Admin.module.css';

export default function UsersPage() {
  return (
    <MainLayout>
      <UserBanner />
      <div className={styles.adminPage}>
        <h1>Gestion des Utilisateurs</h1>
        <UserManagement />
      </div>
    </MainLayout>
  );
}
