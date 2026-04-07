import { Document } from 'mongoose'

/**
 * Generic base repository interface.
 * Domain-specific interfaces extend this to inherit common CRUD contracts.
 */
export interface IBaseRepository<T extends Document> {
  findById(id: string): Promise<T | null>
  findOne(filter: Record<string, unknown>): Promise<T | null>
  create(data: Partial<T>): Promise<T>
  updateById(id: string, data: Partial<T>): Promise<T | null>
  deleteById(id: string): Promise<void>
}
