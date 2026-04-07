import { Model, Document } from 'mongoose'
import { IBaseRepository } from './IBaseRepository'


export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T> {

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
