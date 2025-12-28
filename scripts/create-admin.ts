// Create admin user in Supabase Auth
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdminUser() {
    const email = 'alok@gmail.com';
    const password = 'Admin@123456';

    console.log('Creating admin user...\n');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('');

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email verification
    });

    if (error) {
        if (error.message.includes('already been registered')) {
            console.log('⚠️  User already exists! You can use the existing credentials.');

            // Try to update password
            const { data: users } = await supabase.auth.admin.listUsers();
            const existingUser = users?.users?.find(u => u.email === email);

            if (existingUser) {
                const { error: updateError } = await supabase.auth.admin.updateUserById(
                    existingUser.id,
                    { password }
                );

                if (!updateError) {
                    console.log('✅ Password reset to:', password);
                }
            }
        } else {
            console.error('Error creating user:', error.message);
        }
    } else {
        console.log('✅ Admin user created successfully!');
        console.log('User ID:', data.user?.id);
    }

    console.log('\n--- Login Credentials ---');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('-------------------------\n');

    process.exit(0);
}

createAdminUser().catch(console.error);
