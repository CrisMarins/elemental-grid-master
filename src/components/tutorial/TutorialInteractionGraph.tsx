import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TutorialInteractionGraphProps {
  onNext: () => void;
}

type Element = "grass" | "fire" | "water" | "electric" | "ground";

const TutorialInteractionGraph = ({ onNext }: TutorialInteractionGraphProps) => {
  const [hoveredElement, setHoveredElement] = useState<{ element: Element; side: "attack" | "defense" } | null>(null);
  const [clickedElement, setClickedElement] = useState<{ element: Element; side: "attack" | "defense" } | null>(null);
  const [showSecondGraph, setShowSecondGraph] = useState(false);
  const [showGotItButton, setShowGotItButton] = useState(false);

  const damageValues: Record<Element, Record<Element, number>> = {
    grass: { grass: 1, fire: 1, water: 4, electric: 0, ground: 0 },
    fire: { grass: 4, fire: 1, water: 1, electric: 0, ground: 0 },
    water: { grass: 1, fire: 4, water: 1, electric: 0, ground: 0 },
    electric: { grass: 1, fire: 2, water: 4, electric: 0, ground: 0 },
    ground: { grass: 0, fire: 0, water: 0, electric: 0, ground: 0 },
  };

  const elementInfo: Record<Element, { emoji: string; color: string; bgColor: string }> = {
    grass: { emoji: "🌿", color: "text-secondary", bgColor: "bg-secondary/20" },
    fire: { emoji: "🔥", color: "text-accent", bgColor: "bg-accent/20" },
    water: { emoji: "💧", color: "text-water", bgColor: "bg-water/20" },
    electric: { emoji: "⚡", color: "text-yellow-400", bgColor: "bg-yellow-400/20" },
    ground: { emoji: "🏔️", color: "text-orange-700", bgColor: "bg-orange-700/20" },
  };

  const handleElementClick = (element: Element, side: "attack" | "defense") => {
    setClickedElement({ element, side });
    if (!showSecondGraph && (element === "grass" || element === "fire" || element === "water")) {
      setShowGotItButton(true);
    }
  };

  const handleGotIt = () => {
    setShowSecondGraph(true);
    setShowGotItButton(false);
    setClickedElement(null);
  };

  const isEdgeHighlighted = (from: Element, to: Element) => {
    if (!hoveredElement && !clickedElement) return true;
    if (clickedElement) {
      if (clickedElement.side === "attack" && clickedElement.element === from) return true;
      if (clickedElement.side === "defense" && clickedElement.element === to) return true;
      return false;
    }
    if (hoveredElement.side === "attack" && hoveredElement.element === from) return true;
    if (hoveredElement.side === "defense" && hoveredElement.element === to) return true;
    return false;
  };

  const attackElements: Element[] = showSecondGraph ? ["electric"] : ["grass", "fire", "water"];
  const defenseElements: Element[] = showSecondGraph ? ["grass", "fire", "water", "ground"] : ["grass", "fire", "water"];

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground">
          The Neighboring Rule: Type Interactions
        </h2>
        
        <div className="bg-muted/30 p-6 rounded-lg space-y-3">
          {!showSecondGraph ? (
            <>
              <p className="text-lg text-foreground">
                Elements interact with each other through <span className="font-bold">type effectiveness</span>!
              </p>
              <p className="text-muted-foreground">
                Hover over any element to see how it interacts. Click to explore!
              </p>
            </>
          ) : (
            <>
              <p className="text-lg text-foreground">
                There are <span className="font-bold">4 different effectiveness types</span>:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-1">
                <li><span className="font-bold text-accent">Super Effective (4)</span> - Deals massive damage</li>
                <li><span className="font-bold text-foreground">Normal Effectiveness (2)</span> - Standard damage</li>
                <li><span className="font-bold text-muted-foreground">Not Very Effective (1)</span> - Reduced damage</li>
                <li><span className="font-bold text-destructive">No Effect (0)</span> - Deals no damage at all</li>
              </ul>
               <p className="text-muted-foreground mt-2">
                 Electric deals <span className="font-bold">normal damage</span> to Fire, <span className="font-bold">super effective</span> to Water, but has <span className="font-bold">no effect</span> on Ground!
               </p>
            </>
          )}
        </div>

        <div className="flex justify-center items-center gap-8 py-8">
          {/* Attack Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-center text-foreground mb-2">Attack</h3>
            {attackElements.map((element) => (
              <div
                key={`attack-${element}`}
                className={`relative w-20 h-20 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                  elementInfo[element].bgColor
                } ${
                  hoveredElement && hoveredElement.element !== element && hoveredElement.side === "defense"
                    ? "opacity-30"
                    : clickedElement && clickedElement.element !== element && clickedElement.side === "defense"
                    ? "opacity-30"
                    : "opacity-100"
                } ${
                  clickedElement?.element === element && clickedElement?.side === "attack" ? "ring-4 ring-primary scale-110" : ""
                }`}
                onMouseEnter={() => setHoveredElement({ element, side: "attack" })}
                onMouseLeave={() => setHoveredElement(null)}
                onClick={() => handleElementClick(element, "attack")}
              >
                <span className="text-4xl">{elementInfo[element].emoji}</span>
              </div>
            ))}
          </div>

          {/* Edges */}
          <svg width="150" height={Math.max(attackElements.length, defenseElements.length) * 96} className="relative">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="currentColor" className="fill-foreground" />
              </marker>
            </defs>
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

                const y1 = attackIdx * 96 + 40;
                const y2 = defenseIdx * 96 + 40;

                return (
                  <g key={`${attacker}-${defender}`}>
                    <line
                      x1="10"
                      y1={y1}
                      x2="140"
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      opacity={highlighted ? 1 : 0.2}
                      className="transition-all"
                      markerEnd={highlighted ? "url(#arrowhead)" : ""}
                    />
                    {highlighted && (hoveredElement || clickedElement) && (
                      <text
                        x="75"
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
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-center text-foreground mb-2">Defense</h3>
            {defenseElements.map((element) => (
              <div
                key={`defense-${element}`}
                className={`relative w-20 h-20 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                  elementInfo[element].bgColor
                } ${
                  hoveredElement && hoveredElement.element !== element && hoveredElement.side === "attack"
                    ? "opacity-30"
                    : clickedElement && clickedElement.element !== element && clickedElement.side === "attack"
                    ? "opacity-30"
                    : "opacity-100"
                } ${
                  clickedElement?.element === element && clickedElement?.side === "defense" ? "ring-4 ring-primary scale-110" : ""
                }`}
                onMouseEnter={() => setHoveredElement({ element, side: "defense" })}
                onMouseLeave={() => setHoveredElement(null)}
                onClick={() => handleElementClick(element, "defense")}
              >
                <span className="text-4xl">{elementInfo[element].emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {showGotItButton && !showSecondGraph && (
          <div className="flex justify-center">
            <Button onClick={handleGotIt} size="lg" className="bg-primary hover:bg-primary/90">
              Got it!
            </Button>
          </div>
        )}

        {showSecondGraph && (
          <div className="flex justify-center">
            <Button onClick={onNext} size="lg" className="bg-primary hover:bg-primary/90">
              Continue Tutorial
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TutorialInteractionGraph;
