# 🚀 TrustRx Production Setup Guide

This guide will help you set up TrustRx for production with real Algorand integration, Supabase, and all necessary services.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A domain name (optional but recommended)
- Credit card for paid services (Supabase Pro, etc.)

## 1. 🗄️ Supabase Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/login with GitHub
4. Click "New Project"
5. Choose your organization
6. Fill in:
   - **Name**: `trustrx-production`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free, upgrade to Pro when needed

### Step 2: Configure Database
1. Wait for project to be created (2-3 minutes)
2. Go to **SQL Editor** in your Supabase dashboard
3. Run the existing migrations in order:
   ```sql
   -- Copy and paste each migration file content from:
   -- supabase/migrations/20250606041323_silver_union.sql
   -- supabase/migrations/20250608050012_yellow_art.sql
   -- supabase/migrations/20250608050025_mute_grove.sql
   -- supabase/migrations/20250608050032_misty_canyon.sql
   ```

### Step 3: Configure Authentication
1. Go to **Authentication** → **Settings**
2. **Site URL**: Set to your domain (e.g., `https://trustrx.com`)
3. **Redirect URLs**: Add your domain + `/dashboard`
4. **Email Templates**: Customize if needed
5. **Providers**: 
   - Enable **Email** (already enabled)
   - Enable **Google** (optional):
     - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
     - Add Client ID and Secret

### Step 4: Get Environment Variables
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep secret!)

## 2. 🔗 Algorand Integration

### Step 1: Install Algorand SDK
```bash
npm install algosdk
```

### Step 2: Get Algorand Node Access
**Option A: AlgoNode (Free)**
- MainNet: `https://mainnet-api.algonode.cloud`
- TestNet: `https://testnet-api.algonode.cloud`

**Option B: Purestake (Paid, more reliable)**
1. Go to [purestake.com](https://www.purestake.com)
2. Sign up for API access
3. Get your API key

### Step 3: Update Algorand Config
Replace the mock functions in `src/config/algorand.ts`:

```typescript
import algosdk from 'algosdk';

// Real Algorand configuration
const getAlgorandConfig = () => {
  return {
    server: process.env.VITE_ALGORAND_SERVER || 'https://testnet-api.algonode.cloud',
    port: 443,
    token: process.env.VITE_ALGORAND_TOKEN || '', // Empty for AlgoNode
    indexer: process.env.VITE_ALGORAND_INDEXER || 'https://testnet-idx.algonode.cloud'
  };
};

// Real wallet creation
export const createAlgorandWallet = () => {
  const account = algosdk.generateAccount();
  const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
  
  return {
    address: account.addr,
    privateKey: Buffer.from(account.sk).toString('hex'),
    mnemonic: mnemonic
  };
};

// Real blockchain storage
export const storeHashOnBlockchain = async (hash, userAddress, privateKey) => {
  try {
    const config = getAlgorandConfig();
    const algodClient = new algosdk.Algodv2(config.token, config.server, config.port);
    
    // Get transaction parameters
    const params = await algodClient.getTransactionParams().do();
    
    // Create transaction
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: userAddress,
      to: userAddress, // Send to self
      amount: 0, // 0 ALGO transaction
      note: new Uint8Array(Buffer.from(hash)),
      suggestedParams: params
    });
    
    // Sign transaction
    const privateKeyUint8 = new Uint8Array(Buffer.from(privateKey, 'hex'));
    const signedTxn = algosdk.signTransaction(txn, privateKeyUint8);
    
    // Submit transaction
    const { txId } = await algodClient.sendRawTransaction(signedTxn.blob).do();
    
    // Wait for confirmation
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    
    return { success: true, transactionId: txId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### Step 4: Auto-Funding Setup
For TestNet auto-funding, integrate with the official faucet:

```typescript
export const autoFundWallet = async (address) => {
  try {
    // Use Algorand TestNet Faucet
    const response = await fetch('https://testnet.algoexplorerapi.io/v1/faucet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    
    if (!response.ok) throw new Error('Faucet request failed');
    
    const data = await response.json();
    return {
      success: true,
      amount: 10,
      txId: data.txId
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

## 3. 🔐 Environment Variables

Create a `.env` file in your project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Algorand
VITE_ALGORAND_SERVER=https://testnet-api.algonode.cloud
VITE_ALGORAND_INDEXER=https://testnet-idx.algonode.cloud
VITE_ALGORAND_TOKEN=
# For Purestake (if using):
# VITE_ALGORAND_TOKEN=your-purestake-api-key

# hCaptcha (for production)
VITE_HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
HCAPTCHA_SECRET_KEY=your-hcaptcha-secret-key

# OpenAI (for chat support)
VITE_OPENAI_API_KEY=your-openai-api-key

# Hugging Face (alternative to OpenAI)
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

## 4. 🤖 hCaptcha Setup (Production CAPTCHA)

### Step 1: Get hCaptcha Keys
1. Go to [hcaptcha.com](https://www.hcaptcha.com)
2. Sign up for free account
3. Add your site domain
4. Get Site Key and Secret Key

### Step 2: Update Environment
Add to your `.env`:
```env
VITE_HCAPTCHA_SITE_KEY=your-real-site-key
HCAPTCHA_SECRET_KEY=your-secret-key
```

## 5. 💬 Chat Support Setup

### Option A: OpenAI (Recommended)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account and add billing
3. Generate API key
4. Add to `.env`: `VITE_OPENAI_API_KEY=your-key`

### Option B: Hugging Face (Free Alternative)
1. Go to [huggingface.co](https://huggingface.co)
2. Create account
3. Generate API token
4. Add to `.env`: `HUGGINGFACE_API_KEY=your-token`

## 6. 🚀 Deployment

### Option A: Netlify (Recommended)
1. Build your project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop your `dist` folder
4. Set environment variables in Netlify dashboard
5. Configure custom domain

### Option B: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Set environment variables in Vercel dashboard

### Option C: Traditional Hosting
1. Build: `npm run build`
2. Upload `dist` folder to your web server
3. Configure environment variables on server

## 7. 🔧 Production Optimizations

### Step 1: Update Supabase Config
In `src/config/supabase.ts`, ensure proper error handling:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### Step 2: Enable Row Level Security
Ensure all your Supabase tables have RLS enabled (already done in migrations).

### Step 3: Set up Edge Functions
Deploy the chat and security functions to Supabase:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy chat
supabase functions deploy security
```

## 8. 📊 Monitoring & Analytics

### Step 1: Supabase Analytics
- Monitor usage in Supabase dashboard
- Set up alerts for high usage

### Step 2: Error Tracking (Optional)
Add Sentry for error tracking:
```bash
npm install @sentry/react
```

## 9. 🔒 Security Checklist

- [ ] All environment variables are set
- [ ] RLS is enabled on all tables
- [ ] HTTPS is configured
- [ ] API keys are not exposed in frontend
- [ ] Rate limiting is configured
- [ ] Backup strategy is in place

## 10. 🧪 Testing Production Setup

### Step 1: Test Wallet Creation
1. Register a new account
2. Verify wallet is created
3. Check Algorand explorer for funding transaction

### Step 2: Test File Upload
1. Upload a medical record
2. Verify blockchain hash is stored
3. Check file is encrypted and stored

### Step 3: Test Chat Support
1. Open chat widget
2. Send a message
3. Verify AI response

## 🆘 Troubleshooting

### Common Issues:

**Supabase Connection Failed**
- Check URL and keys in `.env`
- Verify project is not paused
- Check network connectivity

**Algorand Transactions Failing**
- Verify wallet has sufficient ALGO
- Check network (TestNet vs MainNet)
- Verify node endpoint is accessible

**Chat Not Working**
- Check API keys
- Verify edge functions are deployed
- Check browser console for errors

## 📞 Support

If you need help:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check Algorand developer docs
4. Contact support at the respective services

---

## 🎉 You're Ready!

Once you've completed all steps, your TrustRx application will be fully functional in production with:
- ✅ Real Algorand blockchain integration
- ✅ Secure Supabase backend
- ✅ Auto-wallet creation and funding
- ✅ Production-grade security
- ✅ AI-powered chat support

Your users can now securely store medical records with blockchain verification!