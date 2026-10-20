export const getErrorMessage = (err) => {
  if (!err.response) {
    return "Can't reach the server. Check your connection and try again.";
  }

  const data = err.response.data;

  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors[0].msg;

  return "Something went wrong. Please try again.";
};