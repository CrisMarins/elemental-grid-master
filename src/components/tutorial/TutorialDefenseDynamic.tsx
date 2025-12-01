import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameGrid from "@/components/game/GameGrid";

interface TutorialDefenseDynamicProps {
  onNext: () => void;
}

type Element = "grass" | "fire" | "water";

const TutorialDefenseDynamic = ({ onNext }: TutorialDefenseDynamicProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [gridState, setGridState] = useState([
    ["grass", "water", null],
    ["water", null, null],
    [null, null, null],
  ]);
  const [showElementButtons, setShowElementButtons] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(false);
  const [topLeftNumbers] = useState([[9, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [bottomRightNumbers] = useState([[6, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [showAttackPhase, setShowAttackPhase] = useState(true);
  const [showDefensePhase, setShowDefensePhase] = useState(false);
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
    if (!hoveredElement) {
      if (showAttackPhase && from === "grass") return true;
      if (showDefensePhase && to === "grass") return true;
      return false;
    }
    if (hoveredElement.side === "attack" && hoveredElement.element === from) return true;
    if (hoveredElement.side === "defense" && hoveredElement.element === to) return true;
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
      if (element !== "fire") {
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

  const handleGotItAttack = () => {
    setShowAttackPhase(false);
    setShowDefensePhase(true);
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground">
          The Defense Dynamic
        </h2>
        
        <div className="bg-muted/30 p-6 rounded-lg space-y-3">
          {showAttackPhase && (
            <>
              <p className="text-lg text-foreground">
                Sometimes the Attack Value isn't enough - we need the <span className="font-bold">Defense Value</span> too!
              </p>
              <p className="text-muted-foreground">
                The top-left cell has Attack Value <span className="font-bold text-accent">9</span> and Defense Value <span className="font-bold text-water">6</span>.
              </p>
            </>
          )}
          {showDefensePhase && (
            <>
              <p className="text-lg text-foreground">
                Now let's use the <span className="font-bold">Defense Value</span> to solve it!
              </p>
              <p className="text-muted-foreground">
                Look at the Defense Value <span className="font-bold text-water">6</span> - which element receives this much damage from neighbors?
              </p>
            </>
          )}
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
              highlightedNumbers={
                showAttackPhase 
                  ? [{ row: 0, col: 0, position: 'topLeft' }]
                  : [{ row: 0, col: 0, position: 'bottomRight' }]
              }
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
                      showAttackPhase && element === "grass" ? "ring-4 ring-accent scale-110" : ""
                    }`}
                    onMouseEnter={() => setHoveredElement({ element, side: "attack" })}
                    onMouseLeave={() => setHoveredElement(null)}
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
                        {highlighted && (
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
                    } ${
                      showDefensePhase && element === "grass" ? "ring-4 ring-water scale-110" : ""
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

        {showAttackPhase && (
          <>
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
              <p className="text-sm text-foreground">
                <span className="font-bold">Attack Analysis:</span> Grass deals 4 to Water (right) + 4 to Water (below) = 8 damage. 
                Missing 1 to reach 9. Could be Grass or Fire (both deal 1 to Grass).
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleGotItAttack} size="lg" className="bg-primary hover:bg-primary/90">
                Got it! Show me the Defense Analysis
              </Button>
            </div>
          </>
        )}

        {showDefensePhase && (
          <div className="bg-water/10 p-4 rounded-lg border border-water/30">
            <p className="text-sm text-foreground">
              <span className="font-bold">Defense Analysis:</span> Water (right) deals 1 to Grass + Water (below) deals 1 to Grass = 2 damage received. 
              Missing 4 to reach 6. <span className="font-bold text-accent">Only Fire deals 4 to Grass!</span>
            </p>
          </div>
        )}

        {!showElementButtons && !completed && showDefensePhase && (
          <div className="text-center bg-water/10 p-4 rounded-lg border border-water/30">
            <p className="text-lg font-medium text-water">
              Click on the center cell to solve it using the Defense Value!
            </p>
          </div>
        )}

        {showElementButtons && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Which element deals 4 damage TO Grass (defense) to complete the sum?
            </p>
            {error && (
              <div className="text-center bg-destructive/10 p-3 rounded-lg border border-destructive/30">
                <p className="text-sm font-medium text-destructive">
                  Try again! Look at the Defense Value - which element deals 4 damage TO Grass?
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
                Amazing! You've mastered both Attack and Defense Dynamics!
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

export default TutorialDefenseDynamic;
