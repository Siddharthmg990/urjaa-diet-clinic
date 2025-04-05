
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CreditCard, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "$49.99",
    interval: "monthly",
    features: [
      "1 dietitian consultation per month",
      "Basic meal planning",
      "Weekly check-ins via email",
      "Access to basic recipes"
    ],
    recommended: false
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "$89.99",
    interval: "monthly",
    features: [
      "2 dietitian consultations per month",
      "Personalized meal planning",
      "Weekly check-ins via phone or video",
      "Access to premium recipes",
      "Nutritional analysis",
      "24/7 messaging support"
    ],
    recommended: true
  },
  {
    id: "family",
    name: "Family Plan",
    price: "$129.99",
    interval: "monthly",
    features: [
      "4 dietitian consultations per month",
      "Personalized meal planning for up to 4 family members",
      "Weekly check-ins via phone or video",
      "Access to all premium recipes",
      "Detailed nutritional analysis",
      "Priority 24/7 support",
      "Quarterly progress reports"
    ],
    recommended: false
  }
];

const PaymentPage = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentDialog(true);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentDialog(false);
      
      toast({
        title: "Subscription Activated",
        description: `Your ${subscriptionPlans.find(plan => plan.id === selectedPlan)?.name} has been activated successfully!`,
      });
    }, 2000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-nourish-dark mb-2">Subscription Plans</h1>
      <p className="text-gray-600 mb-6">
        Choose a plan that best fits your nutrition and wellness needs
      </p>
      
      {/* Current Subscription Status Alert */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              You currently don't have an active subscription plan. Subscribe to a plan to get personalized nutrition guidance.
            </p>
          </div>
        </div>
      </div>
      
      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`${
              plan.recommended 
                ? 'border-nourish-primary shadow-lg relative' 
                : 'border-gray-200'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-0 right-0 mx-auto w-max px-3 py-1 bg-nourish-primary text-white text-xs rounded">
                RECOMMENDED
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-nourish-dark">{plan.price}</span>
                <span className="text-gray-500">/{plan.interval}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-nourish-primary shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full ${
                  plan.recommended 
                    ? 'bg-nourish-primary hover:bg-nourish-dark' 
                    : 'bg-nourish-secondary hover:bg-nourish-primary'
                }`}
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <span>
                  You're subscribing to the {subscriptionPlans.find(plan => plan.id === selectedPlan)?.name} ({subscriptionPlans.find(plan => plan.id === selectedPlan)?.price}/{subscriptionPlans.find(plan => plan.id === selectedPlan)?.interval})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Method</h3>
              <RadioGroup 
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="creditCard" id="creditCard" />
                  <Label htmlFor="creditCard" className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Credit or Debit Card
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Card Information</h3>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input id="nameOnCard" placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Billing Information</h3>
              <div>
                <Label htmlFor="address">Billing Address</Label>
                <Input id="address" placeholder="123 Main St" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" placeholder="12345" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" />
                </div>
              </div>
            </div>

            <div className="rounded-md bg-gray-50 p-4 text-sm">
              <p className="font-medium mb-1">Subscription Terms</p>
              <p className="text-gray-500">
                By subscribing, you agree to our terms of service. You can cancel your subscription at any time from your account settings.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProcessPayment} 
              className="bg-nourish-primary hover:bg-nourish-dark"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Complete Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment History Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-nourish-dark">Payment History</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-500 mb-1">No payment history</h3>
              <p className="text-gray-400 text-sm">
                Your payment history will appear here once you've subscribed to a plan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
