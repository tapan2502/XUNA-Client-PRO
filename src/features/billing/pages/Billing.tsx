"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Progress,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAppSelector } from "@/app/hooks";
import { selectEffectiveUser } from "@/store/authSlice";
import { auth } from "@/lib/firebase"; // Import auth directly for token retrieval
import {
  getCustomerId,
  createUserInFirebase,
  setupPaymentMethod,
  checkPaymentMethodSetup,
  setupOneTimeTopUp,
  getUsageDetails,
  getUserInvoices,
} from "../services/billingApi";

import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";

export default function Billing() {
  const user = useAppSelector(selectEffectiveUser);

  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string>("");
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [balanceDetails, setBalanceDetails] = useState({ currentBalance: 0, totalUsage: 0, balance: 0 });
  const [invoices, setInvoices] = useState<{ paid: any[]; unpaid: any[] }>({ paid: [], unpaid: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    console.log("[Billing] Setting up listeners for user:", user.uid);

    // 1. Listen for User Profile updates (Balance & CustomerId)
    const unsubscribeUser = onSnapshot(doc(db, "users", user.uid), async (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            const id = data.stripeCustomerId;
            
            // Standardize field calculation with fallback to 0
            // If fields are missing (undefined), treat as 0
            const totalCredits = data.creditsToAdd || 0;
            const usageCents = data.usage || 0;
            const totalUsage = usageCents / 100;

            console.log("[Billing] Data Loaded:", { 
                uid: user.uid,
                totalCredits, 
                totalUsage,
                currentBalance: totalCredits - totalUsage
            });

            setBalanceDetails({
                currentBalance: totalCredits - totalUsage,
                totalUsage: totalUsage,
                balance: totalCredits
            });

            if (id) {
                setCustomerId(id);
                // Check PM status separately as it's a backend call
                const pmStatus = await checkPaymentMethodSetup(id);
                setHasPaymentMethod(pmStatus?.hasValidPaymentMethod || false);
            } else if (user.email) {
               createUserInFirebase(user.email, user.uid);
            }
        }
        setLoading(false);
    }, (err) => {
        console.error("User listener error:", err);
        setError("Failed to sync user data.");
    });

    // 2. Listen for Invoices/History updates (without orderBy to avoid query errors)
    const invoicesRef = collection(db, "users", user.uid, "invoices");

    const unsubscribeInvoices = onSnapshot(invoicesRef, (snap) => {
        console.log(`[Billing] Invoices updated: ${snap.size} documents`);
        const paid: any[] = [];
        const unpaid: any[] = [];
        snap.forEach((doc) => {
            const data = doc.data();
            const inv = { id: doc.id, ...data };
            console.log("[Billing] Invoice:", inv);
            if (data.invoiceStatus === "paid") paid.push(inv);
            else if (data.invoiceStatus !== "cleared") unpaid.push(inv);
        });
        
        // Sort by paidAt client-side
        paid.sort((a, b) => {
            const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0;
            const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0;
            return dateB - dateA;
        });
        
        setInvoices({ paid, unpaid });
    }, (err) => {
        console.error("Invoices listener error:", err);
    });

    return () => {
        unsubscribeUser();
        unsubscribeInvoices();
    };
  }, [user]);

  const handleTopUp = async () => {
    if (!user || !customerId) {
        console.warn("[Billing] Cannot Top Up: User or CustomerId missing", { user: !!user, customerId });
        return;
    }
    setIsProcessing(true);
    try {
      await setupOneTimeTopUp(user.uid, 50, customerId, user.email || "");
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPayment = async () => {
    if (!user || !customerId) {
        console.warn("[Billing] Cannot Add Payment: User or CustomerId missing", { user: !!user, customerId });
        return;
    }
    setIsProcessing(true);
    try {
      await setupPaymentMethod(user.uid, user.email || "", customerId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Progress isIndeterminate className="max-w-md" color="primary" label="Loading Billing Details..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Billing & Usage</h1>
        <p className="text-default-500">Manage your subscription, credits, and invoices.</p>
        {error && <p className="text-danger font-medium mt-2">Error: {error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="bg-primary/5 border-primary/20" shadow="sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Icon icon="solar:wallet-bold" width={24} />
              </div>
              <Chip color="primary" variant="flat">Current Credits</Chip>
            </div>
            <p className="text-sm font-medium text-default-600">Available Balance</p>
            <h2 className="text-4xl font-bold mt-1 text-primary">${balanceDetails.currentBalance.toFixed(2)}</h2>
            <Button 
                className="mt-6 w-full font-bold" 
                color="primary" 
                variant="shadow"
                onPress={handleTopUp}
                isLoading={isProcessing}
                isDisabled={!customerId}
            >
              Top Up $50
            </Button>
          </CardBody>
        </Card>

        {/* Usage Card */}
        <Card shadow="sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-success/10 rounded-xl text-success">
                <Icon icon="solar:chart-2-bold" width={24} />
              </div>
              <Chip color="success" variant="flat">Utility</Chip>
            </div>
            <p className="text-sm font-medium text-default-600">Total Month Usage</p>
            <h2 className="text-4xl font-bold mt-1">${balanceDetails.totalUsage.toFixed(2)}</h2>
            <div className="mt-6">
                <Progress 
                    size="sm" 
                    value={(balanceDetails.totalUsage / (balanceDetails.balance || 1)) * 100} 
                    color="success" 
                    label="Credits Utilization"
                />
            </div>
          </CardBody>
        </Card>

        {/* Payment Method Card */}
        <Card shadow="sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-warning/10 rounded-xl text-warning">
                <Icon icon="solar:card-2-bold" width={24} />
              </div>
              <Chip color={hasPaymentMethod ? "success" : "warning"} variant="flat">
                {hasPaymentMethod ? "Active" : "Required"}
              </Chip>
            </div>
            <p className="text-sm font-medium text-default-600">Payment Status</p>
            <p className="mt-2 text-default-500 text-sm">
              {hasPaymentMethod 
                ? "Your default payment method is active." 
                : "Add a payment method to ensure uninterrupted service."}
            </p>
            <Button 
                className="mt-6 w-full font-bold" 
                variant="flat" 
                color={hasPaymentMethod ? "default" : "warning"}
                onPress={handleAddPayment}
                isLoading={isProcessing}
                isDisabled={!customerId}
            >
              {hasPaymentMethod ? "Update Card" : "Add Payment Method"}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Unpaid Alerts */}
      {invoices.unpaid.length > 0 && (
          <Card className="border-danger-200 bg-danger-50 dark:bg-danger-900/10">
              <CardBody className="p-4 flex flex-row items-center gap-4">
                  <Icon icon="solar:danger-bold" className="text-danger" width={28} />
                  <div className="flex-1">
                      <p className="font-bold text-danger">Action Required: Unpaid Invoices</p>
                      <p className="text-sm text-danger/80">You have {invoices.unpaid.length} pending invoice(s) that require your attention.</p>
                  </div>
              </CardBody>
          </Card>
      )}

      {/* Invoice History */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Transaction History</h3>
        <Card shadow="sm">
          <Table aria-label="Invoice history table" shadow="none">
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>DESCRIPTION</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTION</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No transactions found.">
              {[...invoices.unpaid, ...invoices.paid].map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="text-sm">
                      {inv.paidAt 
                        ? new Date(inv.paidAt).toLocaleDateString() 
                        : inv.id.length > 10 ? "Recent" : inv.id}
                  </TableCell>
                  <TableCell className="font-medium">
                      {inv.description || (inv.type === "topup" ? "Credits Top-up" : "Usage Invoice")}
                  </TableCell>
                  <TableCell>${((inv.totalCost || 0) / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                        size="sm" 
                        color={inv.invoiceStatus === "paid" ? "success" : "danger"} 
                        variant="flat"
                        className="capitalize"
                    >
                      {inv.invoiceStatus || "Unpaid"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {inv.stripeUrl && (
                      <Button 
                        as="a" 
                        href={inv.stripeUrl} 
                        target="_blank" 
                        size="sm" 
                        variant="light" 
                        color="primary"
                        startContent={<Icon icon="solar:download-minimalistic-linear" />}
                      >
                        {inv.invoiceStatus === "paid" ? "Receipt" : "Pay Now"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
