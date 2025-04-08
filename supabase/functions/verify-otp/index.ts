
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phone, otp, userId } = await req.json();
    
    if (!phone || !otp || !userId) {
      return new Response(
        JSON.stringify({ error: "Phone number, OTP, and userId are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // In a production environment, you would validate the OTP against a stored value
    // For demo purposes, we'll consider any 6-digit OTP valid
    const isValidOTP = otp.length === 6 && /^\d+$/.test(otp);
    
    if (!isValidOTP) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase URL or service role key");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update the user's profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        phone: phone.startsWith('+') ? phone : `+${phone}`,
        phone_verified: true
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Phone verified successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
