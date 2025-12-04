import { cn } from "@/lib/utils";

interface GameGridProps {
  gridState: (string | null)[][];
  highlightedCells?: [number, number][];
  onCellClick?: (row: number, col: number) => void;
  selectedCell?: { row: number; col: number } | null;
  showNumbers?: boolean;
  topLeftNumbers?: number[][];
  bottomRightNumbers?: number[][];
  highlightedNumbers?: { row: number; col: number; position: 'topLeft' | 'bottomRight' }[];
  completedCells?: boolean[][];
}

const GameGrid = ({ 
  gridState, 
  highlightedCells = [], 
  onCellClick,
  selectedCell,
  showNumbers = false,
  topLeftNumbers = [],
  bottomRightNumbers = [],
  highlightedNumbers = [],
  completedCells
}: GameGridProps) => {
  const isHighlighted = (row: number, col: number) => {
    return highlightedCells.some(([r, c]) => r === row && c === col);
  };

  const isSelected = (row: number, col: number) => {
    return selectedCell?.row === row && selectedCell?.col === col;
  };

  const isNumberHighlighted = (row: number, col: number, position: 'topLeft' | 'bottomRight') => {
    return highlightedNumbers.some(hn => hn.row === row && hn.col === col && hn.position === position);
  };

  const getElementDisplay = (element: string | null) => {
    if (!element) return null;
    
    const elements: Record<string, { emoji: string; color: string }> = {
      grass: { emoji: "🌿", color: "text-secondary" },
      fire: { emoji: "🔥", color: "text-accent" },
      water: { emoji: "💧", color: "text-water" },
      electric: { emoji: "⚡", color: "text-yellow-400" },
      ground: { emoji: "🏔️", color: "text-orange-700" },
    };

    return elements[element] || null;
  };

  return (
    <div className="inline-block bg-grid-border p-2 rounded-lg">
      <div className="grid grid-cols-3 gap-1">
        {gridState.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const elementDisplay = cell ? getElementDisplay(cell) : null;
            const highlighted = isHighlighted(rowIndex, colIndex);
            const selected = isSelected(rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onCellClick?.(rowIndex, colIndex)}
                className={cn(
                  "w-24 h-24 bg-grid-cell border-2 border-grid-border rounded-lg",
                  "flex items-center justify-center relative",
                  "transition-all duration-300 cursor-pointer",
                  highlighted && "bg-grid-highlight ring-2 ring-water",
                  selected && "ring-4 ring-water scale-105",
                  !cell && "hover:bg-grid-highlight/50",
                  cell && "cursor-default",
                  completedCells?.[rowIndex]?.[colIndex] && "completion-shine"
                )}
              >
                {showNumbers && topLeftNumbers.length > 0 && bottomRightNumbers.length > 0 && (
                  <>
                    <span className={cn(
                      "absolute top-1 left-1 text-sm font-mono transition-all duration-300",
                      isNumberHighlighted(rowIndex, colIndex, 'topLeft') 
                        ? "text-accent font-bold scale-125 ring-2 ring-accent rounded px-1" 
                        : "text-muted-foreground/60"
                    )}>
                      {topLeftNumbers[rowIndex]?.[colIndex]}
                    </span>
                    <span className={cn(
                      "absolute bottom-1 right-1 text-sm font-mono transition-all duration-300",
                      isNumberHighlighted(rowIndex, colIndex, 'bottomRight') 
                        ? "text-water font-bold scale-125 ring-2 ring-water rounded px-1" 
                        : "text-muted-foreground/60"
                    )}>
                      {bottomRightNumbers[rowIndex]?.[colIndex]}
                    </span>
                  </>
                )}
                
                {elementDisplay && (
                  <span className="text-4xl">{elementDisplay.emoji}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameGrid;
