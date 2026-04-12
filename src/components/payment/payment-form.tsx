"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface PaymentFormProps {
  orderId: string;
  defaultAmount?: number;
}

const paymentMethods = [
  {
    value: "BINANCE_PAY",
    label: "Binance Pay",
    icon: Wallet,
    description: "Pay with crypto via Binance",
    color: "yellow",
  },
  {
    value: "STRIPE",
    label: "Credit Card (Stripe)",
    icon: CreditCard,
    description: "Pay with credit/debit card",
    color: "blue",
  },
  {
    value: "PAYPAL",
    label: "PayPal",
    icon: Wallet,
    description: "Pay with PayPal",
    color: "cyan",
  },
];

export function PaymentForm({ orderId, defaultAmount = 0 }: PaymentFormProps) {
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [method, setMethod] = useState("BINANCE_PAY");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: parseFloat(amount),
          method,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentData(data.paymentData);

        // Redirect to payment page based on method
        if (method === "BINANCE_PAY" && data.paymentData.checkoutUrl) {
          window.open(data.paymentData.checkoutUrl, "_blank");
        }
      } else {
        setError(data.message || "Failed to create payment");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find((m) => m.value === method);

  if (paymentData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="glass-card border-white/10">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Payment Initiated!
            </h3>
            <p className="text-slate-400 mb-4">
              Your payment of {formatCurrency(parseFloat(amount))} has been
              initiated.
            </p>
            {method === "BINANCE_PAY" && paymentData.checkoutUrl && (
              <p className="text-sm text-slate-500 mb-4">
                A new tab has opened with Binance Pay. Please complete your
                payment there.
              </p>
            )}
            <Button
              onClick={() => {
                setPaymentData(null);
                setAmount("");
              }}
              variant="outline"
              className="glass-card"
            >
              Make Another Payment
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Make a Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-slate-300">Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="glass border-white/10 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.value} value={pm.value}>
                    <div className="flex items-center space-x-2">
                      <pm.icon className="w-4 h-4" />
                      <span>{pm.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedMethod && (
              <p className="text-xs text-slate-500">
                {selectedMethod.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                $
              </span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="glass border-white/10 bg-white/5 text-white placeholder:text-slate-500 pl-8"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white">
                {formatCurrency(parseFloat(amount) || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Processing Fee</span>
              <span className="text-white">
                {formatCurrency((parseFloat(amount) || 0) * 0.025)}
              </span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-white font-bold">
                {formatCurrency((parseFloat(amount) || 0) * 1.025)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {selectedMethod && (
                  <selectedMethod.icon className="mr-2 h-4 w-4" />
                )}
                Pay {formatCurrency((parseFloat(amount) || 0) * 1.025)}
              </>
            )}
          </Button>

          <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
            <Badge variant="outline" className="glass">
              SSL Secured
            </Badge>
            <Badge variant="outline" className="glass">
              Encrypted
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
