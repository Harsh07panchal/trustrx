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
      console.log('No Hugging Face API key found, using fallback responses');
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

    console.log('Using Hugging Face API for chat response');

    // Use Hugging Face's free conversational model
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: [],
            generated_responses: [],
            text: `As a TrustRx customer support agent, please help with this question: ${message}`
          },
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true,
            repetition_penalty: 1.1
          },
        }),
      }
    );

    if (!response.ok) {
      console.log('Hugging Face API error, using fallback');
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.generated_text || data.response || 'I apologize, but I\'m having trouble processing your request right now. Please try again.';
    
    // Clean up the response and ensure it's helpful
    if (typeof aiResponse === 'string') {
      aiResponse = aiResponse.trim();
      
      // If response is too short or generic, enhance it
      if (aiResponse.length < 20 || aiResponse.toLowerCase().includes('i don\'t know')) {
        aiResponse = generateContextualResponse(message);
      }
    } else {
      aiResponse = generateContextualResponse(message);
    }
    
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
    
    // Always provide a helpful fallback response
    const fallbackResponse = generateContextualResponse(message || '');
    
    return new Response(
      JSON.stringify({ response: fallbackResponse }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});

// Enhanced contextual response system for TrustRx
function generateContextualResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Authentication & Account Issues
  if (lowerMessage.includes('password') || lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
    return 'To reset your password, click "Forgot password?" on the login page. You\'ll receive an email with reset instructions. If you\'re having trouble logging in, make sure you\'re using the correct email address and check your internet connection.';
  }
  
  if (lowerMessage.includes('account') || lowerMessage.includes('profile')) {
    return 'You can manage your account settings in the Profile section. There you can update your personal information, change your password, and manage your subscription. Is there something specific you\'d like to update?';
  }
  
  // Medical Records
  if (lowerMessage.includes('upload') || lowerMessage.includes('record') || lowerMessage.includes('file')) {
    return 'To upload medical records: 1) Go to Medical Records page, 2) Click "Upload Record", 3) Select your file (PDF, JPG, PNG up to 10MB), 4) Add a description and category, 5) Click upload. All files are automatically verified using blockchain technology for security.';
  }
  
  if (lowerMessage.includes('download') || lowerMessage.includes('access')) {
    return 'You can download your medical records anytime from the Medical Records page. Click the download icon next to any record. You can also share records securely with doctors through the platform.';
  }
  
  // Doctor & Appointments
  if (lowerMessage.includes('doctor') || lowerMessage.includes('physician')) {
    return 'Use our Doctor Search to find healthcare providers by specialty, location, and availability. You can view doctor profiles, ratings, and request appointments directly. All doctors on our platform are verified professionals.';
  }
  
  if (lowerMessage.includes('appointment') || lowerMessage.includes('booking')) {
    return 'To book an appointment: 1) Search for a doctor, 2) View their profile and availability, 3) Click "Book Appointment", 4) Select your preferred time, 5) Add reason for visit. You\'ll receive confirmation once the doctor approves your request.';
  }
  
  // Subscription & Billing
  if (lowerMessage.includes('subscription') || lowerMessage.includes('plan') || lowerMessage.includes('upgrade')) {
    return 'We offer 4 plans: Free (2GB), Basic ($2.99/month, 10GB), Premium ($9.99/month, 50GB), and Unlimited ($15.99/month). Upgrade anytime in your Subscription settings. All plans include blockchain verification and secure storage.';
  }
  
  if (lowerMessage.includes('payment') || lowerMessage.includes('billing') || lowerMessage.includes('cost')) {
    return 'You can manage payment methods and view billing history in the Subscription section. We accept all major credit cards. Your payment information is stored securely and never shared with third parties.';
  }
  
  // Security & Privacy
  if (lowerMessage.includes('blockchain') || lowerMessage.includes('verification') || lowerMessage.includes('secure')) {
    return 'TrustRx uses Algorand blockchain technology to verify the authenticity of all medical records. Each file gets a unique cryptographic hash stored on the blockchain, ensuring your records cannot be tampered with and providing proof of authenticity.';
  }
  
  if (lowerMessage.includes('privacy') || lowerMessage.includes('safe') || lowerMessage.includes('security')) {
    return 'Your privacy is our top priority. We use enterprise-grade encryption, blockchain verification, and strict access controls. Your medical records are only accessible to you and healthcare providers you explicitly authorize. We never sell or share your data.';
  }
  
  // Storage & Technical
  if (lowerMessage.includes('storage') || lowerMessage.includes('space') || lowerMessage.includes('limit')) {
    return 'Your storage usage is displayed in your dashboard. Free accounts get 2GB of secure storage. If you need more space, consider upgrading to Basic (10GB), Premium (50GB), or Unlimited plans. All storage is encrypted and blockchain-verified.';
  }
  
  if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('phone')) {
    return 'TrustRx is fully responsive and works great on mobile devices through your web browser. Simply visit our website on your phone or tablet. We\'re also working on dedicated mobile apps for iOS and Android.';
  }
  
  // Getting Started
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help') || lowerMessage.includes('start')) {
    return 'Hello! Welcome to TrustRx support. I can help you with uploading medical records, finding doctors, booking appointments, managing your subscription, or any questions about our blockchain-secured platform. What would you like to know?';
  }
  
  if (lowerMessage.includes('how') || lowerMessage.includes('tutorial') || lowerMessage.includes('guide')) {
    return 'Here\'s how to get started with TrustRx: 1) Complete your profile, 2) Upload your medical records, 3) Search for doctors in your area, 4) Request appointments as needed. Each step is secure and your data is protected by blockchain technology.';
  }
  
  // Emergency & Urgent
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('911')) {
    return 'For medical emergencies, please call 911 or go to your nearest emergency room immediately. TrustRx is for managing medical records and scheduling appointments, not for emergency medical care.';
  }
  
  // Default helpful response
  return 'Thank you for contacting TrustRx support! I\'m here to help you with our blockchain-secured medical records platform. I can assist with uploading records, finding doctors, booking appointments, managing subscriptions, or answering questions about security and privacy. What specific topic can I help you with today?';
}

// Simple fallback for basic responses
function generateFallbackResponse(message: string): string {
  return generateContextualResponse(message);
}