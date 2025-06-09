const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, type } = await req.json();

    // Use Hugging Face's free Inference API
    const huggingFaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY');
    
    if (!huggingFaceApiKey) {
      // Fallback to a simple rule-based response system
      const response = generateFallbackResponse(message);
      return new Response(
        JSON.stringify({ response }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Use Hugging Face's free model
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Customer: ${message}\nTrustRx Support:`,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Hugging Face API error');
    }

    const data = await response.json();
    let aiResponse = data[0]?.generated_text || 'I apologize, but I\'m having trouble processing your request right now. Please try again.';
    
    // Clean up the response
    aiResponse = aiResponse.replace(`Customer: ${message}\nTrustRx Support:`, '').trim();
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Chat error:', error);
    
    // Fallback response
    const fallbackResponse = generateFallbackResponse(message || '');
    
    return new Response(
      JSON.stringify({ response: fallbackResponse }),
      {
        status: 200, // Return 200 with fallback instead of error
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});

// Simple rule-based fallback response system
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Common TrustRx support responses
  if (lowerMessage.includes('password') || lowerMessage.includes('login')) {
    return 'To reset your password, please go to the login page and click "Forgot password?". You\'ll receive an email with reset instructions.';
  }
  
  if (lowerMessage.includes('upload') || lowerMessage.includes('record')) {
    return 'To upload medical records, go to your Medical Records page and click "Upload Record". We support PDF, JPG, and PNG files up to 10MB.';
  }
  
  if (lowerMessage.includes('doctor') || lowerMessage.includes('appointment')) {
    return 'You can find doctors using our Doctor Search feature. Once you find a doctor, you can request an appointment directly through their profile.';
  }
  
  if (lowerMessage.includes('subscription') || lowerMessage.includes('plan')) {
    return 'We offer Free, Basic, Premium, and Unlimited plans. You can upgrade your subscription in the Subscription section of your dashboard.';
  }
  
  if (lowerMessage.includes('blockchain') || lowerMessage.includes('verification')) {
    return 'All medical records are automatically verified using blockchain technology to ensure authenticity and security.';
  }
  
  if (lowerMessage.includes('storage') || lowerMessage.includes('space')) {
    return 'Your current storage usage is shown in your dashboard. Free accounts get 2GB of secure storage. Upgrade your plan for more storage.';
  }
  
  if (lowerMessage.includes('security') || lowerMessage.includes('safe')) {
    return 'TrustRx uses enterprise-grade encryption and blockchain verification to keep your medical records secure and private.';
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return 'Hello! I\'m here to help you with TrustRx. You can ask me about uploading records, finding doctors, managing appointments, or any other questions about our platform.';
  }
  
  // Default response
  return 'Thank you for contacting TrustRx support! I\'m here to help you with medical records, doctor searches, appointments, and account management. What can I assist you with today?';
}