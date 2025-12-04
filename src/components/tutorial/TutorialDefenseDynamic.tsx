import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameGrid from "@/components/game/GameGrid";

interface TutorialDefenseDynamicProps {
  onNext: () => void;
}

type Element = "grass" | "fire" | "water";

const TutorialDefenseDynamic = ({ onNext }: TutorialDefenseDynamicProps) => {
  const [phase, setPhase] = useState<"attack" | "defense">("attack");
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [gridState, setGridState] = useState([
    ["grass", "water", null],
    ["water", null, null],
    [null, null, null],
  ]);
  const [solutionGrid, setSolutionGrid] = useState<string[][]>([]);
  const [showElementButtons, setShowElementButtons] = useState(false);
  const [allCellsCompleted, setAllCellsCompleted] = useState(false);
  const [error, setError] = useState(false);
  const [selectedGraphElement, setSelectedGraphElement] = useState<{ element: Element; side: "attack" | "defense" } | null>(null);
  const [topLeftNumbers, setTopLeftNumbers] = useState<number[][]>([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [bottomRightNumbers, setBottomRightNumbers] = useState<number[][]>([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  const [hoveredElement, setHoveredElement] = useState<{ element: Element; side: "attack" | "defense" } | null>(null);
  const [completedCells, setCompletedCells] = useState<boolean[][]>([
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const atkResponse = await fetch('/data/tutorial2_atk.csv');
        const atkText = await atkResponse.text();
        const atkRows = atkText.trim().split('\n').map(row => 
          row.split(',').map(val => val.trim() === '' ? 0 : parseInt(val.trim()))
        );
        setTopLeftNumbers(atkRows);

        const defResponse = await fetch('/data/tutorial2_def.csv');
        const defText = await defResponse.text();
        const defRows = defText.trim().split('\n').map(row => 
          row.split(',').map(val => val.trim() === '' ? 0 : parseInt(val.trim()))
        );
        setBottomRightNumbers(defRows);

        const gridResponse = await fetch('/data/tutorial2_grid.csv');
        const gridText = await gridResponse.text();
        const gridRows = gridText.trim().split('\n').map(row => 
          row.split(',').map(val => val.trim())
        );
        setSolutionGrid(gridRows);
      } catch (error) {
        console.error('Error loading CSV files:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (phase === "attack") {
      setSelectedGraphElement({ element: "grass", side: "attack" });
    } else {
      setSelectedGraphElement({ element: "grass", side: "defense" });
    }
  }, [phase]);

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
    if (selectedGraphElement) {
      if (selectedGraphElement.side === "attack" && selectedGraphElement.element === from) return true;
      if (selectedGraphElement.side === "defense" && selectedGraphElement.element === to) return true;
      return false;
    }
    if (hoveredElement && hoveredElement.side === "attack" && hoveredElement.element === from) return true;
    if (hoveredElement && hoveredElement.side === "defense" && hoveredElement.element === to) return true;
    return false;
  };

  const attackElements: Element[] = ["grass", "fire", "water"];
  const defenseElements: Element[] = ["grass", "fire", "water"];

  const checkCompletion = (grid: (string | null)[][]) => {
    if (solutionGrid.length === 0) return false;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i][j] !== solutionGrid[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  const triggerCompletionAnimation = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        setTimeout(() => {
          setCompletedCells(prev => {
            const updated = prev.map(row => [...row]);
            updated[i][j] = true;
            return updated;
          });
        }, (i + j) * 150);
      }
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (phase === "defense" && !allCellsCompleted && gridState[row][col] === null) {
      setSelectedCell({ row, col });
      setShowElementButtons(true);
    }
  };

  const handleElementSelect = (element: string) => {
    if (selectedCell && solutionGrid.length > 0) {
      const correctElement = solutionGrid[selectedCell.row][selectedCell.col];
      
      if (element !== correctElement) {
        setError(true);
        setTimeout(() => setError(false), 500);
        return;
      }
      
      const newGrid = gridState.map(row => [...row]);
      newGrid[selectedCell.row][selectedCell.col] = element;
      setGridState(newGrid);
      setShowElementButtons(false);
      setSelectedCell(null);

      if (checkCompletion(newGrid)) {
        setAllCellsCompleted(true);
        triggerCompletionAnimation();
      }
    }
  };

  const handleGotIt = () => {
    setPhase("defense");
  };

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground">
          The Defense Dynamic
        </h2>
        
        {phase === "attack" ? (
          <>
            <div className="bg-muted/30 p-6 rounded-lg space-y-3">
              <p className="text-lg text-foreground">
                Let's look at the Attack Dynamic first for the top-left cell.
              </p>
              <p className="text-muted-foreground">
                The top-left cell shows <span className="font-bold text-secondary">9</span> (attack value) - total damage Grass deals to neighbors.
              </p>
              <p className="text-muted-foreground">
                Grass deals 4 to Water (right) + 4 to Water (below) = 8 damage. Missing 1 damage to reach 9.
              </p>
              <p className="text-muted-foreground">
                But Grass deals 1 to both Grass and Fire! We can't determine the center cell from attack alone.
              </p>
            </div>

            <div className="flex justify-center items-start gap-6">
              <GameGrid
                gridState={gridState}
                highlightedCells={[[0, 0], [0, 1], [1, 0], [1, 1]]}
                onCellClick={() => {}}
                selectedCell={null}
                showNumbers={true}
                topLeftNumbers={topLeftNumbers}
                bottomRightNumbers={bottomRightNumbers}
                highlightedNumbers={[{ row: 0, col: 0, position: 'topLeft' }]}
                completedCells={completedCells}
              />

              {/* Interaction Graph */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-bold text-foreground mb-2">Type Effectiveness</h3>
                <div className="flex gap-2">
                  {/* Attack Column */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-bold text-center text-muted-foreground mb-1">Attack</h3>
                    {attackElements.map((element) => (
                      <div
                        key={`attack-${element}`}
                        className={`relative w-10 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                          elementInfo[element].bgColor
                        } ${
                          hoveredElement && hoveredElement.element !== element && hoveredElement.side === "defense"
                            ? "opacity-30"
                            : selectedGraphElement && selectedGraphElement.element !== element && selectedGraphElement.side === "defense"
                            ? "opacity-30"
                            : "opacity-100"
                        } ${
                          selectedGraphElement?.element === element && selectedGraphElement?.side === "attack" ? "ring-2 ring-primary scale-105" : ""
                        }`}
                        onMouseEnter={() => setHoveredElement({ element, side: "attack" })}
                        onMouseLeave={() => setHoveredElement(null)}
                      >
                        <span className="text-xl">{elementInfo[element].emoji}</span>
                      </div>
                    ))}
                  </div>

                  {/* Edges */}
                  <svg width="60" height={defenseElements.length * 44} className="relative">
                    <defs>
                      <marker
                        id="arrowhead-defense"
                        markerWidth="5"
                        markerHeight="5"
                        refX="4"
                        refY="1.5"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L0,3 L5,1.5 z" fill="currentColor" className="fill-foreground" />
                      </marker>
                    </defs>
                    {attackElements.map((attacker, attackIdx) =>
                      defenseElements.map((defender, defenseIdx) => {
                        const damage = damageValues[attacker][defender];
                        const highlighted = isEdgeHighlighted(attacker, defender);
                        const strokeWidth = damage === 4 ? 3 : damage === 2 ? 2 : damage === 1 ? 1 : 0.5;
                        const strokeColor = highlighted
                          ? damage === 4
                            ? "#ef4444"
                            : damage === 2
                            ? "#3b82f6"
                            : damage === 1
                            ? "#9ca3af"
                            : "#1f2937"
                          : "#374151";

                        const y1 = attackIdx * 44 + 20;
                        const y2 = defenseIdx * 44 + 20;

                        return (
                          <g key={`${attacker}-${defender}`}>
                            <line
                              x1="5"
                              y1={y1}
                              x2="52"
                              y2={y2}
                              stroke={strokeColor}
                              strokeWidth={strokeWidth}
                              opacity={highlighted ? 1 : 0.2}
                              className="transition-all"
                              markerEnd={highlighted ? "url(#arrowhead-defense)" : ""}
                            />
                            {highlighted && (hoveredElement || selectedGraphElement) && (
                              <text
                                x="30"
                                y={(y1 + y2) / 2}
                                fill="currentColor"
                                className="text-xs font-bold fill-foreground"
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
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-bold text-center text-muted-foreground mb-1">Defense</h3>
                    {defenseElements.map((element) => (
                      <div
                        key={`defense-${element}`}
                        className={`relative w-10 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                          elementInfo[element].bgColor
                        } ${
                          hoveredElement && hoveredElement.element !== element && hoveredElement.side === "attack"
                            ? "opacity-30"
                            : selectedGraphElement && selectedGraphElement.element !== element && selectedGraphElement.side === "attack"
                            ? "opacity-30"
                            : "opacity-100"
                        }`}
                        onMouseEnter={() => setHoveredElement({ element, side: "defense" })}
                        onMouseLeave={() => setHoveredElement(null)}
                      >
                        <span className="text-xl">{elementInfo[element].emoji}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleGotIt} size="lg" className="bg-primary hover:bg-primary/90">
                Got it!
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-muted/30 p-6 rounded-lg space-y-3">
              <p className="text-lg text-foreground">
                Now let's use the <span className="font-bold">Defense Value</span> (bottom-right number) to solve it!
              </p>
              <p className="text-muted-foreground">
                The bottom-right of top-left cell shows <span className="font-bold text-water">6</span> - total damage Grass receives from neighbors.
              </p>
              <p className="text-muted-foreground">
                Water (right) deals 1 to Grass + Water (below) deals 1 to Grass = 2 damage. Missing 4 to reach 6.
              </p>
              <p className="text-muted-foreground">
                <span className="font-bold text-accent">Fire deals 4 to Grass!</span> The center cell must be Fire.
              </p>
            </div>

            <div className="flex justify-center items-start gap-6">
              <div className={error ? "animate-shake" : ""}>
                <GameGrid
                  gridState={gridState}
                  highlightedCells={[[0, 0], [0, 1], [1, 0], [1, 1]]}
                  onCellClick={handleCellClick}
                  selectedCell={selectedCell}
                  showNumbers={true}
                  topLeftNumbers={topLeftNumbers}
                  bottomRightNumbers={bottomRightNumbers}
                  highlightedNumbers={[{ row: 0, col: 0, position: 'bottomRight' }]}
                  completedCells={completedCells}
                />
              </div>

              {/* Interaction Graph */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-bold text-foreground mb-2">Type Effectiveness</h3>
                <div className="flex gap-2">
                  {/* Attack Column */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-bold text-center text-muted-foreground mb-1">Attack</h3>
                    {attackElements.map((element) => (
                      <div
                        key={`attack-${element}`}
                        className={`relative w-10 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                          elementInfo[element].bgColor
                        } ${
                          hoveredElement && hoveredElement.element !== element && hoveredElement.side === "defense"
                            ? "opacity-30"
                            : selectedGraphElement && selectedGraphElement.element !== element && selectedGraphElement.side === "defense"
                            ? "opacity-30"
                            : "opacity-100"
                        } ${
                          selectedGraphElement?.element === element && selectedGraphElement?.side === "attack" ? "ring-2 ring-primary scale-105" : ""
                        }`}
                        onMouseEnter={() => setHoveredElement({ element, side: "attack" })}
                        onMouseLeave={() => setHoveredElement(null)}
                        onClick={() => setSelectedGraphElement(
                          selectedGraphElement?.element === element && selectedGraphElement?.side === "attack" 
                            ? null 
                            : { element, side: "attack" }
                        )}
                      >
                        <span className="text-xl">{elementInfo[element].emoji}</span>
                      </div>
                    ))}
                  </div>

                  {/* Edges */}
                  <svg width="60" height={defenseElements.length * 44} className="relative">
                    <defs>
                      <marker
                        id="arrowhead-defense2"
                        markerWidth="5"
                        markerHeight="5"
                        refX="4"
                        refY="1.5"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L0,3 L5,1.5 z" fill="currentColor" className="fill-foreground" />
                      </marker>
                    </defs>
                    {attackElements.map((attacker, attackIdx) =>
                      defenseElements.map((defender, defenseIdx) => {
                        const damage = damageValues[attacker][defender];
                        const highlighted = isEdgeHighlighted(attacker, defender);
                        const strokeWidth = damage === 4 ? 3 : damage === 2 ? 2 : damage === 1 ? 1 : 0.5;
                        const strokeColor = highlighted
                          ? damage === 4
                            ? "#ef4444"
                            : damage === 2
                            ? "#3b82f6"
                            : damage === 1
                            ? "#9ca3af"
                            : "#1f2937"
                          : "#374151";

                        const y1 = attackIdx * 44 + 20;
                        const y2 = defenseIdx * 44 + 20;

                        return (
                          <g key={`${attacker}-${defender}`}>
                            <line
                              x1="5"
                              y1={y1}
                              x2="52"
                              y2={y2}
                              stroke={strokeColor}
                              strokeWidth={strokeWidth}
                              opacity={highlighted ? 1 : 0.2}
                              className="transition-all"
                              markerEnd={highlighted ? "url(#arrowhead-defense2)" : ""}
                            />
                            {highlighted && (hoveredElement || selectedGraphElement) && (
                              <text
                                x="30"
                                y={(y1 + y2) / 2}
                                fill="currentColor"
                                className="text-xs font-bold fill-foreground"
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
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-bold text-center text-muted-foreground mb-1">Defense</h3>
                    {defenseElements.map((element) => (
                      <div
                        key={`defense-${element}`}
                        className={`relative w-10 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                          elementInfo[element].bgColor
                        } ${
                          hoveredElement && hoveredElement.element !== element && hoveredElement.side === "attack"
                            ? "opacity-30"
                            : selectedGraphElement && selectedGraphElement.element !== element && selectedGraphElement.side === "attack"
                            ? "opacity-30"
                            : "opacity-100"
                        } ${
                          selectedGraphElement?.element === element && selectedGraphElement?.side === "defense" ? "ring-2 ring-primary scale-105" : ""
                        }`}
                        onMouseEnter={() => setHoveredElement({ element, side: "defense" })}
                        onMouseLeave={() => setHoveredElement(null)}
                        onClick={() => setSelectedGraphElement(
                          selectedGraphElement?.element === element && selectedGraphElement?.side === "defense" 
                            ? null 
                            : { element, side: "defense" }
                        )}
                      >
                        <span className="text-xl">{elementInfo[element].emoji}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {!showElementButtons && !allCellsCompleted && (
              <div className="text-center bg-accent/10 p-4 rounded-lg border border-accent/30">
                <p className="text-lg font-medium text-accent">
                  Complete the grid using Sudoku rules and Defense values!
                </p>
              </div>
            )}

            {showElementButtons && (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Which element should go in this cell?
                </p>
                {error && (
                  <div className="text-center bg-destructive/10 p-3 rounded-lg border border-destructive/30">
                    <p className="text-sm font-medium text-destructive">
                      Try again! Check the Sudoku rules and type effectiveness.
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

            {allCellsCompleted && (
              <div className="space-y-4">
                <div className="text-center bg-secondary/10 p-4 rounded-lg border border-secondary/30">
                  <p className="text-lg font-medium text-secondary">
                    Perfect! You've mastered both Attack and Defense Dynamics!
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button onClick={onNext} size="lg" className="bg-primary hover:bg-primary/90">
                    Complete Tutorial
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default TutorialDefenseDynamic;
