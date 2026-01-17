import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Progress,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectEffectiveUser } from "@/store/authSlice";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import XunaTable, { type XunaTableColumn } from "@/components/hero-ui/XunaTable";
import {
  setCustomerId,
  setBalanceDetails,
  setInvoices,
  setLoading,
  setError,
  checkPaymentMethodSetup,
  setupPaymentMethod,
  setupOneTimeTopUp,
} from "@/store/billingSlice";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";

const columns: XunaTableColumn[] = [
  { uid: "date", name: "Date", sortable: true },
  { uid: "description", name: "Description" },
  { uid: "amount", name: "Amount", sortable: true },
  { uid: "status", name: "Status" },
  { uid: "actions", name: "Action" },
];

export default function Billing() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectEffectiveUser);
  const {
    customerId,
    hasPaymentMethod,
    balanceDetails,
    invoices,
    loading,
    isProcessing,
    error,
  } = useAppSelector((state) => state.billing);

  useEffect(() => {
    if (!user) return;

    console.log("[Billing] Setting up listeners for user:", user.uid);

    // 1. Listen for User Profile updates (Balance & CustomerId)
    const unsubscribeUser = onSnapshot(
      doc(db, "users", user.uid),
      async (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const id = data.stripeCustomerId;

          // Standardize field calculation with fallback to 0
          const totalCredits = data.creditsToAdd || 0;
          const usageCents = data.usage || 0;
          const totalUsage = usageCents / 100;

          dispatch(
            setBalanceDetails({
              currentBalance: totalCredits - totalUsage,
              totalUsage: totalUsage,
              balance: totalCredits,
            })
          );

          if (id) {
            dispatch(setCustomerId(id));
            dispatch(checkPaymentMethodSetup(id));
          } else {
             // Customer creation happens via cloud function usually, or previous API loop
             // For now we assume customer exists or is created elsewhere if not present
          }
        }
        dispatch(setLoading(false));
      },
      (err) => {
        console.error("User listener error:", err);
        dispatch(setError("Failed to sync user data."));
      }
    );

    // 2. Listen for Invoices/History updates
    const invoicesRef = collection(db, "users", user.uid, "invoices");

    const unsubscribeInvoices = onSnapshot(
      invoicesRef,
      (snap) => {
        console.log(`[Billing] Invoices updated: ${snap.size} documents`);
        const paid: any[] = [];
        const unpaid: any[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          const inv = { id: doc.id, ...data };
          if (data.invoiceStatus === "paid") paid.push(inv);
          else if (data.invoiceStatus !== "cleared") unpaid.push(inv);
        });

        // Sort by paidAt client-side
        paid.sort((a, b) => {
          const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0;
          const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0;
          return dateB - dateA;
        });

        dispatch(setInvoices({ paid, unpaid }));
      },
      (err) => {
        console.error("Invoices listener error:", err);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeInvoices();
    };
  }, [user, dispatch]);

  const handleTopUp = async () => {
    if (!user || !customerId) {
      console.warn("[Billing] Cannot Top Up: User or CustomerId missing");
      return;
    }
    dispatch(
      setupOneTimeTopUp({
        userId: user.uid,
        amount: 50,
        customerId,
        email: user.email || "",
      })
    );
  };

  const handleAddPayment = async () => {
    if (!user || !customerId) {
      console.warn("[Billing] Cannot Add Payment: User or CustomerId missing");
      return;
    }
    dispatch(
      setupPaymentMethod({
        userId: user.uid,
        email: user.email || "",
        customerId,
      })
    );
  };

  const renderCell = (item: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "date":
        return (
          <span className="text-sm">
            {item.paidAt
              ? new Date(item.paidAt).toLocaleDateString()
              : item.id.length > 10
              ? "Recent"
              : item.id}
          </span>
        );
      case "description":
        return (
          <span className="font-medium">
            {item.description ||
              (item.type === "topup" ? "Credits Top-up" : "Usage Invoice")}
          </span>
        );
      case "amount":
        return <span>${((item.totalCost || 0) / 100).toFixed(2)}</span>;
      case "status":
        return (
          <Chip
            size="sm"
            color={item.invoiceStatus === "paid" ? "success" : "danger"}
            variant="flat"
            className="capitalize"
          >
            {item.invoiceStatus || "Unpaid"}
          </Chip>
        );
      case "actions":
        return (
          item.stripeUrl && (
            <Button
              as="a"
              href={item.stripeUrl}
              target="_blank"
              size="sm"
              variant="light"
              color="primary"
              startContent={<Icon icon="solar:download-minimalistic-linear" />}
            >
              {item.invoiceStatus === "paid" ? "Receipt" : "Pay Now"}
            </Button>
          )
        );
      default:
        return item[columnKey as keyof typeof item];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner text="Loading Billing Details..." />
      </div>
    );
  }

  const tableData = [...invoices.unpaid, ...invoices.paid];

  return (
    <div className="flex flex-col gap-12 p-10 h-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold">Billing & Usage</h1>
        <p className="text-default-500">
          Manage your subscription, credits, and invoices.
        </p>
        {error && <p className="text-danger font-medium mt-2">Error: {error}</p>}
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        {/* Balance Card */}
        <Card className="bg-primary/5 border-primary/20" shadow="sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Icon icon="solar:wallet-bold" width={24} />
              </div>
              <Chip color="primary" variant="flat">
                Current Credits
              </Chip>
            </div>
            <p className="text-sm font-medium text-default-600">
              Available Balance
            </p>
            <h2 className="text-4xl font-bold mt-1 text-primary">
              ${balanceDetails.currentBalance.toFixed(2)}
            </h2>
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
              <Chip color="success" variant="flat">
                Utility
              </Chip>
            </div>
            <p className="text-sm font-medium text-default-600">
              Total Month Usage
            </p>
            <h2 className="text-4xl font-bold mt-1">
              ${balanceDetails.totalUsage.toFixed(2)}
            </h2>
            <div className="mt-6">
              <Progress
                size="sm"
                value={
                  (balanceDetails.totalUsage /
                    (balanceDetails.balance || 1)) *
                  100
                }
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
              <Chip
                color={hasPaymentMethod ? "success" : "warning"}
                variant="flat"
              >
                {hasPaymentMethod ? "Active" : "Required"}
              </Chip>
            </div>
            <p className="text-sm font-medium text-default-600">
              Payment Status
            </p>
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
        <div className="shrink-0">
          <Card className="border-danger-200 bg-danger-50 dark:bg-danger-900/10">
            <CardBody className="p-4 flex flex-row items-center gap-4">
              <Icon
                icon="solar:danger-bold"
                className="text-danger"
                width={28}
              />
              <div className="flex-1">
                <p className="font-bold text-danger">
                  Action Required: Unpaid Invoices
                </p>
                <p className="text-sm text-danger/80">
                  You have {invoices.unpaid.length} pending invoice(s) that require
                  your attention.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Invoice History */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <XunaTable
          columns={columns}
          data={tableData}
          renderCell={renderCell}
          initialVisibleColumns={[
            "date",
            "description",
            "amount",
            "status",
            "actions",
          ]}
          searchKeys={["description"]}
          searchPlaceholder="Search transactions..."
          topBarTitle="Transaction History"
          topBarCount={tableData.length}
          emptyContent="No transactions found."
          justifyEndColumns={false}
          rowsPerPage={5}
        />
      </div>
    </div>
  );
}


