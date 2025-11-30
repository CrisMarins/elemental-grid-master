import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-water via-secondary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
            ElementGrid
          </h1>
          <p className="text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Where Sudoku meets type effectiveness
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <Card 
            className="p-6 bg-card border-border hover:border-water transition-all duration-300 cursor-pointer group"
            onClick={() => navigate("/tutorial")}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-water/20 rounded-lg flex items-center justify-center group-hover:bg-water/30 transition-colors">
                <BookOpen className="w-6 h-6 text-water" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Tutorial</h2>
                <p className="text-muted-foreground">
                  Learn the rules and master the game mechanics
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-secondary transition-all duration-300 cursor-not-allowed opacity-60">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Arcade Mode</h2>
                <p className="text-muted-foreground">
                  Coming soon - Progressive difficulty levels
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-accent transition-all duration-300 cursor-not-allowed opacity-60">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Quick Game</h2>
                <p className="text-muted-foreground">
                  Coming soon - Jump right into action
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
          <p>Choose a mode to begin your ElementGrid journey</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
