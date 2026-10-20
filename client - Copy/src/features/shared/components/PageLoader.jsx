const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-canvas">
    <div
      className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary"
      role="status"
      aria-label="Loading"
    />
  </div>
);

export default PageLoader;