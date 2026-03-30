declare module 'bcryptjs' {
  export function hash(
    data: string | Buffer,
    salt: string | number | Buffer,
    callback?: (err: Error | null, hashed: string | Buffer) => void
  ): string | Buffer;
  export function hash(
    data: string | Buffer,
    saltRounds: number,
    callback?: (err: Error | null, hashed: string | Buffer) => void
  ): string | Buffer;
  export function compare(
    data: string | Buffer,
    encrypted: string | Buffer,
    callback?: (err: Error | null, same: boolean) => void
  ): boolean;
  export function genSalt(
    rounds?: number,
    callback?: (err: Error | null, salt: string | Buffer) => void
  ): string | Buffer;
  export function compare(
    data: string | Buffer,
    encrypted: string | Buffer,
    salt: string | Buffer,
    callback?: (err: Error | null, same: boolean) => void
  ): boolean;
}
