import mongoose from 'mongoose';
import { config } from './index';

export const connectDatabase = async () => {
  try {
    const dbConfig = config.database;
    const connectionString = process.env.DATABASE_URL || 
      `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;
    
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    
    console.log('✅ Database connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log('Database disconnected');
};

export default { connectDatabase, disconnectDatabase };
