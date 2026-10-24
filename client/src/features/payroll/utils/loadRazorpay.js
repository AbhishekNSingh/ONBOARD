const SRC = "https://checkout.razorpay.com/v1/checkout.js";
let loading = null;

// loads Razorpay's script once, and resolves true when it's ready
export const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SRC;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loading = null; // let the next attempt try again
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loading;
};