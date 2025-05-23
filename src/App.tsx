import { RouterProvider } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// core styles are required for all packages
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import { toast } from "./components/ui/use-toast";
import { AdminProvider } from "./context/AdminContext";
import RouteErrorBoundary from "./layout/RouteErrorBoundary";
import { router } from "./routes/routerConfig";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
  }),
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <RouteErrorBoundary>
          {/* passing the router(page routes) to the RouterProvider */}
          <RouterProvider router={router} />
        </RouteErrorBoundary>
      </AdminProvider>
    </QueryClientProvider>
  );
}
