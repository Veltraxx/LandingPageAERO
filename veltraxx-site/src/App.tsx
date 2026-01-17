import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Menu, X, Wind, Shield, Activity, Feather, Mountain, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';

/**
 * Hook para detectar quando um elemento entra na tela (Intersection Observer)
 */
const useElementOnScreen = (options: IntersectionObserverInit): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

/**
 * Componente Wrapper para animar elementos ao entrar na tela
 */
interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Ref para a seção Lifestyle para cálculo preciso do parallax
  const lifestyleRef = useRef<HTMLElement>(null);
  const [lifestyleOffset, setLifestyleOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    
    const handleResize = () => {
      if (lifestyleRef.current) {
        setLifestyleOffset(lifestyleRef.current.offsetTop);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Inicializa o offset
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const domainUrl = "https://veltraxx.com/";

  const customStyles = `
    @keyframes shimmer {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    .animate-shimmer {
      background: linear-gradient(to right, #ffffff 20%, #84cc16 50%, #ffffff 80%);
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 30s linear infinite;
    }
    .perspective-card {
      perspective: 1000px;
    }
  `;

  return (
    <div className="font-sans text-gray-100 bg-neutral-950 selection:bg-lime-500 selection:text-black overflow-x-hidden min-h-screen">
      <style>{customStyles}</style>
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-neutral-900/90 backdrop-blur-xl border-neutral-800 py-3 shadow-2xl' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 font-bold text-2xl tracking-tighter cursor-pointer group" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className="relative">
              <span className="text-lime-400 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 inline-block">VEL</span>
              <span className="absolute inset-0 bg-lime-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
            </div>
            <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">TRAXX</span>
            <span className="text-[10px] ml-2 border border-neutral-700 px-1.5 py-0.5 rounded text-neutral-400 tracking-widest uppercase bg-neutral-900/50">EliteCycle</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <button onClick={() => scrollToSection('sobre')} className="hover:text-lime-400 transition-colors relative group">
              SOBRE
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-lime-400 transition-colors relative group">
              BENEFÍCIOS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('lifestyle')} className="hover:text-lime-400 transition-colors relative group">
              LIFESTYLE
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <a 
              href={domainUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative overflow-hidden bg-lime-500 text-black px-6 py-2 rounded-full font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] flex items-center gap-2 group"
            >
              <span className="relative z-10 flex items-center gap-2">COMPRAR AGORA <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/></span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className={`md:hidden absolute top-full left-0 w-full bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
          <div className="px-6 flex flex-col gap-4">
            <button onClick={() => scrollToSection('sobre')} className="text-left py-2 hover:text-lime-400 border-b border-neutral-800">SOBRE</button>
            <button onClick={() => scrollToSection('features')} className="text-left py-2 hover:text-lime-400 border-b border-neutral-800">BENEFÍCIOS</button>
            <button onClick={() => scrollToSection('lifestyle')} className="text-left py-2 hover:text-lime-400 border-b border-neutral-800">LIFESTYLE</button>
            <a href={domainUrl} className="bg-lime-500 text-black text-center py-3 rounded font-bold mt-2 hover:bg-lime-400">COMPRAR AGORA</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION WITH PARALLAX --- */}
      <header className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop" 
            alt="Ciclista em alta performance" 
            className="w-full h-full object-cover object-center opacity-60 scale-110"
          />
        </div>
        
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-900/30"></div>

        <div className="container mx-auto px-6 relative z-10 text-center mt-16 perspective-card">
          <Reveal delay={100}>
            <div className="inline-block border border-lime-500/30 bg-lime-500/10 backdrop-blur-sm px-4 py-1 rounded-full mb-6">
              <span className="text-lime-400 font-bold tracking-[0.2em] text-xs md:text-sm">NOVA COLEÇÃO AERO</span>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
              Performance <br/>
              <span className="animate-shimmer">Sem Limites</span>
            </h1>
          </Reveal>
          
          <Reveal delay={400}>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Nós criamos o <strong>AERO</strong> para quem vive em movimento. Transforme cada quilômetro, cada trilha e cada desafio em uma experiência definitiva.
            </p>
          </Reveal>
          
          <Reveal delay={600}>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a 
                href={domainUrl} 
                className="group relative bg-lime-500 text-black px-10 py-5 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(132,204,22,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingBag size={20} /> COMPRAR AGORA
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/30 transition-transform duration-300 skew-x-12"></div>
              </a>
              
              <button 
                onClick={() => scrollToSection('features')} 
                className="group px-8 py-5 rounded-full font-bold text-lg border border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <span>Descobrir Detalhes</span>
                <ArrowRight size={18} className="text-lime-400 group-hover:translate-y-1 transition-transform rotate-90"/>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* --- INFINITE MARQUEE STRIP --- */}
      <div className="bg-lime-500 py-3 overflow-hidden whitespace-nowrap border-y border-lime-400 relative z-20 rotate-1 scale-105 origin-left shadow-lg">
        <div className="animate-marquee inline-block">
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">VELTRAXX ELITECYCLE</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">•</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">AERO SERIES</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">•</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">HIGH PERFORMANCE</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">•</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">UNSTOPPABLE</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">•</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">VELTRAXX ELITECYCLE</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">•</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">AERO SERIES</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">•</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">HIGH PERFORMANCE</span>
          <span className="text-black font-black text-xl mx-8 tracking-widest italic">•</span>
        </div>
      </div>

      {/* --- INTRO SECTION --- */}
      <section id="sobre" className="py-32 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="lg:w-1/2 relative group">
              <Reveal>
                <div className="absolute -inset-1 bg-gradient-to-r from-lime-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2070&auto=format&fit=crop" 
                      alt="Óculos Aero em uso" 
                      className="w-full object-cover border border-neutral-800 transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-lg animate-pulse">
                        <Activity className="text-lime-400 mb-1" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Tech Loaded</span>
                    </div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 md:-right-6 bg-neutral-900/90 p-8 rounded-2xl border border-neutral-800 shadow-2xl hidden md:block backdrop-blur-xl transform transition-transform hover:-translate-y-2 duration-300">
                  <div className="flex gap-6">
                    <div>
                        <p className="text-lime-400 font-bold text-4xl">100%</p>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Proteção UV</p>
                    </div>
                    <div className="w-px bg-neutral-700"></div>
                    <div>
                        <p className="text-white font-bold text-4xl">24g</p>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Ultra Leve</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
            
            <div className="lg:w-1/2">
              <Reveal delay={200}>
                <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  UM ÓCULOS. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">TODAS AS AVENTURAS.</span>
                </h3>
              </Reveal>

              <div className="space-y-8 text-gray-400 text-lg mb-10">
                <Reveal delay={300}>
                  <p className="border-l-4 border-lime-500 pl-6 py-2 bg-gradient-to-r from-lime-500/5 to-transparent">
                    Extremamente resistente. Design moderno e sofisticado. Versatilidade sem limites.
                  </p>
                </Reveal>
                <Reveal delay={400}>
                  <p>
                    O <strong>AERO</strong> foi desenvolvido para entregar desempenho máximo em qualquer cenário. Um único modelo, pensado para múltiplos esportes e estilos de vida.
                  </p>
                </Reveal>
                <Reveal delay={500}>
                  <p className="font-medium text-white italic flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping"></span>
                    Um design. Várias cores. Uma atitude.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={600}>
                <a href={domainUrl} className="inline-flex items-center gap-3 text-lime-400 font-bold hover:text-lime-300 transition-all text-lg group border-b border-transparent hover:border-lime-400 pb-1">
                  ESCOLHER MEU MODELO 
                  <div className="bg-lime-500/20 p-1 rounded-full group-hover:bg-lime-500 group-hover:text-black transition-all">
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform"/>
                  </div>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-32 bg-neutral-900 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-50"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Reveal>
                <h2 className="text-4xl md:text-6xl font-bold mb-6">POR QUE O AERO?</h2>
                <p className="text-gray-400 text-xl">Porque nós acreditamos que equipamento de verdade precisa acompanhar quem vai além.</p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Resistência Extrema", text: "Nós usamos materiais de alta durabilidade, preparados para impacto, velocidade e uso intenso." },
              { icon: Wind, title: "Design Aerodinâmico", text: "Linhas marcantes, visual premium e presença forte dentro e fora do esporte." },
              { icon: Feather, title: "Conforto em Movimento", text: "Leve, estável e confortável mesmo em longos períodos de uso contínuo." },
              { icon: Mountain, title: "Versatilidade Total", text: "Perfeito para ciclismo, corrida, montanhismo, trekking e aventura outdoor." },
            ].map((feature, index) => (
                <Reveal delay={index * 100} key={index} className="h-full">
                    <div className="h-full bg-neutral-950 p-10 rounded-3xl border border-neutral-800 hover:border-lime-500/40 transition-all duration-500 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(132,204,22,0.2)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                            <div className="bg-neutral-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-lime-500 group-hover:text-black transition-all duration-300 shadow-inner">
                                <feature.icon size={32} className="text-lime-400 group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-lime-400 transition-colors">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                                {feature.text}
                            </p>
                        </div>
                    </div>
                </Reveal>
            ))}

            <Reveal delay={400} className="md:col-span-2 lg:col-span-2 h-full">
                <div className="h-full bg-neutral-950 p-10 rounded-3xl border border-neutral-800 hover:border-lime-500/40 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex-1">
                        <div className="bg-neutral-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-lime-500 group-hover:text-black transition-all duration-300 shadow-inner">
                            <Activity size={32} className="text-lime-400 group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-lime-400 transition-colors">Variações de Cor</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Escolha a cor que representa o seu estilo. O desempenho permanece o mesmo.
                        </p>
                        
                        <div className="flex gap-4">
                            {['bg-lime-500', 'bg-blue-600', 'bg-red-500', 'bg-neutral-200', 'bg-neutral-800'].map((color, i) => (
                                <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white/20 cursor-pointer hover:scale-125 transition-transform shadow-lg ring-2 ring-transparent hover:ring-white/50`}></div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 w-full md:w-1/2 opacity-80 group-hover:opacity-100 transition-opacity">
                         <div className="grid grid-cols-2 gap-2">
                            <div className="bg-neutral-800/50 h-24 rounded-lg animate-pulse delay-75"></div>
                            <div className="bg-neutral-800/50 h-24 rounded-lg animate-pulse delay-150"></div>
                            <div className="bg-neutral-800/50 h-24 rounded-lg animate-pulse delay-300 col-span-2"></div>
                         </div>
                         <p className="text-center text-xs text-gray-500 mt-2 font-mono">STYLE PREVIEW</p>
                    </div>
                </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- LIFESTYLE SECTION WITH FIXED PARALLAX --- */}
      <section 
        id="lifestyle" 
        ref={lifestyleRef}
        className="relative py-40 flex items-center overflow-hidden h-[90vh]"
      >
        <div 
          className="absolute inset-0 z-0 will-change-transform bg-neutral-900"
        >
          {/* Cálculo de Parallax corrigido e relativo à posição da seção */}
          <img 
            src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2070&auto=format&fit=crop" 
            alt="Ciclismo na montanha" 
            className="absolute left-0 w-full object-cover grayscale brightness-[0.4]"
            style={{ 
                height: '150%', // Aumentado para ter margem de rolagem
                top: '-25%',    // Centralizado verticalmente
                transform: `translateY(${(scrollY - lifestyleOffset) * 0.25}px)` 
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-neutral-950/60 z-0"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase italic leading-none">
                Feito para <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-600">quem não para</span>
              </h2>
            </Reveal>
          
            <Reveal delay={200}>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 font-light">
                Nós sabemos que o caminho muda, o terreno muda, o clima muda. <br/>
                O <span className="text-lime-400 font-bold bg-lime-500/10 px-2 rounded">AERO</span> acompanha tudo isso sem perder performance.
              </p>
            </Reveal>
          
            <Reveal delay={400}>
              <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 text-left max-w-5xl mx-auto bg-neutral-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10">
                <div className="flex items-center gap-5">
                  <div className="bg-lime-500/20 p-3 rounded-full">
                    <CheckCircle className="text-lime-400 shrink-0" size={28}/>
                  </div>
                  <span className="text-xl font-bold">Da cidade à montanha</span>
                </div>
                <div className="w-full h-px md:w-px md:h-12 bg-white/10"></div>
                <div className="flex items-center gap-5">
                  <div className="bg-lime-500/20 p-3 rounded-full">
                    <CheckCircle className="text-lime-400 shrink-0" size={28}/>
                  </div>
                  <span className="text-xl font-bold">Do treino à aventura</span>
                </div>
                <div className="w-full h-px md:w-px md:h-12 bg-white/10"></div>
                <div className="flex items-center gap-5">
                  <div className="bg-lime-500/20 p-3 rounded-full">
                    <CheckCircle className="text-lime-400 shrink-0" size={28}/>
                  </div>
                  <span className="text-xl font-bold">Nós seguimos com você</span>
                </div>
              </div>
            </Reveal>
        </div>
      </section>

      {/* --- CTA / FOOTER SECTION --- */}
      <footer className="bg-neutral-950 pt-32 pb-12 border-t border-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-lime-500/5 blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          
          <div className="max-w-4xl mx-auto mb-20">
            <Reveal>
                <div className="relative inline-block">
                    <h2 className="text-[120px] md:text-[200px] font-black text-neutral-900 leading-none select-none tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-0">AERO</h2>
                    <h3 className="text-4xl md:text-6xl font-bold text-white relative z-10 leading-tight">
                        Não é apenas um óculos. <br/>
                        <span className="text-lime-400">É parte do seu movimento.</span>
                    </h3>
                </div>
            </Reveal>
            
            <Reveal delay={200}>
                <div className="mt-16">
                <a 
                    href={domainUrl} 
                    className="group relative inline-flex items-center justify-center gap-4 bg-white text-black px-12 py-6 rounded-full font-black text-xl hover:bg-lime-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(132,204,22,0.6)] transform hover:-translate-y-1"
                >
                    <span className="relative z-10">GARANTIR O MEU AERO</span>
                    <ArrowRight className="relative z-10 transition-transform group-hover:translate-x-2" />
                </a>
                <p className="mt-6 text-gray-500 text-sm">Frete Grátis para todo o Brasil • Garantia de 1 ano</p>
                </div>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-left border-t border-neutral-900 pt-16 mt-16 text-sm text-gray-500">
            <div>
              <h4 className="text-white font-bold text-2xl mb-6 flex items-center gap-2">
                <span className="text-lime-400">VEL</span>TRAXX
              </h4>
              <p className="leading-relaxed mb-6">Equipamentos de alta performance para atletas que desafiam limites. Design, tecnologia e durabilidade.</p>
              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-lime-500 hover:text-black transition-colors cursor-pointer"><span className="font-bold">IG</span></div>
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-lime-500 hover:text-black transition-colors cursor-pointer"><span className="font-bold">FB</span></div>
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-lime-500 hover:text-black transition-colors cursor-pointer"><span className="font-bold">YT</span></div>
              </div>
            </div>
            
            <div className="md:pl-10">
              <h4 className="text-white font-bold text-lg mb-6">Explorar</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-lime-400 transition-colors flex items-center gap-2"><ArrowRight size={12}/> Home</a></li>
                <li><a href="#sobre" className="hover:text-lime-400 transition-colors flex items-center gap-2"><ArrowRight size={12}/> Sobre AERO</a></li>
                <li><a href="#features" className="hover:text-lime-400 transition-colors flex items-center gap-2"><ArrowRight size={12}/> Tecnologia</a></li>
                <li><a href={domainUrl} className="hover:text-lime-400 transition-colors flex items-center gap-2"><ArrowRight size={12}/> Loja Oficial</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Contato</h4>
              <div className="space-y-4">
                <p className="hover:text-white transition-colors cursor-pointer">suporte@veltraxx.com</p>
                <p className="hover:text-white transition-colors cursor-pointer">+55 11 99999-9999</p>
                <div className="pt-4">
                    <p className="text-xs uppercase tracking-widest text-lime-500 mb-2">Certificações</p>
                    <div className="flex gap-2 opacity-50">
                        <div className="h-8 w-12 bg-neutral-800 rounded"></div>
                        <div className="h-8 w-12 bg-neutral-800 rounded"></div>
                        <div className="h-8 w-12 bg-neutral-800 rounded"></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16 pt-8 border-t border-neutral-900 text-xs text-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Veltraxx EliteCycle. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-gray-400">Termos</a>
                <a href="#" className="hover:text-gray-400">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;