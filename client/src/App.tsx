import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/Layout";
import MemoryLane from "@/pages/MemoryLane";
import MemoryView from "@/pages/MemoryView";
import VirtualHugs from "@/pages/VirtualHugs";
import VideoCall from "@/pages/VideoCall";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={MemoryLane} />
        <Route path="/memory/:token" component={MemoryView} />
        <Route path="/hugs" component={VirtualHugs} />
        <Route path="/call" component={VideoCall} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
