import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { username, password, name, role } = req.body;

    // Validation des données
    if (!username || !password) {
      return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name: name || null,
        role: role || 'USER',
      },
    });

    // Enregistrer l'action
    await prisma.userAction.create({
      data: {
        userId: session.user.id,
        actionType: 'CREATE_USER',
        details: `Création de l'utilisateur ${username}`
      }
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message 
    });
  }
}