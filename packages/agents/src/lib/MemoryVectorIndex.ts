import { MemoryVectorIndex } from 'modelfusion';
import { z } from 'zod';

/**
 * Vector index item interface
 */
interface IVectorIndexItem {
  id: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

/**
 * Search result interface extending the vector item
 */
interface IVectorSearchResult extends IVectorIndexItem {
  similarity?: number;
}

/**
 * Constants for vector index operations
 */
const CONSTANTS = {
  DEFAULT_TOP_K: 5,
  LOG_PREFIX: '[MemoryVectorIndex]',
} as const;

/**
 * Base schema for vector index items
 */
const BaseVectorItemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  vector: z.array(z.number()),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Array schema for vector items validation
 */
const VectorItemsSchema = z.array(BaseVectorItemSchema);

/**
 * Facade for integration with modelfusion's in-memory vector index.
 * Encapsulates upsert, retrieve and index management operations.
 */
export class MemoryVectorIndexFacade {
  private index: MemoryVectorIndex<IVectorIndexItem>;
  private logger: Console;

  constructor(logger: Console = console) {
    this.index = new MemoryVectorIndex<IVectorIndexItem>();
    this.logger = logger;
  }

  /**
   * Upserts (inserts/updates) vectors in the index.
   * @param items - Array of objects { id, vector, metadata }
   * @throws Error if items validation fails
   */
  public async upsert(items: IVectorIndexItem[]): Promise<void> {
    const validationResult = VectorItemsSchema.safeParse(items);

    if (!validationResult.success) {
      throw new Error(`Invalid payload for upsert: ${validationResult.error.message}`);
    }

    this.logger.log(`${CONSTANTS.LOG_PREFIX} Upserting ${items.length} items...`);

    await this.index.upsertMany(
      items.map((item) => ({
        id: item.id,
        vector: item.vector,
        data: item,
      }))
    );
  }

  /**
   * Retrieves the most similar vectors to a query vector.
   * @param vector - Query vector
   * @param topK - Number of results to return
   * @returns Array of similar vectors with their similarity scores
   */
  public async retrieve(vector: number[], topK = CONSTANTS.DEFAULT_TOP_K): Promise<IVectorSearchResult[]> {
    this.logger.log(`${CONSTANTS.LOG_PREFIX} Retrieving top ${topK} for query vector...`);

    const results = await this.index.queryByVector({
      queryVector: vector,
      maxResults: topK,
    });

    return results.map((result) => ({
      ...result.data,
      similarity: result.similarity,
    }));
  }

  /**
   * Clears the index (removes all vectors).
   */
  public clear(): void {
    this.logger.log(`${CONSTANTS.LOG_PREFIX} Clearing index...`);
    this.index = new MemoryVectorIndex<IVectorIndexItem>();
  }
}

// Default instance exported for incremental use
export const memoryVectorIndex = new MemoryVectorIndexFacade();
