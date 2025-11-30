import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameGrid from "@/components/game/GameGrid";

interface TutorialColumnRuleProps {
  onNext: () => void;
}

const TutorialColumnRule = ({ onNext }: TutorialColumnRuleProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [gridState, setGridState] = useState([
    ["grass", "fire", "water"],
    [null, null, null],
    [null, null, null],
  ]);
  const [showElementButtons, setShowElementButtons] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleCellClick = (row: number, col: number) => {
    if (row === 1 && col === 0 && !completed) {
      setSelectedCell({ row, col });
      setShowElementButtons(true);
    }
  };

  const handleElementSelect = (element: string) => {
    if (selectedCell) {
      const newGrid = [...gridState];
      newGrid[selectedCell.row][selectedCell.col] = element;
      setGridState(newGrid);
      setShowElementButtons(false);
      setCompleted(true);
    }
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground">
          The Column Rule
        </h2>
        
        <div className="bg-muted/30 p-6 rounded-lg space-y-3">
          <p className="text-lg text-foreground">
            The Sudoku rule applies to <span className="font-bold">columns</span> too!
          </p>
          <p className="text-muted-foreground">
            The left column is now highlighted. Notice Grass is already in the top cell.
          </p>
        </div>

        <div className="flex justify-center">
          <GameGrid
            gridState={gridState}
            highlightedCells={[[0, 0], [1, 0], [2, 0]]}
            onCellClick={handleCellClick}
            selectedCell={selectedCell}
          />
        </div>

        {!showElementButtons && !completed && (
          <div className="text-center bg-water/10 p-4 rounded-lg border border-water/30">
            <p className="text-lg font-medium text-water">
              Click on the middle-left cell to continue!
            </p>
          </div>
        )}

        {showElementButtons && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              The column must contain all three elements. Grass is already placed. What comes next?
            </p>
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
                Excellent! You understand both row and column rules!
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={onNext} size="lg" className="bg-primary hover:bg-primary/90">
                Complete Tutorial
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TutorialColumnRule;
