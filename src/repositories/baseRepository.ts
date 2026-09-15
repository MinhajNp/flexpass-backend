import type { Document, Model } from 'mongoose';
import type { IBaseRepository } from '../interfaces/repositories/IBaseRepository.js';

export abstract class BaseRepository<
  T extends Document,
> implements IBaseRepository<T> {
  protected abstract model: Model<T>;

  // ==============================
  // FIND BY ID
  // ==============================

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  // ==============================
  // FIND ONE
  // ==============================

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  // ==============================
  // CREATE
  // ==============================

  async create(data: Partial<T>): Promise<T> {
    const document = await this.model.create(data);
    return document.toObject();
  }

  // ==============================
  // UPDATE
  // ==============================

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  // ==============================
  // DELETE
  // ==============================

  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
