import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { http } from "@/lib/http";

// Creating user in Firestore
export const createUserInFirebase = async (
    email: string,
    userId: string
): Promise<string | null> => {
    try {
        const response = await http.post("/payment/create-customer", { email });
        const stripeData = response.data;
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            stripeCustomerId: stripeData.customerId,
            creditsToAdd: 0,
            usage: 0,
            billing: {
                stripeCustomerId: stripeData.customerId,
                updatedAt: new Date().toISOString()
            }
        }, { merge: true });
        return stripeData.customerId;
    } catch (error) {
        console.error("Error creating customer:", error);
        return null;
    }
};

// Fetching customerId
export const getCustomerId = async (userId: string): Promise<string | null> => {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        return userDoc.exists() ? userDoc.data().stripeCustomerId : null;
    } catch (error) {
        console.error("Error retrieving Stripe customer ID:", error);
        return null;
    }
};

// Setting up payment method
export const setupPaymentMethod = async (
    userId: string,
    email: string,
    customerId: string
): Promise<string | null> => {
    try {
        const response = await http.post("/payment/setup-subscription-payment-method", {
            userId,
            email,
            customerId,
            return_url: window.location.origin + "/billing",
        });
        const data = response.data;
        window.location.href = data.sessionUrl;
        return data.sessionId;
    } catch (error) {
        console.error("Error setting up payment:", error);
        return null;
    }
};

export const checkPaymentMethodSetup = async (customerId: string): Promise<any> => {
    try {
        const response = await http.get(`/payment/check-payment-method-setup?customerId=${customerId}`);
        return response.data;
    } catch (error) {
        console.error("Error checking payment method setup:", error);
        return { success: false };
    }
};

// Top-up
export const setupOneTimeTopUp = async (
    userId: string,
    amount: number,
    customerId: string,
    email: string
): Promise<void> => {
    try {
        const response = await http.post("/payment/create-topup-session", {
            userId,
            amount,
            customerId,
            email,
            return_url: `${window.location.origin}/billing`,
        });
        const data = response.data;
        window.location.href = data.sessionUrl;
    } catch (error) {
        console.error("Error creating top-up session:", error);
        throw error;
    }
};

// Usage and Balance
export const getUsageDetails = async (userId: string) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return { currentBalance: 0, totalUsage: 0, balance: 0 };
        const data = userSnap.data();

        // Match backend naming: creditsToAdd and usage
        const totalCredits = data.creditsToAdd || 0;
        const totalUsage = (data.usage || 0) / 100;

        return {
            currentBalance: totalCredits - totalUsage,
            totalUsage: totalUsage,
            balance: totalCredits,
        };
    } catch (error) {
        console.error("Error fetching usage details:", error);
        return { currentBalance: 0, totalUsage: 0, balance: 0 };
    }
};

export const getUserInvoices = async (userId: string) => {
    try {
        const invoicesRef = collection(db, "users", userId, "invoices");
        const invoicesSnap = await getDocs(invoicesRef);
        const paid: any[] = [];
        const unpaid: any[] = [];
        invoicesSnap.forEach((doc) => {
            const data = doc.data();
            const inv = { id: doc.id, ...data };
            if (data.invoiceStatus === "paid") paid.push(inv);
            else if (data.invoiceStatus !== "cleared") unpaid.push(inv);
        });
        return { paid, unpaid };
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return { paid: [], unpaid: [] };
    }
};

export const payInvoice = async (userId: string, monthKey: string) => {
    try {
        const response = await http.post("/payment/invoice-payment", { userId, monthKey });
        return response.data;
    } catch (error) {
        console.error("Error paying invoice:", error);
        return { success: false };
    }
};
