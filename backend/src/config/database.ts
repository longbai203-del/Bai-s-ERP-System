import mongoose from 'mongoose';
import { config } from './index';
import logger from '../utils/logger';

export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    const dbConfig = config.database;
    const connectionString = process.env.DATABASE_URL || 
      `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;

    // 如果使用 Docker MongoDB 且无需认证
    const fallbackString = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;
    const finalString = dbConfig.user ? connectionString : fallbackString;

    await mongoose.connect(finalString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    logger.info('✅ Database connected successfully');
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected, attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

    return mongoose;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting database:', error);
    throw error;
  }
};

export const getConnectionStatus = (): string => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

export default { connectDatabase, disconnectDatabase, getConnectionStatus };
