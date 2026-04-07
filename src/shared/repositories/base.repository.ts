import { Model, Document } from 'mongoose'
import { IBaseRepository } from './IBaseRepository'

/**
 * Generic abstract base repository.
 *
 * Open/Closed Principle:
 *   CLOSED — common CRUD lives here and is never changed when adding new repos.
 *   OPEN   — each concrete repo extends and adds only its domain-specific queries.
 *
 * Single generic <T extends Document> works cleanly because the project's entity
 * interfaces (IUser, IGym, …) already extend Mongoose Document, so the same type
 * serves both as the Mongoose document type and the public interface type.
 */
export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T> {

  /** Every concrete repo declares which Mongoose model it operates on. */
  protected abstract model: Model<T>

  // ── Common CRUD ──────────────────────────────────────────────────────────────

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).lean() as unknown as T | null
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return this.model.findOne(filter as any).lean() as unknown as T | null
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data as any)
    return doc.toObject() as T
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, data as any, { new: true })
      .lean() as unknown as T | null
  }

  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id)
  }
}
