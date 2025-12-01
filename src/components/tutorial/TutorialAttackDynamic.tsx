import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameGrid from "@/components/game/GameGrid";

interface TutorialAttackDynamicProps {
  onNext: () => void;
}

const TutorialAttackDynamic = ({ onNext }: TutorialAttackDynamicProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [gridState, setGridState] = useState([
    ["grass", "fire", null],
    ["fire", null, null],
    [null, null, null],
  ]);
  const [showElementButtons, setShowElementButtons] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);
  const [selectedGraphElement, setSelectedGraphElement] = useState<string | null>(null);
  const [topLeftNumbers] = useState([[6, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [bottomRightNumbers] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

  const handleCellClick = (row: number, col: number) => {
    if (row === 1 && col === 1 && !completed) {
      setSelectedCell({ row, col });
      setShowElementButtons(true);
    }
  };

  const handleElementSelect = (element: string) => {
    if (selectedCell) {
      if (element !== "water") {
        setError(true);
        setTimeout(() => setError(false), 500);
        return;
      }
      
      const newGrid = [...gridState];
      newGrid[selectedCell.row][selectedCell.col] = element;
      setGridState(newGrid);
      setShowElementButtons(false);
      setCompleted(true);
    }
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground">
          The Attack Dynamic
        </h2>
        
        <div className="bg-muted/30 p-6 rounded-lg space-y-3">
          <p className="text-lg text-foreground">
            The center cell can't be solved by Sudoku rules alone - it could be Water or Grass!
          </p>
          <p className="text-muted-foreground">
            Let's use the <span className="font-bold">Attack Value</span> (top-left number) to solve it.
          </p>
          <p className="text-muted-foreground">
            The top-left cell shows <span className="font-bold text-secondary">6</span> - this is the total damage Grass deals to all neighboring cells.
          </p>
        </div>

        <div className="flex justify-center items-start gap-8">
          <div className={error ? "animate-shake" : ""}>
            <GameGrid
              gridState={gridState}
              highlightedCells={[[0, 0], [0, 1], [1, 0], [1, 1]]}
              onCellClick={handleCellClick}
              selectedCell={selectedCell}
              showNumbers={true}
              topLeftNumbers={topLeftNumbers}
              bottomRightNumbers={bottomRightNumbers}
            />
          </div>

          {/* Interaction Graph */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold text-foreground mb-4">Type Effectiveness</h3>
            <div className="flex gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-xs text-muted-foreground text-center">Attack</span>
                <div
                  className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                    selectedGraphElement === "grass" ? "ring-4 ring-secondary scale-110 bg-secondary/30" : "bg-secondary/10"
                  }`}
                  onClick={() => setSelectedGraphElement(selectedGraphElement === "grass" ? null : "grass")}
                >
                  <span className="text-4xl">🌿</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <span className="text-xs text-muted-foreground text-center">Defense</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 rounded-lg border bg-secondary/10 flex items-center justify-center">
                      <span className="text-3xl">🌿</span>
                    </div>
                    <span className="text-sm text-muted-foreground">→ 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 rounded-lg border bg-accent/10 flex items-center justify-center">
                      <span className="text-3xl">🔥</span>
                    </div>
                    <span className="text-sm text-muted-foreground">→ 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 rounded-lg border bg-water/10 flex items-center justify-center">
                      <span className="text-3xl">💧</span>
                    </div>
                    <span className="text-sm font-bold text-accent">→ 4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
          <p className="text-sm text-foreground">
            <span className="font-bold">Calculation:</span> Grass deals 1 to Fire (right) + 1 to Fire (below) = 2 damage. 
            Missing 4 damage to reach 6. <span className="font-bold text-accent">Grass deals 4 to Water!</span>
          </p>
        </div>

        {!showElementButtons && !completed && (
          <div className="text-center bg-water/10 p-4 rounded-lg border border-water/30">
            <p className="text-lg font-medium text-water">
              Click on the center cell to solve it using the Attack Value!
            </p>
          </div>
        )}

        {showElementButtons && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Which element receives 4 damage from Grass to complete the sum?
            </p>
            {error && (
              <div className="text-center bg-destructive/10 p-3 rounded-lg border border-destructive/30">
                <p className="text-sm font-medium text-destructive">
                  Try again! Check the type effectiveness chart - which element takes 4 damage from Grass?
                </p>
              </div>
            )}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleElementSelect("grass")}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6"
              >
                🌿 Grass
              </Button>
              <Button
                onClick={() => handleElementSelect("fire")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6"
              >
                🔥 Fire
              </Button>
              <Button
                onClick={() => handleElementSelect("water")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
              >
                💧 Water
              </Button>
            </div>
          </div>
        )}

        {completed && (
          <div className="space-y-4">
            <div className="text-center bg-secondary/10 p-4 rounded-lg border border-secondary/30">
              <p className="text-lg font-medium text-secondary">
                Excellent! You've mastered the Attack Dynamic!
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={onNext} size="lg" className="bg-primary hover:bg-primary/90">
                Continue Tutorial
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TutorialAttackDynamic;
