import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

export const authenticateUser = async (username, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (user && await bcrypt.compare(password, user.password)) {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
      };
    }
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const logUserAction = async (userId, actionType, details) => {
  try {
    const action = await prisma.userAction.create({
      data: {
        userId,
        actionType,
        details
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { lastActionId: action.id }
    });

    return action;
  } catch (error) {
    console.error('Action logging error:', error);
    throw error;
  }
};
