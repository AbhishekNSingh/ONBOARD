import { useCallback } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { usePayroll } from "./usePayroll";
import {
  createPaymentOrder,
  verifyPaymentOrder,
  cancelPaymentOrder,
} from "../services/payroll.api";
import { loadRazorpay } from "../utils/loadRazorpay";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";

export const useRazorpayPayment = () => {
  const { user } = useAuth();
  const { loadEmployeePayroll } = usePayroll();

  // resolves with a success message, or throws a sentence the form can show
  const pay = useCallback(
    async ({ employeeId, month, amount, note }) => {
      let order;
      try {
        order = await createPaymentOrder({ employeeId, month, amount, note });
      } catch (err) {
        throw getErrorMessage(err);
      }

      const ready = await loadRazorpay();
      if (!ready) {
        await cancelPaymentOrder(order.orderId).catch(() => {});
        throw "Couldn't load the payment window. Check your connection.";
      }

      return new Promise((resolve, reject) => {
        let finished = false;

        const razorpayWindow = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "Onboard",
          description: `Salary for ${month}`,
          prefill: { name: user?.name, email: user?.email, contact: user?.contact },
          theme: { color: "#1F6F68" },

          // the payer paid: send the proof to our server to check
          handler: async (response) => {
            finished = true;
            try {
              const data = await verifyPaymentOrder(response);
              await loadEmployeePayroll(employeeId, month);
              resolve(data.message);
            } catch (err) {
              reject(getErrorMessage(err));
            }
          },

          // the payer closed the window
          modal: {
            ondismiss: async () => {
              if (finished) return;
              finished = true;
              await cancelPaymentOrder(order.orderId).catch(() => {});
              await loadEmployeePayroll(employeeId, month);
              reject("Payment cancelled. Nothing was charged.");
            },
          },
        });

        razorpayWindow.open();
      });
    },
    [user, loadEmployeePayroll]
  );

  return { pay };
};