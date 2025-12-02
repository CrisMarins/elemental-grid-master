import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameGrid from "@/components/game/GameGrid";

interface TutorialCombinedRuleProps {
  onNext: () => void;
}

const TutorialCombinedRule = ({ onNext }: TutorialCombinedRuleProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [gridState, setGridState] = useState([
    [null, "fire", null],
    [null, null, null],
    ["water", null, null],
  ]);
  const [showElementButtons, setShowElementButtons] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);
  const [topLeftNumbers, setTopLeftNumbers] = useState<number[][]>([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [bottomRightNumbers, setBottomRightNumbers] = useState<number[][]>([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);

  useEffect(() => {
    const loadNumbers = async () => {
      try {
        const atkResponse = await fetch('/data/tutorial1_atk.csv');
        const atkText = await atkResponse.text();
        const atkRows = atkText.trim().split('\n').map(row => 
          row.split(',').map(val => val.trim() === '' ? 0 : parseInt(val.trim()))
        );
        setTopLeftNumbers(atkRows);

        const defResponse = await fetch('/data/tutorial1_def.csv');
        const defText = await defResponse.text();
        const defRows = defText.trim().split('\n').map(row => 
          row.split(',').map(val => val.trim() === '' ? 0 : parseInt(val.trim()))
        );
        setBottomRightNumbers(defRows);
      } catch (error) {
        console.error('Error loading CSV files:', error);
      }
    };
    loadNumbers();
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (row === 0 && col === 0 && !completed) {
      setSelectedCell({ row, col });
      setShowElementButtons(true);
    }
  };

  const handleElementSelect = (element: string) => {
    if (selectedCell) {
      if (element !== "grass") {
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
      <div className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground">
          Combined Sudoku Rules
        </h2>
        
        <div className="bg-muted/30 p-6 rounded-lg space-y-3">
          <p className="text-lg text-foreground">
            Now let's combine both rules! Notice Fire is in the first row and Water is in the first column.
          </p>
          <p className="text-muted-foreground">
            Both the <span className="font-bold">row</span> and <span className="font-bold">column</span> rules tell us what must go in the top-left cell!
          </p>
        </div>

        <div className="flex justify-center">
          <div className={error ? "animate-shake" : ""}>
            <GameGrid
              gridState={gridState}
              highlightedCells={[[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]]}
              onCellClick={handleCellClick}
              selectedCell={selectedCell}
              showNumbers={true}
              topLeftNumbers={topLeftNumbers}
              bottomRightNumbers={bottomRightNumbers}
            />
          </div>
        </div>

        {!showElementButtons && !completed && (
          <div className="text-center bg-water/10 p-4 rounded-lg border border-water/30">
            <p className="text-lg font-medium text-water">
              Click on the top-left cell to solve it using both row and column rules!
            </p>
          </div>
        )}

        {showElementButtons && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Both the row and column need all three elements. What must go in the top-left cell?
            </p>
            {error && (
              <div className="text-center bg-destructive/10 p-3 rounded-lg border border-destructive/30">
                <p className="text-sm font-medium text-destructive">
                  Try again! Consider what's missing from both the row AND the column.
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
                Perfect! You can use both row and column rules together!
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

export default TutorialCombinedRule;
