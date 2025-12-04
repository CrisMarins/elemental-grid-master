// Puzzle Generator for SuPoke
// Ported from Python notebook logic with configurable elements

export type ElementType = 
  | "grass" | "fire" | "water" | "electric" | "ground"
  | "normal" | "fighting" | "flying" | "poison" | "rock" 
  | "bug" | "ghost" | "steel" | "psychic" | "ice" 
  | "dragon" | "dark" | "fairy";

// Full Pokemon type effectiveness chart (attacker -> defender)
// Values: 0 = no effect, 1 = not very effective, 2 = normal, 4 = super effective
const fullTypeChart: Record<ElementType, Record<ElementType, number>> = {
  normal: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 0, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1 },
  fighting: { normal: 2, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 2, bug: 1, ghost: 0, steel: 2, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 2, dragon: 1, dark: 2, fairy: 1 },
  flying: { normal: 1, fighting: 2, flying: 1, poison: 1, ground: 1, rock: 1, bug: 2, ghost: 1, steel: 1, fire: 1, water: 1, grass: 2, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1 },
  poison: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 1, steel: 0, fire: 1, water: 1, grass: 2, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 2 },
  ground: { normal: 1, fighting: 1, flying: 0, poison: 2, ground: 1, rock: 2, bug: 1, ghost: 1, steel: 2, fire: 2, water: 1, grass: 1, electric: 2, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1 },
  rock: { normal: 1, fighting: 1, flying: 2, poison: 1, ground: 1, rock: 1, bug: 2, ghost: 1, steel: 1, fire: 2, water: 1, grass: 1, electric: 1, psychic: 1, ice: 2, dragon: 1, dark: 1, fairy: 1 },
  bug: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 1, steel: 1, fire: 1, water: 1, grass: 2, electric: 1, psychic: 2, ice: 1, dragon: 1, dark: 2, fairy: 1 },
  ghost: { normal: 0, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 2, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 2, ice: 1, dragon: 1, dark: 1, fairy: 1 },
  steel: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 2, bug: 1, ghost: 1, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 2, dragon: 1, dark: 1, fairy: 2 },
  fire: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 2, ghost: 1, steel: 2, fire: 1, water: 1, grass: 2, electric: 1, psychic: 1, ice: 2, dragon: 1, dark: 1, fairy: 1 },
  water: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 2, rock: 2, bug: 1, ghost: 1, steel: 1, fire: 2, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1 },
  grass: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 2, rock: 2, bug: 1, ghost: 1, steel: 1, fire: 1, water: 2, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1 },
  electric: { normal: 1, fighting: 1, flying: 2, poison: 1, ground: 0, rock: 1, bug: 1, ghost: 1, steel: 1, fire: 1, water: 4, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 1, fairy: 1 },
  psychic: { normal: 1, fighting: 2, flying: 1, poison: 2, ground: 1, rock: 1, bug: 1, ghost: 1, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 1, dark: 0, fairy: 1 },
  ice: { normal: 1, fighting: 1, flying: 2, poison: 1, ground: 2, rock: 1, bug: 1, ghost: 1, steel: 1, fire: 1, water: 1, grass: 2, electric: 1, psychic: 1, ice: 1, dragon: 2, dark: 1, fairy: 1 },
  dragon: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 1, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 2, dark: 1, fairy: 0 },
  dark: { normal: 1, fighting: 1, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 2, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 2, ice: 1, dragon: 1, dark: 1, fairy: 1 },
  fairy: { normal: 1, fighting: 2, flying: 1, poison: 1, ground: 1, rock: 1, bug: 1, ghost: 1, steel: 1, fire: 1, water: 1, grass: 1, electric: 1, psychic: 1, ice: 1, dragon: 2, dark: 2, fairy: 1 },
};

// Simplified chart for common game elements (grass, fire, water, electric, ground)
export const simplifiedTypeChart: Record<string, Record<string, number>> = {
  grass: { grass: 1, fire: 1, water: 4, electric: 1, ground: 1 },
  fire: { grass: 4, fire: 1, water: 1, electric: 1, ground: 1 },
  water: { grass: 1, fire: 4, water: 1, electric: 1, ground: 2 },
  electric: { grass: 1, fire: 1, water: 4, electric: 1, ground: 0 },
  ground: { grass: 1, fire: 2, water: 1, electric: 4, ground: 1 },
};

export function getDamage(attacker: string, defender: string): number {
  // Check simplified chart first
  if (simplifiedTypeChart[attacker]?.[defender] !== undefined) {
    return simplifiedTypeChart[attacker][defender];
  }
  // Fallback to full chart
  return fullTypeChart[attacker as ElementType]?.[defender as ElementType] ?? 1;
}

// Generate a valid Latin square (sudoku without boxes) for given elements
export function generateLatinSquare(elements: string[]): string[][] {
  const n = elements.length;
  const grid: string[][] = [];
  
  // Simple Latin square: shift elements by row index
  for (let i = 0; i < n; i++) {
    const row: string[] = [];
    for (let j = 0; j < n; j++) {
      row.push(elements[(i + j) % n]);
    }
    grid.push(row);
  }
  
  return grid;
}

// Calculate attack and defense grids from a solution grid
export function calculateAttackDefenseGrids(
  solutionGrid: string[][],
  elements: string[]
): { attackGrid: number[][]; defenseGrid: number[][] } {
  const size = solutionGrid.length;
  const attackGrid: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
  const defenseGrid: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cellType = solutionGrid[row][col];
      
      // Check all 8 neighbors (including diagonals)
      for (let a = -1; a <= 1; a++) {
        for (let b = -1; b <= 1; b++) {
          if (a === 0 && b === 0) continue; // Skip self
          
          const neighborRow = row + a;
          const neighborCol = col + b;
          
          // Check bounds
          if (neighborRow >= 0 && neighborRow < size && 
              neighborCol >= 0 && neighborCol < size) {
            const neighborType = solutionGrid[neighborRow][neighborCol];
            
            // Attack: damage this cell deals to neighbor
            attackGrid[row][col] += getDamage(cellType, neighborType);
            // Defense: damage this cell receives from neighbor
            defenseGrid[row][col] += getDamage(neighborType, cellType);
          }
        }
      }
    }
  }

  return { attackGrid, defenseGrid };
}

// Generate a complete puzzle with specified elements
export function generatePuzzle(elements: string[]): {
  solutionGrid: string[][];
  attackGrid: number[][];
  defenseGrid: number[][];
} {
  const solutionGrid = generateLatinSquare(elements);
  const { attackGrid, defenseGrid } = calculateAttackDefenseGrids(solutionGrid, elements);
  
  return { solutionGrid, attackGrid, defenseGrid };
}

// Convert grids to CSV format
export function gridToCSV(grid: (string | number)[][]): string {
  return grid.map(row => row.join(',')).join('\n');
}

// Shuffle array using Fisher-Yates
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate a randomized valid Latin square
export function generateRandomLatinSquare(elements: string[]): string[][] {
  const n = elements.length;
  const shuffledElements = shuffleArray(elements);
  const grid: string[][] = [];
  
  // Create a random permutation pattern
  const rowPermutation = shuffleArray([...Array(n).keys()]);
  
  for (let i = 0; i < n; i++) {
    const row: string[] = [];
    for (let j = 0; j < n; j++) {
      row.push(shuffledElements[(rowPermutation[i] + j) % n]);
    }
    grid.push(row);
  }
  
  return grid;
}
