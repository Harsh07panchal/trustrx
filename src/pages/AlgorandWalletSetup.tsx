import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Smartphone,
  Globe,
  Shield,
  Coins,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { createAlgorandWallet, getAccountBalance } from '../config/algorand';

const AlgorandWalletSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [walletData, setWalletData] = useState<{
    address: string;
    privateKey: string;
    mnemonic: string;
  } | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateWallet = async () => {
    setIsGenerating(true);
    // Simulate wallet generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const wallet = createAlgorandWallet();
    setWalletData(wallet);
    setIsGenerating(false);
    setCurrentStep(2);
  };

  const checkBalance = async () => {
    if (walletData) {
      const bal = await getAccountBalance(walletData.address);
      setBalance(bal);
    }
  };

  useEffect(() => {
    if (walletData && currentStep >= 4) {
      checkBalance();
    }
  }, [walletData, currentStep]);

  const steps = [
    {
      title: "Choose Wallet Type",
      description: "Select how you want to create your Algorand wallet"
    },
    {
      title: "Generate Wallet",
      description: "Create your new Algorand wallet securely"
    },
    {
      title: "Secure Your Wallet",
      description: "Save your private key and mnemonic phrase"
    },
    {
      title: "Get Test Tokens",
      description: "Fund your wallet with test ALGO tokens"
    },
    {
      title: "Connect to TrustRx",
      description: "Link your wallet to the platform"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Algorand Wallet Setup</h1>
          <p className="text-xl text-neutral-600">
            Set up your Algorand wallet to enable blockchain verification on TrustRx
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep > index + 1 
                    ? 'bg-success-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                  }
                `}>
                  {currentStep > index + 1 ? <CheckCircle size={20} /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${currentStep > index + 1 ? 'bg-success-500' : 'bg-neutral-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{steps[currentStep - 1].title}</h2>
            <p className="text-neutral-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold mb-6">Choose Your Wallet Option</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Official Algorand Wallet */}
                <div className="border-2 border-neutral-200 rounded-lg p-6 hover:border-primary-300 transition-colors">
                  <div className="flex items-center mb-4">
                    <Smartphone className="h-8 w-8 text-primary-500 mr-3" />
                    <h4 className="text-lg font-semibold">Official Algorand Wallet</h4>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    Download the official Algorand Wallet mobile app for the most secure experience.
                  </p>
                  <div className="space-y-2 mb-4">
                    <a 
                      href="https://apps.apple.com/app/algorand-wallet/id1459898525"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Download for iOS
                    </a>
                    <a 
                      href="https://play.google.com/store/apps/details?id=com.algorand.android"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Download for Android
                    </a>
                  </div>
                  <button 
                    className="btn-outline w-full"
                    onClick={() => setCurrentStep(4)}
                  >
                    I Have the App
                  </button>
                </div>

                {/* Web-based Demo Wallet */}
                <div className="border-2 border-primary-300 rounded-lg p-6 bg-primary-50">
                  <div className="flex items-center mb-4">
                    <Globe className="h-8 w-8 text-primary-500 mr-3" />
                    <h4 className="text-lg font-semibold">Demo Wallet (Recommended)</h4>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    Generate a test wallet for demonstration purposes. Perfect for trying out TrustRx features.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        This is for testing only. Don't use for real funds.
                      </p>
                    </div>
                  </div>
                  <button 
                    className="btn-primary w-full"
                    onClick={generateWallet}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="animate-spin mr-2" size={16} />
                        Generating...
                      </>
                    ) : (
                      'Generate Demo Wallet'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && walletData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Wallet Generated Successfully!</h3>
                <p className="text-neutral-600">Your Algorand test wallet has been created.</p>
              </div>

              <div className="bg-neutral-50 rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Wallet className="mr-2" size={20} />
                  Wallet Information
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Wallet Address
                    </label>
                    <div className="flex items-center">
                      <code className="flex-1 bg-white p-3 rounded border text-sm font-mono break-all">
                        {walletData.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(walletData.address, 'address')}
                        className="ml-2 p-2 text-neutral-500 hover:text-primary-500"
                      >
                        {copied === 'address' ? <CheckCircle size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary w-full"
                onClick={() => setCurrentStep(3)}
              >
                Continue to Security Setup
                <ArrowRight className="ml-2" size={16} />
              </button>
            </motion.div>
          )}

          {currentStep === 3 && walletData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-error-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-error-700">Important Security Information</h4>
                    <p className="text-sm text-error-600 mt-1">
                      Save your private key and mnemonic phrase securely. You'll need them to access your wallet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Private Key (Keep this secret!)
                  </label>
                  <div className="flex items-center">
                    <code className="flex-1 bg-neutral-100 p-3 rounded border text-sm font-mono">
                      {walletData.privateKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(walletData.privateKey, 'private')}
                      className="ml-2 p-2 text-neutral-500 hover:text-primary-500"
                    >
                      {copied === 'private' ? <CheckCircle size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mnemonic Phrase (Backup recovery phrase)
                  </label>
                  <div className="flex items-center">
                    <code className="flex-1 bg-neutral-100 p-3 rounded border text-sm">
                      {walletData.mnemonic}
                    </code>
                    <button
                      onClick={() => copyToClipboard(walletData.mnemonic, 'mnemonic')}
                      className="ml-2 p-2 text-neutral-500 hover:text-primary-500"
                    >
                      {copied === 'mnemonic' ? <CheckCircle size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-700 mb-2">Security Checklist</h4>
                <ul className="text-sm text-amber-600 space-y-1">
                  <li>✓ Copy and save your private key in a secure location</li>
                  <li>✓ Write down your mnemonic phrase on paper</li>
                  <li>✓ Never share these credentials with anyone</li>
                  <li>✓ Store backups in multiple secure locations</li>
                </ul>
              </div>

              <button 
                className="btn-primary w-full"
                onClick={() => setCurrentStep(4)}
              >
                I've Secured My Wallet
                <ArrowRight className="ml-2" size={16} />
              </button>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold mb-6">Get Test ALGO Tokens</h3>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Coins className="h-6 w-6 text-primary-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-primary-700 mb-2">Algorand TestNet Faucet</h4>
                    <p className="text-primary-600 mb-4">
                      Get free test ALGO tokens to use with TrustRx. These tokens have no real value and are only for testing.
                    </p>
                    
                    {walletData && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-primary-700 mb-2">
                          Your Wallet Address:
                        </label>
                        <code className="block bg-white p-2 rounded border text-sm font-mono break-all">
                          {walletData.address}
                        </code>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <a
                        href="https://testnet.algoexplorer.io/dispenser"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center"
                      >
                        <ExternalLink className="mr-2" size={16} />
                        Open TestNet Faucet
                      </a>
                      
                      <div className="text-sm text-primary-600">
                        <p className="font-medium mb-2">Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Click the link above to open the Algorand TestNet faucet</li>
                          <li>Paste your wallet address in the faucet</li>
                          <li>Complete the CAPTCHA verification</li>
                          <li>Click "Dispense" to receive 10 test ALGO tokens</li>
                          <li>Wait a few seconds for the transaction to confirm</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {walletData && (
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Wallet Balance</h4>
                    <button
                      onClick={checkBalance}
                      className="btn-ghost text-sm"
                    >
                      <RefreshCw size={16} className="mr-1" />
                      Refresh
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-500 mb-2">
                      {balance !== null ? `${(balance / 1000000).toFixed(6)} ALGO` : 'Loading...'}
                    </div>
                    <p className="text-sm text-neutral-500">
                      {balance !== null ? `${balance} microALGOs` : 'Checking balance...'}
                    </p>
                  </div>
                </div>
              )}

              <button 
                className="btn-primary w-full"
                onClick={() => setCurrentStep(5)}
              >
                Continue to Connection
                <ArrowRight className="ml-2" size={16} />
              </button>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center"
            >
              <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Setup Complete!</h3>
              <p className="text-neutral-600">
                Your Algorand wallet is now ready to use with TrustRx. All your medical records will be verified on the blockchain.
              </p>

              <div className="bg-success-50 border border-success-200 rounded-lg p-6">
                <h4 className="font-semibold text-success-700 mb-4">What happens next?</h4>
                <ul className="text-left text-success-600 space-y-2">
                  <li>✓ Upload medical records with automatic blockchain verification</li>
                  <li>✓ Each file gets a unique hash stored on Algorand</li>
                  <li>✓ Verify authenticity of any record anytime</li>
                  <li>✓ Share verified records securely with doctors</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button 
                  className="btn-outline flex-1"
                  onClick={() => window.open('/patient/records', '_blank')}
                >
                  Upload Records
                </button>
                <button 
                  className="btn-primary flex-1"
                  onClick={() => window.close()}
                >
                  Return to TrustRx
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold mb-6">Additional Resources</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Globe className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Algorand Explorer</h4>
              <p className="text-sm text-neutral-600 mb-3">
                View transactions and verify your records on the blockchain
              </p>
              <a
                href="https://testnet.algoexplorer.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Visit Explorer →
              </a>
            </div>

            <div className="text-center">
              <Download className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Official Wallet</h4>
              <p className="text-sm text-neutral-600 mb-3">
                Download the official Algorand Wallet for mobile
              </p>
              <a
                href="https://algorandwallet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Get Wallet →
              </a>
            </div>

            <div className="text-center">
              <Shield className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Security Guide</h4>
              <p className="text-sm text-neutral-600 mb-3">
                Learn best practices for wallet security
              </p>
              <a
                href="https://developer.algorand.org/docs/get-started/basics/why_algorand/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorandWalletSetup;