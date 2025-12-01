import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameGrid from "@/components/game/GameGrid";

interface TutorialAttackDynamicProps {
  onNext: () => void;
}

type Element = "grass" | "fire" | "water";

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
  const [selectedGraphElement, setSelectedGraphElement] = useState<Element | null>(null);
  const [topLeftNumbers] = useState([[6, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [bottomRightNumbers] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [hoveredElement, setHoveredElement] = useState<{ element: Element; side: "attack" | "defense" } | null>(null);

  const damageValues: Record<Element, Record<Element, number>> = {
    grass: { grass: 1, fire: 1, water: 4 },
    fire: { grass: 4, fire: 1, water: 1 },
    water: { grass: 1, fire: 4, water: 1 },
  };

  const elementInfo: Record<Element, { emoji: string; color: string; bgColor: string }> = {
    grass: { emoji: "🌿", color: "text-secondary", bgColor: "bg-secondary/20" },
    fire: { emoji: "🔥", color: "text-accent", bgColor: "bg-accent/20" },
    water: { emoji: "💧", color: "text-water", bgColor: "bg-water/20" },
  };

  const isEdgeHighlighted = (from: Element, to: Element) => {
    if (!hoveredElement && !selectedGraphElement) return true;
    if (selectedGraphElement === from) return true;
    if (hoveredElement && hoveredElement.side === "attack" && hoveredElement.element === from) return true;
    if (hoveredElement && hoveredElement.side === "defense" && hoveredElement.element === to) return true;
    return false;
  };

  const attackElements: Element[] = ["grass", "fire", "water"];
  const defenseElements: Element[] = ["grass", "fire", "water"];

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
              highlightedNumbers={[{ row: 0, col: 0, position: 'topLeft' }]}
            />
          </div>

          {/* Interaction Graph */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold text-foreground mb-4">Type Effectiveness</h3>
            <div className="flex gap-8">
              {/* Attack Column */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-center text-muted-foreground mb-2">Attack</h3>
                {attackElements.map((element) => (
                  <div
                    key={`attack-${element}`}
                    className={`relative w-20 h-20 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                      elementInfo[element].bgColor
                    } ${
                      hoveredElement && hoveredElement.element !== element && hoveredElement.side === "defense"
                        ? "opacity-30"
                        : "opacity-100"
                    } ${
                      selectedGraphElement === element ? "ring-4 ring-primary scale-110" : ""
                    }`}
                    onMouseEnter={() => setHoveredElement({ element, side: "attack" })}
                    onMouseLeave={() => setHoveredElement(null)}
                    onClick={() => setSelectedGraphElement(selectedGraphElement === element ? null : element)}
                  >
                    <span className="text-4xl">{elementInfo[element].emoji}</span>
                  </div>
                ))}
              </div>

              {/* Edges */}
              <svg width="200" height={defenseElements.length * 120} className="relative">
                {attackElements.map((attacker, attackIdx) =>
                  defenseElements.map((defender, defenseIdx) => {
                    const damage = damageValues[attacker][defender];
                    const highlighted = isEdgeHighlighted(attacker, defender);
                    const strokeWidth = damage === 4 ? 6 : damage === 2 ? 4 : damage === 1 ? 2 : 1;
                    const strokeColor = highlighted
                      ? damage === 4
                        ? "#ef4444"
                        : damage === 2
                        ? "#3b82f6"
                        : damage === 1
                        ? "#9ca3af"
                        : "#1f2937"
                      : "#374151";

                    const y1 = attackIdx * 120 + 48;
                    const y2 = defenseIdx * 120 + 48;

                    return (
                      <g key={`${attacker}-${defender}`}>
                        <line
                          x1="10"
                          y1={y1}
                          x2="190"
                          y2={y2}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          opacity={highlighted ? 1 : 0.2}
                          className="transition-all"
                        />
                        {highlighted && (hoveredElement || selectedGraphElement) && (
                          <text
                            x="100"
                            y={(y1 + y2) / 2}
                            fill="currentColor"
                            className="text-sm font-bold fill-foreground"
                            textAnchor="middle"
                          >
                            {damage}
                          </text>
                        )}
                      </g>
                    );
                  })
                )}
              </svg>

              {/* Defense Column */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-center text-muted-foreground mb-2">Defense</h3>
                {defenseElements.map((element) => (
                  <div
                    key={`defense-${element}`}
                    className={`relative w-20 h-20 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                      elementInfo[element].bgColor
                    } ${
                      hoveredElement && hoveredElement.element !== element && hoveredElement.side === "attack"
                        ? "opacity-30"
                        : "opacity-100"
                    }`}
                    onMouseEnter={() => setHoveredElement({ element, side: "defense" })}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <span className="text-4xl">{elementInfo[element].emoji}</span>
                  </div>
                ))}
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
