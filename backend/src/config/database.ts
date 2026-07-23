import mongoose from 'mongoose';
import { config } from '../config';

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
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log('Database disconnected');
};
