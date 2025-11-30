import { cn } from "@/lib/utils";

interface GameGridProps {
  gridState: (string | null)[][];
  highlightedCells?: [number, number][];
  onCellClick?: (row: number, col: number) => void;
  selectedCell?: { row: number; col: number } | null;
  showNumbers?: boolean;
}

const GameGrid = ({ 
  gridState, 
  highlightedCells = [], 
  onCellClick,
  selectedCell,
  showNumbers = false
}: GameGridProps) => {
  const isHighlighted = (row: number, col: number) => {
    return highlightedCells.some(([r, c]) => r === row && c === col);
  };

  const isSelected = (row: number, col: number) => {
    return selectedCell?.row === row && selectedCell?.col === col;
  };

  const getElementDisplay = (element: string | null) => {
    if (!element) return null;
    
    const elements: Record<string, { emoji: string; color: string }> = {
      grass: { emoji: "🌿", color: "text-secondary" },
      fire: { emoji: "🔥", color: "text-accent" },
      water: { emoji: "💧", color: "text-water" },
    };

    return elements[element] || null;
  };

  // Example numbers for demonstration (these would come from CSV in full implementation)
  const topLeftNumbers = [
    [3, 1, 2],
    [2, 3, 1],
    [1, 2, 3],
  ];
  
  const bottomRightNumbers = [
    [2, 3, 1],
    [1, 2, 3],
    [3, 1, 2],
  ];

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
                  cell && "cursor-default"
                )}
              >
                {showNumbers && (
                  <>
                    <span className="absolute top-1 left-1 text-xs text-muted-foreground/20">
                      {topLeftNumbers[rowIndex][colIndex]}
                    </span>
                    <span className="absolute bottom-1 right-1 text-xs text-muted-foreground/20">
                      {bottomRightNumbers[rowIndex][colIndex]}
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
