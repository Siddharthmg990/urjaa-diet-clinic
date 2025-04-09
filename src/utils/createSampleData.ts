
import { supabase, ensureBucketExists } from '@/integrations/supabase/client';

/**
 * Create sample data for testing purposes.
 * This will create a sample diet plan and appointments for the current logged-in user.
 */
export const createSampleData = async (userId: string) => {
  try {
    // Ensure buckets exist
    await Promise.all([
      ensureBucketExists('health_photos'),
      ensureBucketExists('medical_reports')
    ]);

    // Create a sample diet plan
    const dietPlan = {
      user_id: userId,
      dietitian_id: null, // For a real app, you'd need a dietitian ID
      title: "Sample Weight Loss Plan",
      description: "A balanced diet plan focused on gradual weight loss.",
      status: "active",
      content: {
        weeks: [
          {
            week: 1,
            goals: "Get accustomed to new meal timings and portion sizes.",
            days: [
              {
                day: "Monday",
                meals: [
                  {
                    name: "Breakfast",
                    time: "8:00 AM",
                    items: [
                      "2 eggs (boiled or poached)",
                      "1 slice whole grain toast",
                      "1/2 avocado",
                      "Green tea or black coffee"
                    ]
                  },
                  {
                    name: "Lunch",
                    time: "12:30 PM",
                    items: [
                      "Grilled chicken breast (150g)",
                      "Mixed salad with olive oil & lemon dressing",
                      "1/2 cup quinoa",
                      "Water with lemon"
                    ]
                  },
                  {
                    name: "Snack",
                    time: "4:00 PM",
                    items: [
                      "Greek yogurt (1/2 cup)",
                      "Handful of berries",
                      "5-6 almonds"
                    ]
                  },
                  {
                    name: "Dinner",
                    time: "7:30 PM",
                    items: [
                      "Baked salmon (150g)",
                      "Steamed broccoli and carrots",
                      "Small sweet potato",
                      "Herbal tea"
                    ]
                  }
                ]
              }
            ]
          }
        ],
        hydration: "Aim for 2-3 liters of water daily",
        supplements: [
          { name: "Vitamin D", dosage: "1000 IU", timing: "Morning" },
          { name: "Fish Oil", dosage: "1000mg", timing: "With meals" }
        ],
        notes: "Adjust portions based on hunger levels. Focus on whole foods and avoid processed foods."
      }
    };

    const { data: planData, error: planError } = await supabase
      .from('diet_plans')
      .insert([dietPlan])
      .select();

    if (planError) throw planError;
    console.log("Sample diet plan created:", planData);

    // Create sample appointments (past, today, and future)
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const appointments = [
      {
        user_id: userId,
        dietitian_id: null,
        appointment_date: yesterday.toISOString().split('T')[0],
        appointment_time: "11:00 AM",
        status: "completed",
        reason: "Initial consultation",
        notes: "in-person session completed"
      },
      {
        user_id: userId,
        dietitian_id: null,
        appointment_date: today.toISOString().split('T')[0],
        appointment_time: "3:00 PM",
        status: "confirmed",
        reason: "Follow-up check",
        notes: "video session requested"
      },
      {
        user_id: userId,
        dietitian_id: null,
        appointment_date: tomorrow.toISOString().split('T')[0],
        appointment_time: "1:00 PM",
        status: "pending",
        reason: "Diet plan review",
        notes: "phone session requested"
      },
      {
        user_id: userId,
        dietitian_id: null,
        appointment_date: nextWeek.toISOString().split('T')[0],
        appointment_time: "2:30 PM",
        status: "requested",
        reason: "Progress assessment",
        notes: "in-person session requested"
      }
    ];

    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .insert(appointments)
      .select();

    if (appointmentError) throw appointmentError;
    console.log("Sample appointments created:", appointmentData);

    return { success: true, plan: planData, appointments: appointmentData };
  } catch (error) {
    console.error("Error creating sample data:", error);
    return { success: false, error };
  }
};
