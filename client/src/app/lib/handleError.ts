import toast from "react-hot-toast";
import axios from "axios";

export function handleError(
  error: unknown,
  defaultMessage = "Something went wrong"
) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || defaultMessage;

    // ✅ You can switch based on status if you want
    switch (status) {
      case 400:
        toast.error(message || "Bad request");
        break;
      case 401:
        toast.error(message || "Unauthorized. Please login again.");
        break;
      case 404:
        toast.error(message || "Not found");
        break;
      case 500:
        toast.error("Server error. Please try again later.");
        break;
      default:
        toast(message || "Something went wrong", {
          icon: "❌", // optional: error-like icon
          style: {
            background: "#D32F2F", // deep red, similar to error
            color: "#fff",
            fontWeight: "500",
          },
          duration: 3000,
        });
    }
  } else {
    toast.error(defaultMessage);
    console.error("Unexpected error:", error);
  }
}
