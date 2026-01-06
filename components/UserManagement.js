import { useState, useEffect } from 'react';
import styles from '../styles/Admin.module.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'USER'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        username: editingUser.username,
        password: '', // Vider le mot de passe lors de la modification
        name: editingUser.name || '',
        role: editingUser.role
      });
    }
  }, [editingUser]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/addUser';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(editingUser ? 'Utilisateur modifié avec succès' : 'Utilisateur ajouté avec succès');
        setFormData({ username: '', password: '', name: '', role: 'USER' });
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        });
        
        const data = await res.json();
        
        if (res.ok) {
          alert('Utilisateur supprimé avec succès');
          fetchUsers();
        } else {
          alert(data.message || 'Une erreur est survenue');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  };

  return (
    <div className={styles.userManagement}>
      <div className={styles.formSection}>
        <h2>{editingUser ? 'Modifier utilisateur' : 'Ajouter utilisateur'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom d'utilisateur:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label>Mot de passe:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required={!editingUser}
            />
          </div>
          <div>
            <label>Nom:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label>Rôle:</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button type="submit">
            {editingUser ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editingUser && (
            <button type="button" onClick={() => setEditingUser(null)}>
              Annuler
            </button>
          )}
        </form>
      </div>

      <div className={styles.tableSection}>
        <h2>Liste des utilisateurs</h2>
        <table className={styles.modernTable}>
          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Dernière connexion</th>
              <th>Dernière action</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.name || '-'}</td>
                <td>
                  <span className={`${styles.userStatus} ${user.role === 'ADMIN' ? styles.statusAdmin : styles.statusUser}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.lastLogin || 'Jamais'}</td>
                <td>
                  {user.lastAction ? (
                    <div className={styles.lastAction}>
                      <span className={styles.actionType}>{user.lastAction.actionType}</span>
                      <span className={styles.actionDetails}>{user.lastAction.details}</span>
                      <span className={styles.timestamp}>{user.lastAction.timestamp}</span>
                    </div>
                  ) : (
                    'Aucune'
                  )}
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.editButton}
                      onClick={() => setEditingUser(user)}
                    >
                      Modifier
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
