import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function createAdminUser() {
    const email = "admin@premiumtextiles.com";
    const password = "Admin@123456";

    console.log("Creating admin user...");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm the email
        });

        if (error) {
            if (error.message.includes("already been registered")) {
                console.log("\n⚠️  User already exists. You can login with the existing credentials.");
                console.log("If you forgot the password, delete the user from Supabase Dashboard and run this script again.");
            } else {
                console.error("Error creating user:", error.message);
            }
            return;
        }

        console.log("\n✅ Admin user created successfully!");
        console.log("\n--- Login Credentials ---");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("------------------------");
        console.log("\nYou can now login at: http://localhost:3000/admin/login");
    } catch (err) {
        console.error("Failed to create admin user:", err);
    }
}

createAdminUser();
