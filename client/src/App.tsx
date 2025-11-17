import { Switch, Route } from "wouter";
// Importamos useHashLocation para forzar el enrutamiento a usar el símbolo '#'
import { useHashLocation } from "wouter/use-hash-location"; 
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import Home from "@/pages/home";
import TournamentNew from "@/pages/tournament-new";
import TournamentView from "@/pages/tournament-view";
import NotFound from "@/pages/not-found";

/**
 * Componente que maneja todas las rutas de la aplicación.
 * Utiliza useHashLocation para asegurar compatibilidad con servidores estáticos (como GitHub Pages).
 */
function Router() {
  // El error 404 se corrige al usar useHashLocation() en lugar del enrutamiento por defecto (History API).
  const [location, navigate] = useHashLocation();
    
  return (
    // Es crucial pasar 'location' al Switch para que use la ubicación del hash.
    <Switch location={location}> 
      <Route path="/" component={Home} />
      <Route path="/tournaments/new" component={TournamentNew} />
      <Route path="/tournaments/:id" component={TournamentView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;