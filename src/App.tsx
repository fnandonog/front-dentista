import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <div className="min-h-screen bg-white font-main text-neutral-dark selection:bg-primary-light selection:text-primary-main">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;