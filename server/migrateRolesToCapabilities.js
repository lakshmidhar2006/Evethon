import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';

dotenv.config();

const migrateUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users to migrate`);

        for (const user of users) {
            let updates = {};

            // Initialize new fields
            if (user.organizerEnabled === undefined) updates.organizerEnabled = false;
            if (user.isAdmin === undefined) updates.isAdmin = false;

            // Map roles to capabilities
            if (user.role === 'organizer') {
                updates.organizerEnabled = true;
                // Initialize empty profile if needed, or leave null
                if (!user.organizerProfile) {
                    updates.organizerProfile = {
                        organizationName: user.name + "'s Organization", // Default
                        organizationType: 'Individual',
                        contactNumber: '',
                        eventCategories: [],
                        experienceLevel: 'Beginner'
                    };
                }
            } else if (user.role === 'admin') {
                updates.isAdmin = true;
                updates.organizerEnabled = true; // Admins usually can organize too
            }

            // Remove role field (optional, or keep for record)
            // updates.$unset = { role: 1 }; 

            if (Object.keys(updates).length > 0) {
                await User.updateOne({ _id: user._id }, updates);
                console.log(`Migrated user: ${user.email}`);
            }
        }

        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateUsers();
