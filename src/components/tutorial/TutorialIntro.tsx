import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TutorialIntroProps {
  onNext: () => void;
}

const TutorialIntro = ({ onNext }: TutorialIntroProps) => {
  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-6 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-water via-secondary to-accent bg-clip-text text-transparent">
          Welcome to SuPoke
        </h1>
        
        <div className="space-y-4 text-lg">
          <p className="text-foreground">
            SuPoke combines the logic of Sudoku with the strategy of type effectiveness.
          </p>
          
          <div className="bg-muted/50 p-6 rounded-lg space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Game Goal</h2>
            <p className="text-muted-foreground">
              Fill the entire grid with elements (Grass, Fire, Water) following two main rules:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-water/10 p-4 rounded-lg border border-water/30">
              <h3 className="font-bold text-water mb-2">1. Sudoku Rule</h3>
              <p className="text-sm text-muted-foreground">
                Each row and column must contain all three elements exactly once
              </p>
            </div>
            
            <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/30">
              <h3 className="font-bold text-secondary mb-2">2. Neighboring Rule</h3>
              <p className="text-sm text-muted-foreground">
                Adjacent cells follow type effectiveness rules (coming in next levels)
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onNext} 
          size="lg" 
          className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Let's Start Learning
        </Button>
      </div>
    </Card>
  );
};

export default TutorialIntro;
