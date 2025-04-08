
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { phone } = await req.json();
    
    if (!phone) {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // In a production environment, you would integrate with a service like Twilio
    // to send actual SMS messages with OTP codes
    
    // For demo purposes, we'll generate a random 6-digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Log the OTP for testing purposes
    console.log(`[DEMO] Sending OTP ${otp} to phone ${phone}`);
    
    // In production, store the OTP with an expiration time in a database table
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "OTP sent successfully",
        // Only return the OTP in development for testing
        otp: Deno.env.get("DENO_ENV") === "development" ? otp : undefined
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
