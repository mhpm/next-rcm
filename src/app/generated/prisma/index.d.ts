
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Churches
 * 
 */
export type Churches = $Result.DefaultSelection<Prisma.$ChurchesPayload>
/**
 * Model Members
 * 
 */
export type Members = $Result.DefaultSelection<Prisma.$MembersPayload>
/**
 * Model Ministries
 * 
 */
export type Ministries = $Result.DefaultSelection<Prisma.$MinistriesPayload>
/**
 * Model MemberMinistry
 * 
 */
export type MemberMinistry = $Result.DefaultSelection<Prisma.$MemberMinistryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MemberRole: {
  MIEMBRO: 'MIEMBRO',
  SUPERVISOR: 'SUPERVISOR',
  LIDER: 'LIDER',
  ANFITRION: 'ANFITRION',
  PASTOR: 'PASTOR',
  TESORERO: 'TESORERO'
};

export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole]


export const Gender: {
  MASCULINO: 'MASCULINO',
  FEMENINO: 'FEMENINO'
};

export type Gender = (typeof Gender)[keyof typeof Gender]

}

export type MemberRole = $Enums.MemberRole

export const MemberRole: typeof $Enums.MemberRole

export type Gender = $Enums.Gender

export const Gender: typeof $Enums.Gender

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Churches
 * const churches = await prisma.churches.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Churches
   * const churches = await prisma.churches.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.churches`: Exposes CRUD operations for the **Churches** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Churches
    * const churches = await prisma.churches.findMany()
    * ```
    */
  get churches(): Prisma.ChurchesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.members`: Exposes CRUD operations for the **Members** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Members
    * const members = await prisma.members.findMany()
    * ```
    */
  get members(): Prisma.MembersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ministries`: Exposes CRUD operations for the **Ministries** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ministries
    * const ministries = await prisma.ministries.findMany()
    * ```
    */
  get ministries(): Prisma.MinistriesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.memberMinistry`: Exposes CRUD operations for the **MemberMinistry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MemberMinistries
    * const memberMinistries = await prisma.memberMinistry.findMany()
    * ```
    */
  get memberMinistry(): Prisma.MemberMinistryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Churches: 'Churches',
    Members: 'Members',
    Ministries: 'Ministries',
    MemberMinistry: 'MemberMinistry'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "churches" | "members" | "ministries" | "memberMinistry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Churches: {
        payload: Prisma.$ChurchesPayload<ExtArgs>
        fields: Prisma.ChurchesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChurchesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChurchesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>
          }
          findFirst: {
            args: Prisma.ChurchesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChurchesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>
          }
          findMany: {
            args: Prisma.ChurchesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>[]
          }
          create: {
            args: Prisma.ChurchesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>
          }
          createMany: {
            args: Prisma.ChurchesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChurchesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>[]
          }
          delete: {
            args: Prisma.ChurchesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>
          }
          update: {
            args: Prisma.ChurchesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>
          }
          deleteMany: {
            args: Prisma.ChurchesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChurchesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChurchesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>[]
          }
          upsert: {
            args: Prisma.ChurchesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurchesPayload>
          }
          aggregate: {
            args: Prisma.ChurchesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChurches>
          }
          groupBy: {
            args: Prisma.ChurchesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChurchesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChurchesCountArgs<ExtArgs>
            result: $Utils.Optional<ChurchesCountAggregateOutputType> | number
          }
        }
      }
      Members: {
        payload: Prisma.$MembersPayload<ExtArgs>
        fields: Prisma.MembersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MembersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MembersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>
          }
          findFirst: {
            args: Prisma.MembersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MembersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>
          }
          findMany: {
            args: Prisma.MembersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>[]
          }
          create: {
            args: Prisma.MembersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>
          }
          createMany: {
            args: Prisma.MembersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MembersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>[]
          }
          delete: {
            args: Prisma.MembersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>
          }
          update: {
            args: Prisma.MembersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>
          }
          deleteMany: {
            args: Prisma.MembersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MembersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MembersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>[]
          }
          upsert: {
            args: Prisma.MembersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MembersPayload>
          }
          aggregate: {
            args: Prisma.MembersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMembers>
          }
          groupBy: {
            args: Prisma.MembersGroupByArgs<ExtArgs>
            result: $Utils.Optional<MembersGroupByOutputType>[]
          }
          count: {
            args: Prisma.MembersCountArgs<ExtArgs>
            result: $Utils.Optional<MembersCountAggregateOutputType> | number
          }
        }
      }
      Ministries: {
        payload: Prisma.$MinistriesPayload<ExtArgs>
        fields: Prisma.MinistriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MinistriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MinistriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>
          }
          findFirst: {
            args: Prisma.MinistriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MinistriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>
          }
          findMany: {
            args: Prisma.MinistriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>[]
          }
          create: {
            args: Prisma.MinistriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>
          }
          createMany: {
            args: Prisma.MinistriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MinistriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>[]
          }
          delete: {
            args: Prisma.MinistriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>
          }
          update: {
            args: Prisma.MinistriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>
          }
          deleteMany: {
            args: Prisma.MinistriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MinistriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MinistriesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>[]
          }
          upsert: {
            args: Prisma.MinistriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MinistriesPayload>
          }
          aggregate: {
            args: Prisma.MinistriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMinistries>
          }
          groupBy: {
            args: Prisma.MinistriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<MinistriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.MinistriesCountArgs<ExtArgs>
            result: $Utils.Optional<MinistriesCountAggregateOutputType> | number
          }
        }
      }
      MemberMinistry: {
        payload: Prisma.$MemberMinistryPayload<ExtArgs>
        fields: Prisma.MemberMinistryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MemberMinistryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MemberMinistryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>
          }
          findFirst: {
            args: Prisma.MemberMinistryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MemberMinistryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>
          }
          findMany: {
            args: Prisma.MemberMinistryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>[]
          }
          create: {
            args: Prisma.MemberMinistryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>
          }
          createMany: {
            args: Prisma.MemberMinistryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MemberMinistryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>[]
          }
          delete: {
            args: Prisma.MemberMinistryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>
          }
          update: {
            args: Prisma.MemberMinistryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>
          }
          deleteMany: {
            args: Prisma.MemberMinistryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MemberMinistryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MemberMinistryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>[]
          }
          upsert: {
            args: Prisma.MemberMinistryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberMinistryPayload>
          }
          aggregate: {
            args: Prisma.MemberMinistryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMemberMinistry>
          }
          groupBy: {
            args: Prisma.MemberMinistryGroupByArgs<ExtArgs>
            result: $Utils.Optional<MemberMinistryGroupByOutputType>[]
          }
          count: {
            args: Prisma.MemberMinistryCountArgs<ExtArgs>
            result: $Utils.Optional<MemberMinistryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    churches?: ChurchesOmit
    members?: MembersOmit
    ministries?: MinistriesOmit
    memberMinistry?: MemberMinistryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ChurchesCountOutputType
   */

  export type ChurchesCountOutputType = {
    memberMinistries: number
    members: number
    ministries: number
  }

  export type ChurchesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberMinistries?: boolean | ChurchesCountOutputTypeCountMemberMinistriesArgs
    members?: boolean | ChurchesCountOutputTypeCountMembersArgs
    ministries?: boolean | ChurchesCountOutputTypeCountMinistriesArgs
  }

  // Custom InputTypes
  /**
   * ChurchesCountOutputType without action
   */
  export type ChurchesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurchesCountOutputType
     */
    select?: ChurchesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChurchesCountOutputType without action
   */
  export type ChurchesCountOutputTypeCountMemberMinistriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberMinistryWhereInput
  }

  /**
   * ChurchesCountOutputType without action
   */
  export type ChurchesCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembersWhereInput
  }

  /**
   * ChurchesCountOutputType without action
   */
  export type ChurchesCountOutputTypeCountMinistriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MinistriesWhereInput
  }


  /**
   * Count Type MembersCountOutputType
   */

  export type MembersCountOutputType = {
    ministries: number
    ledMinistries: number
  }

  export type MembersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ministries?: boolean | MembersCountOutputTypeCountMinistriesArgs
    ledMinistries?: boolean | MembersCountOutputTypeCountLedMinistriesArgs
  }

  // Custom InputTypes
  /**
   * MembersCountOutputType without action
   */
  export type MembersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MembersCountOutputType
     */
    select?: MembersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MembersCountOutputType without action
   */
  export type MembersCountOutputTypeCountMinistriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberMinistryWhereInput
  }

  /**
   * MembersCountOutputType without action
   */
  export type MembersCountOutputTypeCountLedMinistriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MinistriesWhereInput
  }


  /**
   * Count Type MinistriesCountOutputType
   */

  export type MinistriesCountOutputType = {
    members: number
  }

  export type MinistriesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | MinistriesCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * MinistriesCountOutputType without action
   */
  export type MinistriesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MinistriesCountOutputType
     */
    select?: MinistriesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MinistriesCountOutputType without action
   */
  export type MinistriesCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberMinistryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Churches
   */

  export type AggregateChurches = {
    _count: ChurchesCountAggregateOutputType | null
    _min: ChurchesMinAggregateOutputType | null
    _max: ChurchesMaxAggregateOutputType | null
  }

  export type ChurchesMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChurchesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChurchesCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChurchesMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChurchesMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChurchesCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChurchesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Churches to aggregate.
     */
    where?: ChurchesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Churches to fetch.
     */
    orderBy?: ChurchesOrderByWithRelationInput | ChurchesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChurchesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Churches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Churches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Churches
    **/
    _count?: true | ChurchesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChurchesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChurchesMaxAggregateInputType
  }

  export type GetChurchesAggregateType<T extends ChurchesAggregateArgs> = {
        [P in keyof T & keyof AggregateChurches]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChurches[P]>
      : GetScalarType<T[P], AggregateChurches[P]>
  }




  export type ChurchesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChurchesWhereInput
    orderBy?: ChurchesOrderByWithAggregationInput | ChurchesOrderByWithAggregationInput[]
    by: ChurchesScalarFieldEnum[] | ChurchesScalarFieldEnum
    having?: ChurchesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChurchesCountAggregateInputType | true
    _min?: ChurchesMinAggregateInputType
    _max?: ChurchesMaxAggregateInputType
  }

  export type ChurchesGroupByOutputType = {
    id: string
    name: string
    slug: string
    createdAt: Date
    updatedAt: Date
    _count: ChurchesCountAggregateOutputType | null
    _min: ChurchesMinAggregateOutputType | null
    _max: ChurchesMaxAggregateOutputType | null
  }

  type GetChurchesGroupByPayload<T extends ChurchesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChurchesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChurchesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChurchesGroupByOutputType[P]>
            : GetScalarType<T[P], ChurchesGroupByOutputType[P]>
        }
      >
    >


  export type ChurchesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    memberMinistries?: boolean | Churches$memberMinistriesArgs<ExtArgs>
    members?: boolean | Churches$membersArgs<ExtArgs>
    ministries?: boolean | Churches$ministriesArgs<ExtArgs>
    _count?: boolean | ChurchesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["churches"]>

  export type ChurchesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["churches"]>

  export type ChurchesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["churches"]>

  export type ChurchesSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChurchesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "createdAt" | "updatedAt", ExtArgs["result"]["churches"]>
  export type ChurchesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberMinistries?: boolean | Churches$memberMinistriesArgs<ExtArgs>
    members?: boolean | Churches$membersArgs<ExtArgs>
    ministries?: boolean | Churches$ministriesArgs<ExtArgs>
    _count?: boolean | ChurchesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChurchesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ChurchesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ChurchesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Churches"
    objects: {
      memberMinistries: Prisma.$MemberMinistryPayload<ExtArgs>[]
      members: Prisma.$MembersPayload<ExtArgs>[]
      ministries: Prisma.$MinistriesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["churches"]>
    composites: {}
  }

  type ChurchesGetPayload<S extends boolean | null | undefined | ChurchesDefaultArgs> = $Result.GetResult<Prisma.$ChurchesPayload, S>

  type ChurchesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChurchesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChurchesCountAggregateInputType | true
    }

  export interface ChurchesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Churches'], meta: { name: 'Churches' } }
    /**
     * Find zero or one Churches that matches the filter.
     * @param {ChurchesFindUniqueArgs} args - Arguments to find a Churches
     * @example
     * // Get one Churches
     * const churches = await prisma.churches.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChurchesFindUniqueArgs>(args: SelectSubset<T, ChurchesFindUniqueArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Churches that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChurchesFindUniqueOrThrowArgs} args - Arguments to find a Churches
     * @example
     * // Get one Churches
     * const churches = await prisma.churches.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChurchesFindUniqueOrThrowArgs>(args: SelectSubset<T, ChurchesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Churches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurchesFindFirstArgs} args - Arguments to find a Churches
     * @example
     * // Get one Churches
     * const churches = await prisma.churches.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChurchesFindFirstArgs>(args?: SelectSubset<T, ChurchesFindFirstArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Churches that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurchesFindFirstOrThrowArgs} args - Arguments to find a Churches
     * @example
     * // Get one Churches
     * const churches = await prisma.churches.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChurchesFindFirstOrThrowArgs>(args?: SelectSubset<T, ChurchesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Churches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurchesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Churches
     * const churches = await prisma.churches.findMany()
     * 
     * // Get first 10 Churches
     * const churches = await prisma.churches.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const churchesWithIdOnly = await prisma.churches.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChurchesFindManyArgs>(args?: SelectSubset<T, ChurchesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Churches.
     * @param {ChurchesCreateArgs} args - Arguments to create a Churches.
     * @example
     * // Create one Churches
     * const Churches = await prisma.churches.create({
     *   data: {
     *     // ... data to create a Churches
     *   }
     * })
     * 
     */
    create<T extends ChurchesCreateArgs>(args: SelectSubset<T, ChurchesCreateArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Churches.
     * @param {ChurchesCreateManyArgs} args - Arguments to create many Churches.
     * @example
     * // Create many Churches
     * const churches = await prisma.churches.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChurchesCreateManyArgs>(args?: SelectSubset<T, ChurchesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Churches and returns the data saved in the database.
     * @param {ChurchesCreateManyAndReturnArgs} args - Arguments to create many Churches.
     * @example
     * // Create many Churches
     * const churches = await prisma.churches.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Churches and only return the `id`
     * const churchesWithIdOnly = await prisma.churches.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChurchesCreateManyAndReturnArgs>(args?: SelectSubset<T, ChurchesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Churches.
     * @param {ChurchesDeleteArgs} args - Arguments to delete one Churches.
     * @example
     * // Delete one Churches
     * const Churches = await prisma.churches.delete({
     *   where: {
     *     // ... filter to delete one Churches
     *   }
     * })
     * 
     */
    delete<T extends ChurchesDeleteArgs>(args: SelectSubset<T, ChurchesDeleteArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Churches.
     * @param {ChurchesUpdateArgs} args - Arguments to update one Churches.
     * @example
     * // Update one Churches
     * const churches = await prisma.churches.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChurchesUpdateArgs>(args: SelectSubset<T, ChurchesUpdateArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Churches.
     * @param {ChurchesDeleteManyArgs} args - Arguments to filter Churches to delete.
     * @example
     * // Delete a few Churches
     * const { count } = await prisma.churches.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChurchesDeleteManyArgs>(args?: SelectSubset<T, ChurchesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Churches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurchesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Churches
     * const churches = await prisma.churches.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChurchesUpdateManyArgs>(args: SelectSubset<T, ChurchesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Churches and returns the data updated in the database.
     * @param {ChurchesUpdateManyAndReturnArgs} args - Arguments to update many Churches.
     * @example
     * // Update many Churches
     * const churches = await prisma.churches.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Churches and only return the `id`
     * const churchesWithIdOnly = await prisma.churches.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChurchesUpdateManyAndReturnArgs>(args: SelectSubset<T, ChurchesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Churches.
     * @param {ChurchesUpsertArgs} args - Arguments to update or create a Churches.
     * @example
     * // Update or create a Churches
     * const churches = await prisma.churches.upsert({
     *   create: {
     *     // ... data to create a Churches
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Churches we want to update
     *   }
     * })
     */
    upsert<T extends ChurchesUpsertArgs>(args: SelectSubset<T, ChurchesUpsertArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Churches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurchesCountArgs} args - Arguments to filter Churches to count.
     * @example
     * // Count the number of Churches
     * const count = await prisma.churches.count({
     *   where: {
     *     // ... the filter for the Churches we want to count
     *   }
     * })
    **/
    count<T extends ChurchesCountArgs>(
      args?: Subset<T, ChurchesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChurchesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Churches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurchesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChurchesAggregateArgs>(args: Subset<T, ChurchesAggregateArgs>): Prisma.PrismaPromise<GetChurchesAggregateType<T>>

    /**
     * Group by Churches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurchesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChurchesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChurchesGroupByArgs['orderBy'] }
        : { orderBy?: ChurchesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChurchesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChurchesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Churches model
   */
  readonly fields: ChurchesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Churches.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChurchesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    memberMinistries<T extends Churches$memberMinistriesArgs<ExtArgs> = {}>(args?: Subset<T, Churches$memberMinistriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    members<T extends Churches$membersArgs<ExtArgs> = {}>(args?: Subset<T, Churches$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ministries<T extends Churches$ministriesArgs<ExtArgs> = {}>(args?: Subset<T, Churches$ministriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Churches model
   */
  interface ChurchesFieldRefs {
    readonly id: FieldRef<"Churches", 'String'>
    readonly name: FieldRef<"Churches", 'String'>
    readonly slug: FieldRef<"Churches", 'String'>
    readonly createdAt: FieldRef<"Churches", 'DateTime'>
    readonly updatedAt: FieldRef<"Churches", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Churches findUnique
   */
  export type ChurchesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * Filter, which Churches to fetch.
     */
    where: ChurchesWhereUniqueInput
  }

  /**
   * Churches findUniqueOrThrow
   */
  export type ChurchesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * Filter, which Churches to fetch.
     */
    where: ChurchesWhereUniqueInput
  }

  /**
   * Churches findFirst
   */
  export type ChurchesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * Filter, which Churches to fetch.
     */
    where?: ChurchesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Churches to fetch.
     */
    orderBy?: ChurchesOrderByWithRelationInput | ChurchesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Churches.
     */
    cursor?: ChurchesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Churches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Churches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Churches.
     */
    distinct?: ChurchesScalarFieldEnum | ChurchesScalarFieldEnum[]
  }

  /**
   * Churches findFirstOrThrow
   */
  export type ChurchesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * Filter, which Churches to fetch.
     */
    where?: ChurchesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Churches to fetch.
     */
    orderBy?: ChurchesOrderByWithRelationInput | ChurchesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Churches.
     */
    cursor?: ChurchesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Churches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Churches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Churches.
     */
    distinct?: ChurchesScalarFieldEnum | ChurchesScalarFieldEnum[]
  }

  /**
   * Churches findMany
   */
  export type ChurchesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * Filter, which Churches to fetch.
     */
    where?: ChurchesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Churches to fetch.
     */
    orderBy?: ChurchesOrderByWithRelationInput | ChurchesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Churches.
     */
    cursor?: ChurchesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Churches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Churches.
     */
    skip?: number
    distinct?: ChurchesScalarFieldEnum | ChurchesScalarFieldEnum[]
  }

  /**
   * Churches create
   */
  export type ChurchesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * The data needed to create a Churches.
     */
    data: XOR<ChurchesCreateInput, ChurchesUncheckedCreateInput>
  }

  /**
   * Churches createMany
   */
  export type ChurchesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Churches.
     */
    data: ChurchesCreateManyInput | ChurchesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Churches createManyAndReturn
   */
  export type ChurchesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * The data used to create many Churches.
     */
    data: ChurchesCreateManyInput | ChurchesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Churches update
   */
  export type ChurchesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * The data needed to update a Churches.
     */
    data: XOR<ChurchesUpdateInput, ChurchesUncheckedUpdateInput>
    /**
     * Choose, which Churches to update.
     */
    where: ChurchesWhereUniqueInput
  }

  /**
   * Churches updateMany
   */
  export type ChurchesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Churches.
     */
    data: XOR<ChurchesUpdateManyMutationInput, ChurchesUncheckedUpdateManyInput>
    /**
     * Filter which Churches to update
     */
    where?: ChurchesWhereInput
    /**
     * Limit how many Churches to update.
     */
    limit?: number
  }

  /**
   * Churches updateManyAndReturn
   */
  export type ChurchesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * The data used to update Churches.
     */
    data: XOR<ChurchesUpdateManyMutationInput, ChurchesUncheckedUpdateManyInput>
    /**
     * Filter which Churches to update
     */
    where?: ChurchesWhereInput
    /**
     * Limit how many Churches to update.
     */
    limit?: number
  }

  /**
   * Churches upsert
   */
  export type ChurchesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * The filter to search for the Churches to update in case it exists.
     */
    where: ChurchesWhereUniqueInput
    /**
     * In case the Churches found by the `where` argument doesn't exist, create a new Churches with this data.
     */
    create: XOR<ChurchesCreateInput, ChurchesUncheckedCreateInput>
    /**
     * In case the Churches was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChurchesUpdateInput, ChurchesUncheckedUpdateInput>
  }

  /**
   * Churches delete
   */
  export type ChurchesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
    /**
     * Filter which Churches to delete.
     */
    where: ChurchesWhereUniqueInput
  }

  /**
   * Churches deleteMany
   */
  export type ChurchesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Churches to delete
     */
    where?: ChurchesWhereInput
    /**
     * Limit how many Churches to delete.
     */
    limit?: number
  }

  /**
   * Churches.memberMinistries
   */
  export type Churches$memberMinistriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    where?: MemberMinistryWhereInput
    orderBy?: MemberMinistryOrderByWithRelationInput | MemberMinistryOrderByWithRelationInput[]
    cursor?: MemberMinistryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemberMinistryScalarFieldEnum | MemberMinistryScalarFieldEnum[]
  }

  /**
   * Churches.members
   */
  export type Churches$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    where?: MembersWhereInput
    orderBy?: MembersOrderByWithRelationInput | MembersOrderByWithRelationInput[]
    cursor?: MembersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MembersScalarFieldEnum | MembersScalarFieldEnum[]
  }

  /**
   * Churches.ministries
   */
  export type Churches$ministriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    where?: MinistriesWhereInput
    orderBy?: MinistriesOrderByWithRelationInput | MinistriesOrderByWithRelationInput[]
    cursor?: MinistriesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MinistriesScalarFieldEnum | MinistriesScalarFieldEnum[]
  }

  /**
   * Churches without action
   */
  export type ChurchesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Churches
     */
    select?: ChurchesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Churches
     */
    omit?: ChurchesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChurchesInclude<ExtArgs> | null
  }


  /**
   * Model Members
   */

  export type AggregateMembers = {
    _count: MembersCountAggregateOutputType | null
    _avg: MembersAvgAggregateOutputType | null
    _sum: MembersSumAggregateOutputType | null
    _min: MembersMinAggregateOutputType | null
    _max: MembersMaxAggregateOutputType | null
  }

  export type MembersAvgAggregateOutputType = {
    age: number | null
  }

  export type MembersSumAggregateOutputType = {
    age: number | null
  }

  export type MembersMinAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    age: number | null
    street: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string | null
    birthDate: Date | null
    baptismDate: Date | null
    role: $Enums.MemberRole | null
    gender: $Enums.Gender | null
    pictureUrl: string | null
    notes: string | null
    passwordHash: string | null
    church_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MembersMaxAggregateOutputType = {
    id: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    age: number | null
    street: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string | null
    birthDate: Date | null
    baptismDate: Date | null
    role: $Enums.MemberRole | null
    gender: $Enums.Gender | null
    pictureUrl: string | null
    notes: string | null
    passwordHash: string | null
    church_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MembersCountAggregateOutputType = {
    id: number
    firstName: number
    lastName: number
    email: number
    phone: number
    age: number
    street: number
    city: number
    state: number
    zip: number
    country: number
    birthDate: number
    baptismDate: number
    role: number
    gender: number
    pictureUrl: number
    notes: number
    passwordHash: number
    church_id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MembersAvgAggregateInputType = {
    age?: true
  }

  export type MembersSumAggregateInputType = {
    age?: true
  }

  export type MembersMinAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    age?: true
    street?: true
    city?: true
    state?: true
    zip?: true
    country?: true
    birthDate?: true
    baptismDate?: true
    role?: true
    gender?: true
    pictureUrl?: true
    notes?: true
    passwordHash?: true
    church_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MembersMaxAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    age?: true
    street?: true
    city?: true
    state?: true
    zip?: true
    country?: true
    birthDate?: true
    baptismDate?: true
    role?: true
    gender?: true
    pictureUrl?: true
    notes?: true
    passwordHash?: true
    church_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MembersCountAggregateInputType = {
    id?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    age?: true
    street?: true
    city?: true
    state?: true
    zip?: true
    country?: true
    birthDate?: true
    baptismDate?: true
    role?: true
    gender?: true
    pictureUrl?: true
    notes?: true
    passwordHash?: true
    church_id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MembersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Members to aggregate.
     */
    where?: MembersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MembersOrderByWithRelationInput | MembersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MembersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Members
    **/
    _count?: true | MembersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MembersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MembersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MembersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MembersMaxAggregateInputType
  }

  export type GetMembersAggregateType<T extends MembersAggregateArgs> = {
        [P in keyof T & keyof AggregateMembers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMembers[P]>
      : GetScalarType<T[P], AggregateMembers[P]>
  }




  export type MembersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MembersWhereInput
    orderBy?: MembersOrderByWithAggregationInput | MembersOrderByWithAggregationInput[]
    by: MembersScalarFieldEnum[] | MembersScalarFieldEnum
    having?: MembersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MembersCountAggregateInputType | true
    _avg?: MembersAvgAggregateInputType
    _sum?: MembersSumAggregateInputType
    _min?: MembersMinAggregateInputType
    _max?: MembersMaxAggregateInputType
  }

  export type MembersGroupByOutputType = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    age: number | null
    street: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string | null
    birthDate: Date | null
    baptismDate: Date | null
    role: $Enums.MemberRole
    gender: $Enums.Gender
    pictureUrl: string | null
    notes: string | null
    passwordHash: string | null
    church_id: string
    createdAt: Date
    updatedAt: Date
    _count: MembersCountAggregateOutputType | null
    _avg: MembersAvgAggregateOutputType | null
    _sum: MembersSumAggregateOutputType | null
    _min: MembersMinAggregateOutputType | null
    _max: MembersMaxAggregateOutputType | null
  }

  type GetMembersGroupByPayload<T extends MembersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MembersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MembersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MembersGroupByOutputType[P]>
            : GetScalarType<T[P], MembersGroupByOutputType[P]>
        }
      >
    >


  export type MembersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    age?: boolean
    street?: boolean
    city?: boolean
    state?: boolean
    zip?: boolean
    country?: boolean
    birthDate?: boolean
    baptismDate?: boolean
    role?: boolean
    gender?: boolean
    pictureUrl?: boolean
    notes?: boolean
    passwordHash?: boolean
    church_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ministries?: boolean | Members$ministriesArgs<ExtArgs>
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    ledMinistries?: boolean | Members$ledMinistriesArgs<ExtArgs>
    _count?: boolean | MembersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["members"]>

  export type MembersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    age?: boolean
    street?: boolean
    city?: boolean
    state?: boolean
    zip?: boolean
    country?: boolean
    birthDate?: boolean
    baptismDate?: boolean
    role?: boolean
    gender?: boolean
    pictureUrl?: boolean
    notes?: boolean
    passwordHash?: boolean
    church_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["members"]>

  export type MembersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    age?: boolean
    street?: boolean
    city?: boolean
    state?: boolean
    zip?: boolean
    country?: boolean
    birthDate?: boolean
    baptismDate?: boolean
    role?: boolean
    gender?: boolean
    pictureUrl?: boolean
    notes?: boolean
    passwordHash?: boolean
    church_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["members"]>

  export type MembersSelectScalar = {
    id?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    age?: boolean
    street?: boolean
    city?: boolean
    state?: boolean
    zip?: boolean
    country?: boolean
    birthDate?: boolean
    baptismDate?: boolean
    role?: boolean
    gender?: boolean
    pictureUrl?: boolean
    notes?: boolean
    passwordHash?: boolean
    church_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MembersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "firstName" | "lastName" | "email" | "phone" | "age" | "street" | "city" | "state" | "zip" | "country" | "birthDate" | "baptismDate" | "role" | "gender" | "pictureUrl" | "notes" | "passwordHash" | "church_id" | "createdAt" | "updatedAt", ExtArgs["result"]["members"]>
  export type MembersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ministries?: boolean | Members$ministriesArgs<ExtArgs>
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    ledMinistries?: boolean | Members$ledMinistriesArgs<ExtArgs>
    _count?: boolean | MembersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MembersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
  }
  export type MembersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
  }

  export type $MembersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Members"
    objects: {
      ministries: Prisma.$MemberMinistryPayload<ExtArgs>[]
      church: Prisma.$ChurchesPayload<ExtArgs>
      ledMinistries: Prisma.$MinistriesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string | null
      age: number | null
      street: string | null
      city: string | null
      state: string | null
      zip: string | null
      country: string | null
      birthDate: Date | null
      baptismDate: Date | null
      role: $Enums.MemberRole
      gender: $Enums.Gender
      pictureUrl: string | null
      notes: string | null
      passwordHash: string | null
      church_id: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["members"]>
    composites: {}
  }

  type MembersGetPayload<S extends boolean | null | undefined | MembersDefaultArgs> = $Result.GetResult<Prisma.$MembersPayload, S>

  type MembersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MembersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MembersCountAggregateInputType | true
    }

  export interface MembersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Members'], meta: { name: 'Members' } }
    /**
     * Find zero or one Members that matches the filter.
     * @param {MembersFindUniqueArgs} args - Arguments to find a Members
     * @example
     * // Get one Members
     * const members = await prisma.members.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MembersFindUniqueArgs>(args: SelectSubset<T, MembersFindUniqueArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Members that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MembersFindUniqueOrThrowArgs} args - Arguments to find a Members
     * @example
     * // Get one Members
     * const members = await prisma.members.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MembersFindUniqueOrThrowArgs>(args: SelectSubset<T, MembersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Members that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersFindFirstArgs} args - Arguments to find a Members
     * @example
     * // Get one Members
     * const members = await prisma.members.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MembersFindFirstArgs>(args?: SelectSubset<T, MembersFindFirstArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Members that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersFindFirstOrThrowArgs} args - Arguments to find a Members
     * @example
     * // Get one Members
     * const members = await prisma.members.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MembersFindFirstOrThrowArgs>(args?: SelectSubset<T, MembersFindFirstOrThrowArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Members that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Members
     * const members = await prisma.members.findMany()
     * 
     * // Get first 10 Members
     * const members = await prisma.members.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const membersWithIdOnly = await prisma.members.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MembersFindManyArgs>(args?: SelectSubset<T, MembersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Members.
     * @param {MembersCreateArgs} args - Arguments to create a Members.
     * @example
     * // Create one Members
     * const Members = await prisma.members.create({
     *   data: {
     *     // ... data to create a Members
     *   }
     * })
     * 
     */
    create<T extends MembersCreateArgs>(args: SelectSubset<T, MembersCreateArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Members.
     * @param {MembersCreateManyArgs} args - Arguments to create many Members.
     * @example
     * // Create many Members
     * const members = await prisma.members.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MembersCreateManyArgs>(args?: SelectSubset<T, MembersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Members and returns the data saved in the database.
     * @param {MembersCreateManyAndReturnArgs} args - Arguments to create many Members.
     * @example
     * // Create many Members
     * const members = await prisma.members.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Members and only return the `id`
     * const membersWithIdOnly = await prisma.members.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MembersCreateManyAndReturnArgs>(args?: SelectSubset<T, MembersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Members.
     * @param {MembersDeleteArgs} args - Arguments to delete one Members.
     * @example
     * // Delete one Members
     * const Members = await prisma.members.delete({
     *   where: {
     *     // ... filter to delete one Members
     *   }
     * })
     * 
     */
    delete<T extends MembersDeleteArgs>(args: SelectSubset<T, MembersDeleteArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Members.
     * @param {MembersUpdateArgs} args - Arguments to update one Members.
     * @example
     * // Update one Members
     * const members = await prisma.members.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MembersUpdateArgs>(args: SelectSubset<T, MembersUpdateArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Members.
     * @param {MembersDeleteManyArgs} args - Arguments to filter Members to delete.
     * @example
     * // Delete a few Members
     * const { count } = await prisma.members.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MembersDeleteManyArgs>(args?: SelectSubset<T, MembersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Members
     * const members = await prisma.members.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MembersUpdateManyArgs>(args: SelectSubset<T, MembersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members and returns the data updated in the database.
     * @param {MembersUpdateManyAndReturnArgs} args - Arguments to update many Members.
     * @example
     * // Update many Members
     * const members = await prisma.members.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Members and only return the `id`
     * const membersWithIdOnly = await prisma.members.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MembersUpdateManyAndReturnArgs>(args: SelectSubset<T, MembersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Members.
     * @param {MembersUpsertArgs} args - Arguments to update or create a Members.
     * @example
     * // Update or create a Members
     * const members = await prisma.members.upsert({
     *   create: {
     *     // ... data to create a Members
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Members we want to update
     *   }
     * })
     */
    upsert<T extends MembersUpsertArgs>(args: SelectSubset<T, MembersUpsertArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersCountArgs} args - Arguments to filter Members to count.
     * @example
     * // Count the number of Members
     * const count = await prisma.members.count({
     *   where: {
     *     // ... the filter for the Members we want to count
     *   }
     * })
    **/
    count<T extends MembersCountArgs>(
      args?: Subset<T, MembersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MembersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MembersAggregateArgs>(args: Subset<T, MembersAggregateArgs>): Prisma.PrismaPromise<GetMembersAggregateType<T>>

    /**
     * Group by Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MembersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MembersGroupByArgs['orderBy'] }
        : { orderBy?: MembersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MembersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMembersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Members model
   */
  readonly fields: MembersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Members.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MembersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ministries<T extends Members$ministriesArgs<ExtArgs> = {}>(args?: Subset<T, Members$ministriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    church<T extends ChurchesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChurchesDefaultArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ledMinistries<T extends Members$ledMinistriesArgs<ExtArgs> = {}>(args?: Subset<T, Members$ledMinistriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Members model
   */
  interface MembersFieldRefs {
    readonly id: FieldRef<"Members", 'String'>
    readonly firstName: FieldRef<"Members", 'String'>
    readonly lastName: FieldRef<"Members", 'String'>
    readonly email: FieldRef<"Members", 'String'>
    readonly phone: FieldRef<"Members", 'String'>
    readonly age: FieldRef<"Members", 'Int'>
    readonly street: FieldRef<"Members", 'String'>
    readonly city: FieldRef<"Members", 'String'>
    readonly state: FieldRef<"Members", 'String'>
    readonly zip: FieldRef<"Members", 'String'>
    readonly country: FieldRef<"Members", 'String'>
    readonly birthDate: FieldRef<"Members", 'DateTime'>
    readonly baptismDate: FieldRef<"Members", 'DateTime'>
    readonly role: FieldRef<"Members", 'MemberRole'>
    readonly gender: FieldRef<"Members", 'Gender'>
    readonly pictureUrl: FieldRef<"Members", 'String'>
    readonly notes: FieldRef<"Members", 'String'>
    readonly passwordHash: FieldRef<"Members", 'String'>
    readonly church_id: FieldRef<"Members", 'String'>
    readonly createdAt: FieldRef<"Members", 'DateTime'>
    readonly updatedAt: FieldRef<"Members", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Members findUnique
   */
  export type MembersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * Filter, which Members to fetch.
     */
    where: MembersWhereUniqueInput
  }

  /**
   * Members findUniqueOrThrow
   */
  export type MembersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * Filter, which Members to fetch.
     */
    where: MembersWhereUniqueInput
  }

  /**
   * Members findFirst
   */
  export type MembersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * Filter, which Members to fetch.
     */
    where?: MembersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MembersOrderByWithRelationInput | MembersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Members.
     */
    cursor?: MembersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MembersScalarFieldEnum | MembersScalarFieldEnum[]
  }

  /**
   * Members findFirstOrThrow
   */
  export type MembersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * Filter, which Members to fetch.
     */
    where?: MembersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MembersOrderByWithRelationInput | MembersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Members.
     */
    cursor?: MembersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MembersScalarFieldEnum | MembersScalarFieldEnum[]
  }

  /**
   * Members findMany
   */
  export type MembersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * Filter, which Members to fetch.
     */
    where?: MembersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MembersOrderByWithRelationInput | MembersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Members.
     */
    cursor?: MembersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    distinct?: MembersScalarFieldEnum | MembersScalarFieldEnum[]
  }

  /**
   * Members create
   */
  export type MembersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * The data needed to create a Members.
     */
    data: XOR<MembersCreateInput, MembersUncheckedCreateInput>
  }

  /**
   * Members createMany
   */
  export type MembersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Members.
     */
    data: MembersCreateManyInput | MembersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Members createManyAndReturn
   */
  export type MembersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * The data used to create many Members.
     */
    data: MembersCreateManyInput | MembersCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Members update
   */
  export type MembersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * The data needed to update a Members.
     */
    data: XOR<MembersUpdateInput, MembersUncheckedUpdateInput>
    /**
     * Choose, which Members to update.
     */
    where: MembersWhereUniqueInput
  }

  /**
   * Members updateMany
   */
  export type MembersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Members.
     */
    data: XOR<MembersUpdateManyMutationInput, MembersUncheckedUpdateManyInput>
    /**
     * Filter which Members to update
     */
    where?: MembersWhereInput
    /**
     * Limit how many Members to update.
     */
    limit?: number
  }

  /**
   * Members updateManyAndReturn
   */
  export type MembersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * The data used to update Members.
     */
    data: XOR<MembersUpdateManyMutationInput, MembersUncheckedUpdateManyInput>
    /**
     * Filter which Members to update
     */
    where?: MembersWhereInput
    /**
     * Limit how many Members to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Members upsert
   */
  export type MembersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * The filter to search for the Members to update in case it exists.
     */
    where: MembersWhereUniqueInput
    /**
     * In case the Members found by the `where` argument doesn't exist, create a new Members with this data.
     */
    create: XOR<MembersCreateInput, MembersUncheckedCreateInput>
    /**
     * In case the Members was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MembersUpdateInput, MembersUncheckedUpdateInput>
  }

  /**
   * Members delete
   */
  export type MembersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    /**
     * Filter which Members to delete.
     */
    where: MembersWhereUniqueInput
  }

  /**
   * Members deleteMany
   */
  export type MembersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Members to delete
     */
    where?: MembersWhereInput
    /**
     * Limit how many Members to delete.
     */
    limit?: number
  }

  /**
   * Members.ministries
   */
  export type Members$ministriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    where?: MemberMinistryWhereInput
    orderBy?: MemberMinistryOrderByWithRelationInput | MemberMinistryOrderByWithRelationInput[]
    cursor?: MemberMinistryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemberMinistryScalarFieldEnum | MemberMinistryScalarFieldEnum[]
  }

  /**
   * Members.ledMinistries
   */
  export type Members$ledMinistriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    where?: MinistriesWhereInput
    orderBy?: MinistriesOrderByWithRelationInput | MinistriesOrderByWithRelationInput[]
    cursor?: MinistriesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MinistriesScalarFieldEnum | MinistriesScalarFieldEnum[]
  }

  /**
   * Members without action
   */
  export type MembersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
  }


  /**
   * Model Ministries
   */

  export type AggregateMinistries = {
    _count: MinistriesCountAggregateOutputType | null
    _min: MinistriesMinAggregateOutputType | null
    _max: MinistriesMaxAggregateOutputType | null
  }

  export type MinistriesMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    church_id: string | null
    leader_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MinistriesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    church_id: string | null
    leader_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MinistriesCountAggregateOutputType = {
    id: number
    name: number
    description: number
    church_id: number
    leader_id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MinistriesMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    church_id?: true
    leader_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MinistriesMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    church_id?: true
    leader_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MinistriesCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    church_id?: true
    leader_id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MinistriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ministries to aggregate.
     */
    where?: MinistriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ministries to fetch.
     */
    orderBy?: MinistriesOrderByWithRelationInput | MinistriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MinistriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ministries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ministries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ministries
    **/
    _count?: true | MinistriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MinistriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MinistriesMaxAggregateInputType
  }

  export type GetMinistriesAggregateType<T extends MinistriesAggregateArgs> = {
        [P in keyof T & keyof AggregateMinistries]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMinistries[P]>
      : GetScalarType<T[P], AggregateMinistries[P]>
  }




  export type MinistriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MinistriesWhereInput
    orderBy?: MinistriesOrderByWithAggregationInput | MinistriesOrderByWithAggregationInput[]
    by: MinistriesScalarFieldEnum[] | MinistriesScalarFieldEnum
    having?: MinistriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MinistriesCountAggregateInputType | true
    _min?: MinistriesMinAggregateInputType
    _max?: MinistriesMaxAggregateInputType
  }

  export type MinistriesGroupByOutputType = {
    id: string
    name: string
    description: string | null
    church_id: string
    leader_id: string | null
    createdAt: Date
    updatedAt: Date
    _count: MinistriesCountAggregateOutputType | null
    _min: MinistriesMinAggregateOutputType | null
    _max: MinistriesMaxAggregateOutputType | null
  }

  type GetMinistriesGroupByPayload<T extends MinistriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MinistriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MinistriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MinistriesGroupByOutputType[P]>
            : GetScalarType<T[P], MinistriesGroupByOutputType[P]>
        }
      >
    >


  export type MinistriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    church_id?: boolean
    leader_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | Ministries$membersArgs<ExtArgs>
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    leader?: boolean | Ministries$leaderArgs<ExtArgs>
    _count?: boolean | MinistriesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ministries"]>

  export type MinistriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    church_id?: boolean
    leader_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    leader?: boolean | Ministries$leaderArgs<ExtArgs>
  }, ExtArgs["result"]["ministries"]>

  export type MinistriesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    church_id?: boolean
    leader_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    leader?: boolean | Ministries$leaderArgs<ExtArgs>
  }, ExtArgs["result"]["ministries"]>

  export type MinistriesSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    church_id?: boolean
    leader_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MinistriesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "church_id" | "leader_id" | "createdAt" | "updatedAt", ExtArgs["result"]["ministries"]>
  export type MinistriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Ministries$membersArgs<ExtArgs>
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    leader?: boolean | Ministries$leaderArgs<ExtArgs>
    _count?: boolean | MinistriesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MinistriesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    leader?: boolean | Ministries$leaderArgs<ExtArgs>
  }
  export type MinistriesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    leader?: boolean | Ministries$leaderArgs<ExtArgs>
  }

  export type $MinistriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ministries"
    objects: {
      members: Prisma.$MemberMinistryPayload<ExtArgs>[]
      church: Prisma.$ChurchesPayload<ExtArgs>
      leader: Prisma.$MembersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      church_id: string
      leader_id: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ministries"]>
    composites: {}
  }

  type MinistriesGetPayload<S extends boolean | null | undefined | MinistriesDefaultArgs> = $Result.GetResult<Prisma.$MinistriesPayload, S>

  type MinistriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MinistriesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MinistriesCountAggregateInputType | true
    }

  export interface MinistriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ministries'], meta: { name: 'Ministries' } }
    /**
     * Find zero or one Ministries that matches the filter.
     * @param {MinistriesFindUniqueArgs} args - Arguments to find a Ministries
     * @example
     * // Get one Ministries
     * const ministries = await prisma.ministries.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MinistriesFindUniqueArgs>(args: SelectSubset<T, MinistriesFindUniqueArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ministries that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MinistriesFindUniqueOrThrowArgs} args - Arguments to find a Ministries
     * @example
     * // Get one Ministries
     * const ministries = await prisma.ministries.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MinistriesFindUniqueOrThrowArgs>(args: SelectSubset<T, MinistriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ministries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MinistriesFindFirstArgs} args - Arguments to find a Ministries
     * @example
     * // Get one Ministries
     * const ministries = await prisma.ministries.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MinistriesFindFirstArgs>(args?: SelectSubset<T, MinistriesFindFirstArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ministries that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MinistriesFindFirstOrThrowArgs} args - Arguments to find a Ministries
     * @example
     * // Get one Ministries
     * const ministries = await prisma.ministries.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MinistriesFindFirstOrThrowArgs>(args?: SelectSubset<T, MinistriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ministries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MinistriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ministries
     * const ministries = await prisma.ministries.findMany()
     * 
     * // Get first 10 Ministries
     * const ministries = await prisma.ministries.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ministriesWithIdOnly = await prisma.ministries.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MinistriesFindManyArgs>(args?: SelectSubset<T, MinistriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ministries.
     * @param {MinistriesCreateArgs} args - Arguments to create a Ministries.
     * @example
     * // Create one Ministries
     * const Ministries = await prisma.ministries.create({
     *   data: {
     *     // ... data to create a Ministries
     *   }
     * })
     * 
     */
    create<T extends MinistriesCreateArgs>(args: SelectSubset<T, MinistriesCreateArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ministries.
     * @param {MinistriesCreateManyArgs} args - Arguments to create many Ministries.
     * @example
     * // Create many Ministries
     * const ministries = await prisma.ministries.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MinistriesCreateManyArgs>(args?: SelectSubset<T, MinistriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ministries and returns the data saved in the database.
     * @param {MinistriesCreateManyAndReturnArgs} args - Arguments to create many Ministries.
     * @example
     * // Create many Ministries
     * const ministries = await prisma.ministries.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ministries and only return the `id`
     * const ministriesWithIdOnly = await prisma.ministries.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MinistriesCreateManyAndReturnArgs>(args?: SelectSubset<T, MinistriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ministries.
     * @param {MinistriesDeleteArgs} args - Arguments to delete one Ministries.
     * @example
     * // Delete one Ministries
     * const Ministries = await prisma.ministries.delete({
     *   where: {
     *     // ... filter to delete one Ministries
     *   }
     * })
     * 
     */
    delete<T extends MinistriesDeleteArgs>(args: SelectSubset<T, MinistriesDeleteArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ministries.
     * @param {MinistriesUpdateArgs} args - Arguments to update one Ministries.
     * @example
     * // Update one Ministries
     * const ministries = await prisma.ministries.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MinistriesUpdateArgs>(args: SelectSubset<T, MinistriesUpdateArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ministries.
     * @param {MinistriesDeleteManyArgs} args - Arguments to filter Ministries to delete.
     * @example
     * // Delete a few Ministries
     * const { count } = await prisma.ministries.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MinistriesDeleteManyArgs>(args?: SelectSubset<T, MinistriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ministries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MinistriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ministries
     * const ministries = await prisma.ministries.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MinistriesUpdateManyArgs>(args: SelectSubset<T, MinistriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ministries and returns the data updated in the database.
     * @param {MinistriesUpdateManyAndReturnArgs} args - Arguments to update many Ministries.
     * @example
     * // Update many Ministries
     * const ministries = await prisma.ministries.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ministries and only return the `id`
     * const ministriesWithIdOnly = await prisma.ministries.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MinistriesUpdateManyAndReturnArgs>(args: SelectSubset<T, MinistriesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ministries.
     * @param {MinistriesUpsertArgs} args - Arguments to update or create a Ministries.
     * @example
     * // Update or create a Ministries
     * const ministries = await prisma.ministries.upsert({
     *   create: {
     *     // ... data to create a Ministries
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ministries we want to update
     *   }
     * })
     */
    upsert<T extends MinistriesUpsertArgs>(args: SelectSubset<T, MinistriesUpsertArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ministries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MinistriesCountArgs} args - Arguments to filter Ministries to count.
     * @example
     * // Count the number of Ministries
     * const count = await prisma.ministries.count({
     *   where: {
     *     // ... the filter for the Ministries we want to count
     *   }
     * })
    **/
    count<T extends MinistriesCountArgs>(
      args?: Subset<T, MinistriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MinistriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ministries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MinistriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MinistriesAggregateArgs>(args: Subset<T, MinistriesAggregateArgs>): Prisma.PrismaPromise<GetMinistriesAggregateType<T>>

    /**
     * Group by Ministries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MinistriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MinistriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MinistriesGroupByArgs['orderBy'] }
        : { orderBy?: MinistriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MinistriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMinistriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ministries model
   */
  readonly fields: MinistriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ministries.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MinistriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Ministries$membersArgs<ExtArgs> = {}>(args?: Subset<T, Ministries$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    church<T extends ChurchesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChurchesDefaultArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    leader<T extends Ministries$leaderArgs<ExtArgs> = {}>(args?: Subset<T, Ministries$leaderArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ministries model
   */
  interface MinistriesFieldRefs {
    readonly id: FieldRef<"Ministries", 'String'>
    readonly name: FieldRef<"Ministries", 'String'>
    readonly description: FieldRef<"Ministries", 'String'>
    readonly church_id: FieldRef<"Ministries", 'String'>
    readonly leader_id: FieldRef<"Ministries", 'String'>
    readonly createdAt: FieldRef<"Ministries", 'DateTime'>
    readonly updatedAt: FieldRef<"Ministries", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ministries findUnique
   */
  export type MinistriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * Filter, which Ministries to fetch.
     */
    where: MinistriesWhereUniqueInput
  }

  /**
   * Ministries findUniqueOrThrow
   */
  export type MinistriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * Filter, which Ministries to fetch.
     */
    where: MinistriesWhereUniqueInput
  }

  /**
   * Ministries findFirst
   */
  export type MinistriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * Filter, which Ministries to fetch.
     */
    where?: MinistriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ministries to fetch.
     */
    orderBy?: MinistriesOrderByWithRelationInput | MinistriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ministries.
     */
    cursor?: MinistriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ministries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ministries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ministries.
     */
    distinct?: MinistriesScalarFieldEnum | MinistriesScalarFieldEnum[]
  }

  /**
   * Ministries findFirstOrThrow
   */
  export type MinistriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * Filter, which Ministries to fetch.
     */
    where?: MinistriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ministries to fetch.
     */
    orderBy?: MinistriesOrderByWithRelationInput | MinistriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ministries.
     */
    cursor?: MinistriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ministries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ministries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ministries.
     */
    distinct?: MinistriesScalarFieldEnum | MinistriesScalarFieldEnum[]
  }

  /**
   * Ministries findMany
   */
  export type MinistriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * Filter, which Ministries to fetch.
     */
    where?: MinistriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ministries to fetch.
     */
    orderBy?: MinistriesOrderByWithRelationInput | MinistriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ministries.
     */
    cursor?: MinistriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ministries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ministries.
     */
    skip?: number
    distinct?: MinistriesScalarFieldEnum | MinistriesScalarFieldEnum[]
  }

  /**
   * Ministries create
   */
  export type MinistriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * The data needed to create a Ministries.
     */
    data: XOR<MinistriesCreateInput, MinistriesUncheckedCreateInput>
  }

  /**
   * Ministries createMany
   */
  export type MinistriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ministries.
     */
    data: MinistriesCreateManyInput | MinistriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ministries createManyAndReturn
   */
  export type MinistriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * The data used to create many Ministries.
     */
    data: MinistriesCreateManyInput | MinistriesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ministries update
   */
  export type MinistriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * The data needed to update a Ministries.
     */
    data: XOR<MinistriesUpdateInput, MinistriesUncheckedUpdateInput>
    /**
     * Choose, which Ministries to update.
     */
    where: MinistriesWhereUniqueInput
  }

  /**
   * Ministries updateMany
   */
  export type MinistriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ministries.
     */
    data: XOR<MinistriesUpdateManyMutationInput, MinistriesUncheckedUpdateManyInput>
    /**
     * Filter which Ministries to update
     */
    where?: MinistriesWhereInput
    /**
     * Limit how many Ministries to update.
     */
    limit?: number
  }

  /**
   * Ministries updateManyAndReturn
   */
  export type MinistriesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * The data used to update Ministries.
     */
    data: XOR<MinistriesUpdateManyMutationInput, MinistriesUncheckedUpdateManyInput>
    /**
     * Filter which Ministries to update
     */
    where?: MinistriesWhereInput
    /**
     * Limit how many Ministries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ministries upsert
   */
  export type MinistriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * The filter to search for the Ministries to update in case it exists.
     */
    where: MinistriesWhereUniqueInput
    /**
     * In case the Ministries found by the `where` argument doesn't exist, create a new Ministries with this data.
     */
    create: XOR<MinistriesCreateInput, MinistriesUncheckedCreateInput>
    /**
     * In case the Ministries was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MinistriesUpdateInput, MinistriesUncheckedUpdateInput>
  }

  /**
   * Ministries delete
   */
  export type MinistriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
    /**
     * Filter which Ministries to delete.
     */
    where: MinistriesWhereUniqueInput
  }

  /**
   * Ministries deleteMany
   */
  export type MinistriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ministries to delete
     */
    where?: MinistriesWhereInput
    /**
     * Limit how many Ministries to delete.
     */
    limit?: number
  }

  /**
   * Ministries.members
   */
  export type Ministries$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    where?: MemberMinistryWhereInput
    orderBy?: MemberMinistryOrderByWithRelationInput | MemberMinistryOrderByWithRelationInput[]
    cursor?: MemberMinistryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MemberMinistryScalarFieldEnum | MemberMinistryScalarFieldEnum[]
  }

  /**
   * Ministries.leader
   */
  export type Ministries$leaderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Members
     */
    select?: MembersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Members
     */
    omit?: MembersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MembersInclude<ExtArgs> | null
    where?: MembersWhereInput
  }

  /**
   * Ministries without action
   */
  export type MinistriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ministries
     */
    select?: MinistriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ministries
     */
    omit?: MinistriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MinistriesInclude<ExtArgs> | null
  }


  /**
   * Model MemberMinistry
   */

  export type AggregateMemberMinistry = {
    _count: MemberMinistryCountAggregateOutputType | null
    _min: MemberMinistryMinAggregateOutputType | null
    _max: MemberMinistryMaxAggregateOutputType | null
  }

  export type MemberMinistryMinAggregateOutputType = {
    id: string | null
    memberId: string | null
    ministryId: string | null
    church_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MemberMinistryMaxAggregateOutputType = {
    id: string | null
    memberId: string | null
    ministryId: string | null
    church_id: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MemberMinistryCountAggregateOutputType = {
    id: number
    memberId: number
    ministryId: number
    church_id: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MemberMinistryMinAggregateInputType = {
    id?: true
    memberId?: true
    ministryId?: true
    church_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MemberMinistryMaxAggregateInputType = {
    id?: true
    memberId?: true
    ministryId?: true
    church_id?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MemberMinistryCountAggregateInputType = {
    id?: true
    memberId?: true
    ministryId?: true
    church_id?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MemberMinistryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MemberMinistry to aggregate.
     */
    where?: MemberMinistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemberMinistries to fetch.
     */
    orderBy?: MemberMinistryOrderByWithRelationInput | MemberMinistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MemberMinistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemberMinistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemberMinistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MemberMinistries
    **/
    _count?: true | MemberMinistryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MemberMinistryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MemberMinistryMaxAggregateInputType
  }

  export type GetMemberMinistryAggregateType<T extends MemberMinistryAggregateArgs> = {
        [P in keyof T & keyof AggregateMemberMinistry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMemberMinistry[P]>
      : GetScalarType<T[P], AggregateMemberMinistry[P]>
  }




  export type MemberMinistryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberMinistryWhereInput
    orderBy?: MemberMinistryOrderByWithAggregationInput | MemberMinistryOrderByWithAggregationInput[]
    by: MemberMinistryScalarFieldEnum[] | MemberMinistryScalarFieldEnum
    having?: MemberMinistryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MemberMinistryCountAggregateInputType | true
    _min?: MemberMinistryMinAggregateInputType
    _max?: MemberMinistryMaxAggregateInputType
  }

  export type MemberMinistryGroupByOutputType = {
    id: string
    memberId: string
    ministryId: string
    church_id: string
    createdAt: Date
    updatedAt: Date
    _count: MemberMinistryCountAggregateOutputType | null
    _min: MemberMinistryMinAggregateOutputType | null
    _max: MemberMinistryMaxAggregateOutputType | null
  }

  type GetMemberMinistryGroupByPayload<T extends MemberMinistryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MemberMinistryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MemberMinistryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MemberMinistryGroupByOutputType[P]>
            : GetScalarType<T[P], MemberMinistryGroupByOutputType[P]>
        }
      >
    >


  export type MemberMinistrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    ministryId?: boolean
    church_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    member?: boolean | MembersDefaultArgs<ExtArgs>
    ministry?: boolean | MinistriesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["memberMinistry"]>

  export type MemberMinistrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    ministryId?: boolean
    church_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    member?: boolean | MembersDefaultArgs<ExtArgs>
    ministry?: boolean | MinistriesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["memberMinistry"]>

  export type MemberMinistrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    ministryId?: boolean
    church_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    member?: boolean | MembersDefaultArgs<ExtArgs>
    ministry?: boolean | MinistriesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["memberMinistry"]>

  export type MemberMinistrySelectScalar = {
    id?: boolean
    memberId?: boolean
    ministryId?: boolean
    church_id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MemberMinistryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "memberId" | "ministryId" | "church_id" | "createdAt" | "updatedAt", ExtArgs["result"]["memberMinistry"]>
  export type MemberMinistryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    member?: boolean | MembersDefaultArgs<ExtArgs>
    ministry?: boolean | MinistriesDefaultArgs<ExtArgs>
  }
  export type MemberMinistryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    member?: boolean | MembersDefaultArgs<ExtArgs>
    ministry?: boolean | MinistriesDefaultArgs<ExtArgs>
  }
  export type MemberMinistryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    church?: boolean | ChurchesDefaultArgs<ExtArgs>
    member?: boolean | MembersDefaultArgs<ExtArgs>
    ministry?: boolean | MinistriesDefaultArgs<ExtArgs>
  }

  export type $MemberMinistryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MemberMinistry"
    objects: {
      church: Prisma.$ChurchesPayload<ExtArgs>
      member: Prisma.$MembersPayload<ExtArgs>
      ministry: Prisma.$MinistriesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      memberId: string
      ministryId: string
      church_id: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["memberMinistry"]>
    composites: {}
  }

  type MemberMinistryGetPayload<S extends boolean | null | undefined | MemberMinistryDefaultArgs> = $Result.GetResult<Prisma.$MemberMinistryPayload, S>

  type MemberMinistryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MemberMinistryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MemberMinistryCountAggregateInputType | true
    }

  export interface MemberMinistryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MemberMinistry'], meta: { name: 'MemberMinistry' } }
    /**
     * Find zero or one MemberMinistry that matches the filter.
     * @param {MemberMinistryFindUniqueArgs} args - Arguments to find a MemberMinistry
     * @example
     * // Get one MemberMinistry
     * const memberMinistry = await prisma.memberMinistry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MemberMinistryFindUniqueArgs>(args: SelectSubset<T, MemberMinistryFindUniqueArgs<ExtArgs>>): Prisma__MemberMinistryClient<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MemberMinistry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MemberMinistryFindUniqueOrThrowArgs} args - Arguments to find a MemberMinistry
     * @example
     * // Get one MemberMinistry
     * const memberMinistry = await prisma.memberMinistry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MemberMinistryFindUniqueOrThrowArgs>(args: SelectSubset<T, MemberMinistryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MemberMinistryClient<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemberMinistry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberMinistryFindFirstArgs} args - Arguments to find a MemberMinistry
     * @example
     * // Get one MemberMinistry
     * const memberMinistry = await prisma.memberMinistry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MemberMinistryFindFirstArgs>(args?: SelectSubset<T, MemberMinistryFindFirstArgs<ExtArgs>>): Prisma__MemberMinistryClient<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemberMinistry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberMinistryFindFirstOrThrowArgs} args - Arguments to find a MemberMinistry
     * @example
     * // Get one MemberMinistry
     * const memberMinistry = await prisma.memberMinistry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MemberMinistryFindFirstOrThrowArgs>(args?: SelectSubset<T, MemberMinistryFindFirstOrThrowArgs<ExtArgs>>): Prisma__MemberMinistryClient<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MemberMinistries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberMinistryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MemberMinistries
     * const memberMinistries = await prisma.memberMinistry.findMany()
     * 
     * // Get first 10 MemberMinistries
     * const memberMinistries = await prisma.memberMinistry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const memberMinistryWithIdOnly = await prisma.memberMinistry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MemberMinistryFindManyArgs>(args?: SelectSubset<T, MemberMinistryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MemberMinistry.
     * @param {MemberMinistryCreateArgs} args - Arguments to create a MemberMinistry.
     * @example
     * // Create one MemberMinistry
     * const MemberMinistry = await prisma.memberMinistry.create({
     *   data: {
     *     // ... data to create a MemberMinistry
     *   }
     * })
     * 
     */
    create<T extends MemberMinistryCreateArgs>(args: SelectSubset<T, MemberMinistryCreateArgs<ExtArgs>>): Prisma__MemberMinistryClient<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MemberMinistries.
     * @param {MemberMinistryCreateManyArgs} args - Arguments to create many MemberMinistries.
     * @example
     * // Create many MemberMinistries
     * const memberMinistry = await prisma.memberMinistry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MemberMinistryCreateManyArgs>(args?: SelectSubset<T, MemberMinistryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MemberMinistries and returns the data saved in the database.
     * @param {MemberMinistryCreateManyAndReturnArgs} args - Arguments to create many MemberMinistries.
     * @example
     * // Create many MemberMinistries
     * const memberMinistry = await prisma.memberMinistry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MemberMinistries and only return the `id`
     * const memberMinistryWithIdOnly = await prisma.memberMinistry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MemberMinistryCreateManyAndReturnArgs>(args?: SelectSubset<T, MemberMinistryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MemberMinistry.
     * @param {MemberMinistryDeleteArgs} args - Arguments to delete one MemberMinistry.
     * @example
     * // Delete one MemberMinistry
     * const MemberMinistry = await prisma.memberMinistry.delete({
     *   where: {
     *     // ... filter to delete one MemberMinistry
     *   }
     * })
     * 
     */
    delete<T extends MemberMinistryDeleteArgs>(args: SelectSubset<T, MemberMinistryDeleteArgs<ExtArgs>>): Prisma__MemberMinistryClient<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MemberMinistry.
     * @param {MemberMinistryUpdateArgs} args - Arguments to update one MemberMinistry.
     * @example
     * // Update one MemberMinistry
     * const memberMinistry = await prisma.memberMinistry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MemberMinistryUpdateArgs>(args: SelectSubset<T, MemberMinistryUpdateArgs<ExtArgs>>): Prisma__MemberMinistryClient<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MemberMinistries.
     * @param {MemberMinistryDeleteManyArgs} args - Arguments to filter MemberMinistries to delete.
     * @example
     * // Delete a few MemberMinistries
     * const { count } = await prisma.memberMinistry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MemberMinistryDeleteManyArgs>(args?: SelectSubset<T, MemberMinistryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MemberMinistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberMinistryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MemberMinistries
     * const memberMinistry = await prisma.memberMinistry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MemberMinistryUpdateManyArgs>(args: SelectSubset<T, MemberMinistryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MemberMinistries and returns the data updated in the database.
     * @param {MemberMinistryUpdateManyAndReturnArgs} args - Arguments to update many MemberMinistries.
     * @example
     * // Update many MemberMinistries
     * const memberMinistry = await prisma.memberMinistry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MemberMinistries and only return the `id`
     * const memberMinistryWithIdOnly = await prisma.memberMinistry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MemberMinistryUpdateManyAndReturnArgs>(args: SelectSubset<T, MemberMinistryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MemberMinistry.
     * @param {MemberMinistryUpsertArgs} args - Arguments to update or create a MemberMinistry.
     * @example
     * // Update or create a MemberMinistry
     * const memberMinistry = await prisma.memberMinistry.upsert({
     *   create: {
     *     // ... data to create a MemberMinistry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MemberMinistry we want to update
     *   }
     * })
     */
    upsert<T extends MemberMinistryUpsertArgs>(args: SelectSubset<T, MemberMinistryUpsertArgs<ExtArgs>>): Prisma__MemberMinistryClient<$Result.GetResult<Prisma.$MemberMinistryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MemberMinistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberMinistryCountArgs} args - Arguments to filter MemberMinistries to count.
     * @example
     * // Count the number of MemberMinistries
     * const count = await prisma.memberMinistry.count({
     *   where: {
     *     // ... the filter for the MemberMinistries we want to count
     *   }
     * })
    **/
    count<T extends MemberMinistryCountArgs>(
      args?: Subset<T, MemberMinistryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemberMinistryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MemberMinistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberMinistryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MemberMinistryAggregateArgs>(args: Subset<T, MemberMinistryAggregateArgs>): Prisma.PrismaPromise<GetMemberMinistryAggregateType<T>>

    /**
     * Group by MemberMinistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberMinistryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MemberMinistryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MemberMinistryGroupByArgs['orderBy'] }
        : { orderBy?: MemberMinistryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MemberMinistryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemberMinistryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MemberMinistry model
   */
  readonly fields: MemberMinistryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MemberMinistry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MemberMinistryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    church<T extends ChurchesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChurchesDefaultArgs<ExtArgs>>): Prisma__ChurchesClient<$Result.GetResult<Prisma.$ChurchesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    member<T extends MembersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MembersDefaultArgs<ExtArgs>>): Prisma__MembersClient<$Result.GetResult<Prisma.$MembersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ministry<T extends MinistriesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MinistriesDefaultArgs<ExtArgs>>): Prisma__MinistriesClient<$Result.GetResult<Prisma.$MinistriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MemberMinistry model
   */
  interface MemberMinistryFieldRefs {
    readonly id: FieldRef<"MemberMinistry", 'String'>
    readonly memberId: FieldRef<"MemberMinistry", 'String'>
    readonly ministryId: FieldRef<"MemberMinistry", 'String'>
    readonly church_id: FieldRef<"MemberMinistry", 'String'>
    readonly createdAt: FieldRef<"MemberMinistry", 'DateTime'>
    readonly updatedAt: FieldRef<"MemberMinistry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MemberMinistry findUnique
   */
  export type MemberMinistryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * Filter, which MemberMinistry to fetch.
     */
    where: MemberMinistryWhereUniqueInput
  }

  /**
   * MemberMinistry findUniqueOrThrow
   */
  export type MemberMinistryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * Filter, which MemberMinistry to fetch.
     */
    where: MemberMinistryWhereUniqueInput
  }

  /**
   * MemberMinistry findFirst
   */
  export type MemberMinistryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * Filter, which MemberMinistry to fetch.
     */
    where?: MemberMinistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemberMinistries to fetch.
     */
    orderBy?: MemberMinistryOrderByWithRelationInput | MemberMinistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MemberMinistries.
     */
    cursor?: MemberMinistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemberMinistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemberMinistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MemberMinistries.
     */
    distinct?: MemberMinistryScalarFieldEnum | MemberMinistryScalarFieldEnum[]
  }

  /**
   * MemberMinistry findFirstOrThrow
   */
  export type MemberMinistryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * Filter, which MemberMinistry to fetch.
     */
    where?: MemberMinistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemberMinistries to fetch.
     */
    orderBy?: MemberMinistryOrderByWithRelationInput | MemberMinistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MemberMinistries.
     */
    cursor?: MemberMinistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemberMinistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemberMinistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MemberMinistries.
     */
    distinct?: MemberMinistryScalarFieldEnum | MemberMinistryScalarFieldEnum[]
  }

  /**
   * MemberMinistry findMany
   */
  export type MemberMinistryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * Filter, which MemberMinistries to fetch.
     */
    where?: MemberMinistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemberMinistries to fetch.
     */
    orderBy?: MemberMinistryOrderByWithRelationInput | MemberMinistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MemberMinistries.
     */
    cursor?: MemberMinistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemberMinistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemberMinistries.
     */
    skip?: number
    distinct?: MemberMinistryScalarFieldEnum | MemberMinistryScalarFieldEnum[]
  }

  /**
   * MemberMinistry create
   */
  export type MemberMinistryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * The data needed to create a MemberMinistry.
     */
    data: XOR<MemberMinistryCreateInput, MemberMinistryUncheckedCreateInput>
  }

  /**
   * MemberMinistry createMany
   */
  export type MemberMinistryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MemberMinistries.
     */
    data: MemberMinistryCreateManyInput | MemberMinistryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MemberMinistry createManyAndReturn
   */
  export type MemberMinistryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * The data used to create many MemberMinistries.
     */
    data: MemberMinistryCreateManyInput | MemberMinistryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MemberMinistry update
   */
  export type MemberMinistryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * The data needed to update a MemberMinistry.
     */
    data: XOR<MemberMinistryUpdateInput, MemberMinistryUncheckedUpdateInput>
    /**
     * Choose, which MemberMinistry to update.
     */
    where: MemberMinistryWhereUniqueInput
  }

  /**
   * MemberMinistry updateMany
   */
  export type MemberMinistryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MemberMinistries.
     */
    data: XOR<MemberMinistryUpdateManyMutationInput, MemberMinistryUncheckedUpdateManyInput>
    /**
     * Filter which MemberMinistries to update
     */
    where?: MemberMinistryWhereInput
    /**
     * Limit how many MemberMinistries to update.
     */
    limit?: number
  }

  /**
   * MemberMinistry updateManyAndReturn
   */
  export type MemberMinistryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * The data used to update MemberMinistries.
     */
    data: XOR<MemberMinistryUpdateManyMutationInput, MemberMinistryUncheckedUpdateManyInput>
    /**
     * Filter which MemberMinistries to update
     */
    where?: MemberMinistryWhereInput
    /**
     * Limit how many MemberMinistries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MemberMinistry upsert
   */
  export type MemberMinistryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * The filter to search for the MemberMinistry to update in case it exists.
     */
    where: MemberMinistryWhereUniqueInput
    /**
     * In case the MemberMinistry found by the `where` argument doesn't exist, create a new MemberMinistry with this data.
     */
    create: XOR<MemberMinistryCreateInput, MemberMinistryUncheckedCreateInput>
    /**
     * In case the MemberMinistry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MemberMinistryUpdateInput, MemberMinistryUncheckedUpdateInput>
  }

  /**
   * MemberMinistry delete
   */
  export type MemberMinistryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
    /**
     * Filter which MemberMinistry to delete.
     */
    where: MemberMinistryWhereUniqueInput
  }

  /**
   * MemberMinistry deleteMany
   */
  export type MemberMinistryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MemberMinistries to delete
     */
    where?: MemberMinistryWhereInput
    /**
     * Limit how many MemberMinistries to delete.
     */
    limit?: number
  }

  /**
   * MemberMinistry without action
   */
  export type MemberMinistryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberMinistry
     */
    select?: MemberMinistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemberMinistry
     */
    omit?: MemberMinistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberMinistryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ChurchesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChurchesScalarFieldEnum = (typeof ChurchesScalarFieldEnum)[keyof typeof ChurchesScalarFieldEnum]


  export const MembersScalarFieldEnum: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    age: 'age',
    street: 'street',
    city: 'city',
    state: 'state',
    zip: 'zip',
    country: 'country',
    birthDate: 'birthDate',
    baptismDate: 'baptismDate',
    role: 'role',
    gender: 'gender',
    pictureUrl: 'pictureUrl',
    notes: 'notes',
    passwordHash: 'passwordHash',
    church_id: 'church_id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MembersScalarFieldEnum = (typeof MembersScalarFieldEnum)[keyof typeof MembersScalarFieldEnum]


  export const MinistriesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    church_id: 'church_id',
    leader_id: 'leader_id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MinistriesScalarFieldEnum = (typeof MinistriesScalarFieldEnum)[keyof typeof MinistriesScalarFieldEnum]


  export const MemberMinistryScalarFieldEnum: {
    id: 'id',
    memberId: 'memberId',
    ministryId: 'ministryId',
    church_id: 'church_id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MemberMinistryScalarFieldEnum = (typeof MemberMinistryScalarFieldEnum)[keyof typeof MemberMinistryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'MemberRole'
   */
  export type EnumMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MemberRole'>
    


  /**
   * Reference to a field of type 'MemberRole[]'
   */
  export type ListEnumMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MemberRole[]'>
    


  /**
   * Reference to a field of type 'Gender'
   */
  export type EnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender'>
    


  /**
   * Reference to a field of type 'Gender[]'
   */
  export type ListEnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Gender[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ChurchesWhereInput = {
    AND?: ChurchesWhereInput | ChurchesWhereInput[]
    OR?: ChurchesWhereInput[]
    NOT?: ChurchesWhereInput | ChurchesWhereInput[]
    id?: StringFilter<"Churches"> | string
    name?: StringFilter<"Churches"> | string
    slug?: StringFilter<"Churches"> | string
    createdAt?: DateTimeFilter<"Churches"> | Date | string
    updatedAt?: DateTimeFilter<"Churches"> | Date | string
    memberMinistries?: MemberMinistryListRelationFilter
    members?: MembersListRelationFilter
    ministries?: MinistriesListRelationFilter
  }

  export type ChurchesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    memberMinistries?: MemberMinistryOrderByRelationAggregateInput
    members?: MembersOrderByRelationAggregateInput
    ministries?: MinistriesOrderByRelationAggregateInput
  }

  export type ChurchesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ChurchesWhereInput | ChurchesWhereInput[]
    OR?: ChurchesWhereInput[]
    NOT?: ChurchesWhereInput | ChurchesWhereInput[]
    name?: StringFilter<"Churches"> | string
    createdAt?: DateTimeFilter<"Churches"> | Date | string
    updatedAt?: DateTimeFilter<"Churches"> | Date | string
    memberMinistries?: MemberMinistryListRelationFilter
    members?: MembersListRelationFilter
    ministries?: MinistriesListRelationFilter
  }, "id" | "slug">

  export type ChurchesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChurchesCountOrderByAggregateInput
    _max?: ChurchesMaxOrderByAggregateInput
    _min?: ChurchesMinOrderByAggregateInput
  }

  export type ChurchesScalarWhereWithAggregatesInput = {
    AND?: ChurchesScalarWhereWithAggregatesInput | ChurchesScalarWhereWithAggregatesInput[]
    OR?: ChurchesScalarWhereWithAggregatesInput[]
    NOT?: ChurchesScalarWhereWithAggregatesInput | ChurchesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Churches"> | string
    name?: StringWithAggregatesFilter<"Churches"> | string
    slug?: StringWithAggregatesFilter<"Churches"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Churches"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Churches"> | Date | string
  }

  export type MembersWhereInput = {
    AND?: MembersWhereInput | MembersWhereInput[]
    OR?: MembersWhereInput[]
    NOT?: MembersWhereInput | MembersWhereInput[]
    id?: StringFilter<"Members"> | string
    firstName?: StringFilter<"Members"> | string
    lastName?: StringFilter<"Members"> | string
    email?: StringFilter<"Members"> | string
    phone?: StringNullableFilter<"Members"> | string | null
    age?: IntNullableFilter<"Members"> | number | null
    street?: StringNullableFilter<"Members"> | string | null
    city?: StringNullableFilter<"Members"> | string | null
    state?: StringNullableFilter<"Members"> | string | null
    zip?: StringNullableFilter<"Members"> | string | null
    country?: StringNullableFilter<"Members"> | string | null
    birthDate?: DateTimeNullableFilter<"Members"> | Date | string | null
    baptismDate?: DateTimeNullableFilter<"Members"> | Date | string | null
    role?: EnumMemberRoleFilter<"Members"> | $Enums.MemberRole
    gender?: EnumGenderFilter<"Members"> | $Enums.Gender
    pictureUrl?: StringNullableFilter<"Members"> | string | null
    notes?: StringNullableFilter<"Members"> | string | null
    passwordHash?: StringNullableFilter<"Members"> | string | null
    church_id?: StringFilter<"Members"> | string
    createdAt?: DateTimeFilter<"Members"> | Date | string
    updatedAt?: DateTimeFilter<"Members"> | Date | string
    ministries?: MemberMinistryListRelationFilter
    church?: XOR<ChurchesScalarRelationFilter, ChurchesWhereInput>
    ledMinistries?: MinistriesListRelationFilter
  }

  export type MembersOrderByWithRelationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    age?: SortOrderInput | SortOrder
    street?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zip?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    baptismDate?: SortOrderInput | SortOrder
    role?: SortOrder
    gender?: SortOrder
    pictureUrl?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ministries?: MemberMinistryOrderByRelationAggregateInput
    church?: ChurchesOrderByWithRelationInput
    ledMinistries?: MinistriesOrderByRelationAggregateInput
  }

  export type MembersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: MembersWhereInput | MembersWhereInput[]
    OR?: MembersWhereInput[]
    NOT?: MembersWhereInput | MembersWhereInput[]
    firstName?: StringFilter<"Members"> | string
    lastName?: StringFilter<"Members"> | string
    phone?: StringNullableFilter<"Members"> | string | null
    age?: IntNullableFilter<"Members"> | number | null
    street?: StringNullableFilter<"Members"> | string | null
    city?: StringNullableFilter<"Members"> | string | null
    state?: StringNullableFilter<"Members"> | string | null
    zip?: StringNullableFilter<"Members"> | string | null
    country?: StringNullableFilter<"Members"> | string | null
    birthDate?: DateTimeNullableFilter<"Members"> | Date | string | null
    baptismDate?: DateTimeNullableFilter<"Members"> | Date | string | null
    role?: EnumMemberRoleFilter<"Members"> | $Enums.MemberRole
    gender?: EnumGenderFilter<"Members"> | $Enums.Gender
    pictureUrl?: StringNullableFilter<"Members"> | string | null
    notes?: StringNullableFilter<"Members"> | string | null
    passwordHash?: StringNullableFilter<"Members"> | string | null
    church_id?: StringFilter<"Members"> | string
    createdAt?: DateTimeFilter<"Members"> | Date | string
    updatedAt?: DateTimeFilter<"Members"> | Date | string
    ministries?: MemberMinistryListRelationFilter
    church?: XOR<ChurchesScalarRelationFilter, ChurchesWhereInput>
    ledMinistries?: MinistriesListRelationFilter
  }, "id" | "email">

  export type MembersOrderByWithAggregationInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    age?: SortOrderInput | SortOrder
    street?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zip?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    baptismDate?: SortOrderInput | SortOrder
    role?: SortOrder
    gender?: SortOrder
    pictureUrl?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MembersCountOrderByAggregateInput
    _avg?: MembersAvgOrderByAggregateInput
    _max?: MembersMaxOrderByAggregateInput
    _min?: MembersMinOrderByAggregateInput
    _sum?: MembersSumOrderByAggregateInput
  }

  export type MembersScalarWhereWithAggregatesInput = {
    AND?: MembersScalarWhereWithAggregatesInput | MembersScalarWhereWithAggregatesInput[]
    OR?: MembersScalarWhereWithAggregatesInput[]
    NOT?: MembersScalarWhereWithAggregatesInput | MembersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Members"> | string
    firstName?: StringWithAggregatesFilter<"Members"> | string
    lastName?: StringWithAggregatesFilter<"Members"> | string
    email?: StringWithAggregatesFilter<"Members"> | string
    phone?: StringNullableWithAggregatesFilter<"Members"> | string | null
    age?: IntNullableWithAggregatesFilter<"Members"> | number | null
    street?: StringNullableWithAggregatesFilter<"Members"> | string | null
    city?: StringNullableWithAggregatesFilter<"Members"> | string | null
    state?: StringNullableWithAggregatesFilter<"Members"> | string | null
    zip?: StringNullableWithAggregatesFilter<"Members"> | string | null
    country?: StringNullableWithAggregatesFilter<"Members"> | string | null
    birthDate?: DateTimeNullableWithAggregatesFilter<"Members"> | Date | string | null
    baptismDate?: DateTimeNullableWithAggregatesFilter<"Members"> | Date | string | null
    role?: EnumMemberRoleWithAggregatesFilter<"Members"> | $Enums.MemberRole
    gender?: EnumGenderWithAggregatesFilter<"Members"> | $Enums.Gender
    pictureUrl?: StringNullableWithAggregatesFilter<"Members"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Members"> | string | null
    passwordHash?: StringNullableWithAggregatesFilter<"Members"> | string | null
    church_id?: StringWithAggregatesFilter<"Members"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Members"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Members"> | Date | string
  }

  export type MinistriesWhereInput = {
    AND?: MinistriesWhereInput | MinistriesWhereInput[]
    OR?: MinistriesWhereInput[]
    NOT?: MinistriesWhereInput | MinistriesWhereInput[]
    id?: StringFilter<"Ministries"> | string
    name?: StringFilter<"Ministries"> | string
    description?: StringNullableFilter<"Ministries"> | string | null
    church_id?: StringFilter<"Ministries"> | string
    leader_id?: StringNullableFilter<"Ministries"> | string | null
    createdAt?: DateTimeFilter<"Ministries"> | Date | string
    updatedAt?: DateTimeFilter<"Ministries"> | Date | string
    members?: MemberMinistryListRelationFilter
    church?: XOR<ChurchesScalarRelationFilter, ChurchesWhereInput>
    leader?: XOR<MembersNullableScalarRelationFilter, MembersWhereInput> | null
  }

  export type MinistriesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    church_id?: SortOrder
    leader_id?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: MemberMinistryOrderByRelationAggregateInput
    church?: ChurchesOrderByWithRelationInput
    leader?: MembersOrderByWithRelationInput
  }

  export type MinistriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name_church_id?: MinistriesNameChurch_idCompoundUniqueInput
    AND?: MinistriesWhereInput | MinistriesWhereInput[]
    OR?: MinistriesWhereInput[]
    NOT?: MinistriesWhereInput | MinistriesWhereInput[]
    name?: StringFilter<"Ministries"> | string
    description?: StringNullableFilter<"Ministries"> | string | null
    church_id?: StringFilter<"Ministries"> | string
    leader_id?: StringNullableFilter<"Ministries"> | string | null
    createdAt?: DateTimeFilter<"Ministries"> | Date | string
    updatedAt?: DateTimeFilter<"Ministries"> | Date | string
    members?: MemberMinistryListRelationFilter
    church?: XOR<ChurchesScalarRelationFilter, ChurchesWhereInput>
    leader?: XOR<MembersNullableScalarRelationFilter, MembersWhereInput> | null
  }, "id" | "name_church_id">

  export type MinistriesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    church_id?: SortOrder
    leader_id?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MinistriesCountOrderByAggregateInput
    _max?: MinistriesMaxOrderByAggregateInput
    _min?: MinistriesMinOrderByAggregateInput
  }

  export type MinistriesScalarWhereWithAggregatesInput = {
    AND?: MinistriesScalarWhereWithAggregatesInput | MinistriesScalarWhereWithAggregatesInput[]
    OR?: MinistriesScalarWhereWithAggregatesInput[]
    NOT?: MinistriesScalarWhereWithAggregatesInput | MinistriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ministries"> | string
    name?: StringWithAggregatesFilter<"Ministries"> | string
    description?: StringNullableWithAggregatesFilter<"Ministries"> | string | null
    church_id?: StringWithAggregatesFilter<"Ministries"> | string
    leader_id?: StringNullableWithAggregatesFilter<"Ministries"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Ministries"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ministries"> | Date | string
  }

  export type MemberMinistryWhereInput = {
    AND?: MemberMinistryWhereInput | MemberMinistryWhereInput[]
    OR?: MemberMinistryWhereInput[]
    NOT?: MemberMinistryWhereInput | MemberMinistryWhereInput[]
    id?: StringFilter<"MemberMinistry"> | string
    memberId?: StringFilter<"MemberMinistry"> | string
    ministryId?: StringFilter<"MemberMinistry"> | string
    church_id?: StringFilter<"MemberMinistry"> | string
    createdAt?: DateTimeFilter<"MemberMinistry"> | Date | string
    updatedAt?: DateTimeFilter<"MemberMinistry"> | Date | string
    church?: XOR<ChurchesScalarRelationFilter, ChurchesWhereInput>
    member?: XOR<MembersScalarRelationFilter, MembersWhereInput>
    ministry?: XOR<MinistriesScalarRelationFilter, MinistriesWhereInput>
  }

  export type MemberMinistryOrderByWithRelationInput = {
    id?: SortOrder
    memberId?: SortOrder
    ministryId?: SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    church?: ChurchesOrderByWithRelationInput
    member?: MembersOrderByWithRelationInput
    ministry?: MinistriesOrderByWithRelationInput
  }

  export type MemberMinistryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    memberId_ministryId?: MemberMinistryMemberIdMinistryIdCompoundUniqueInput
    AND?: MemberMinistryWhereInput | MemberMinistryWhereInput[]
    OR?: MemberMinistryWhereInput[]
    NOT?: MemberMinistryWhereInput | MemberMinistryWhereInput[]
    memberId?: StringFilter<"MemberMinistry"> | string
    ministryId?: StringFilter<"MemberMinistry"> | string
    church_id?: StringFilter<"MemberMinistry"> | string
    createdAt?: DateTimeFilter<"MemberMinistry"> | Date | string
    updatedAt?: DateTimeFilter<"MemberMinistry"> | Date | string
    church?: XOR<ChurchesScalarRelationFilter, ChurchesWhereInput>
    member?: XOR<MembersScalarRelationFilter, MembersWhereInput>
    ministry?: XOR<MinistriesScalarRelationFilter, MinistriesWhereInput>
  }, "id" | "memberId_ministryId">

  export type MemberMinistryOrderByWithAggregationInput = {
    id?: SortOrder
    memberId?: SortOrder
    ministryId?: SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MemberMinistryCountOrderByAggregateInput
    _max?: MemberMinistryMaxOrderByAggregateInput
    _min?: MemberMinistryMinOrderByAggregateInput
  }

  export type MemberMinistryScalarWhereWithAggregatesInput = {
    AND?: MemberMinistryScalarWhereWithAggregatesInput | MemberMinistryScalarWhereWithAggregatesInput[]
    OR?: MemberMinistryScalarWhereWithAggregatesInput[]
    NOT?: MemberMinistryScalarWhereWithAggregatesInput | MemberMinistryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MemberMinistry"> | string
    memberId?: StringWithAggregatesFilter<"MemberMinistry"> | string
    ministryId?: StringWithAggregatesFilter<"MemberMinistry"> | string
    church_id?: StringWithAggregatesFilter<"MemberMinistry"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MemberMinistry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MemberMinistry"> | Date | string
  }

  export type ChurchesCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberMinistries?: MemberMinistryCreateNestedManyWithoutChurchInput
    members?: MembersCreateNestedManyWithoutChurchInput
    ministries?: MinistriesCreateNestedManyWithoutChurchInput
  }

  export type ChurchesUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberMinistries?: MemberMinistryUncheckedCreateNestedManyWithoutChurchInput
    members?: MembersUncheckedCreateNestedManyWithoutChurchInput
    ministries?: MinistriesUncheckedCreateNestedManyWithoutChurchInput
  }

  export type ChurchesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberMinistries?: MemberMinistryUpdateManyWithoutChurchNestedInput
    members?: MembersUpdateManyWithoutChurchNestedInput
    ministries?: MinistriesUpdateManyWithoutChurchNestedInput
  }

  export type ChurchesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberMinistries?: MemberMinistryUncheckedUpdateManyWithoutChurchNestedInput
    members?: MembersUncheckedUpdateManyWithoutChurchNestedInput
    ministries?: MinistriesUncheckedUpdateManyWithoutChurchNestedInput
  }

  export type ChurchesCreateManyInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChurchesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChurchesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembersCreateInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ministries?: MemberMinistryCreateNestedManyWithoutMemberInput
    church: ChurchesCreateNestedOneWithoutMembersInput
    ledMinistries?: MinistriesCreateNestedManyWithoutLeaderInput
  }

  export type MembersUncheckedCreateInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ministries?: MemberMinistryUncheckedCreateNestedManyWithoutMemberInput
    ledMinistries?: MinistriesUncheckedCreateNestedManyWithoutLeaderInput
  }

  export type MembersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ministries?: MemberMinistryUpdateManyWithoutMemberNestedInput
    church?: ChurchesUpdateOneRequiredWithoutMembersNestedInput
    ledMinistries?: MinistriesUpdateManyWithoutLeaderNestedInput
  }

  export type MembersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ministries?: MemberMinistryUncheckedUpdateManyWithoutMemberNestedInput
    ledMinistries?: MinistriesUncheckedUpdateManyWithoutLeaderNestedInput
  }

  export type MembersCreateManyInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MembersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MinistriesCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: MemberMinistryCreateNestedManyWithoutMinistryInput
    church: ChurchesCreateNestedOneWithoutMinistriesInput
    leader?: MembersCreateNestedOneWithoutLedMinistriesInput
  }

  export type MinistriesUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    church_id: string
    leader_id?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: MemberMinistryUncheckedCreateNestedManyWithoutMinistryInput
  }

  export type MinistriesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: MemberMinistryUpdateManyWithoutMinistryNestedInput
    church?: ChurchesUpdateOneRequiredWithoutMinistriesNestedInput
    leader?: MembersUpdateOneWithoutLedMinistriesNestedInput
  }

  export type MinistriesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    leader_id?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: MemberMinistryUncheckedUpdateManyWithoutMinistryNestedInput
  }

  export type MinistriesCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    church_id: string
    leader_id?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MinistriesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MinistriesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    leader_id?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    church: ChurchesCreateNestedOneWithoutMemberMinistriesInput
    member: MembersCreateNestedOneWithoutMinistriesInput
    ministry: MinistriesCreateNestedOneWithoutMembersInput
  }

  export type MemberMinistryUncheckedCreateInput = {
    id?: string
    memberId: string
    ministryId: string
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberMinistryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    church?: ChurchesUpdateOneRequiredWithoutMemberMinistriesNestedInput
    member?: MembersUpdateOneRequiredWithoutMinistriesNestedInput
    ministry?: MinistriesUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberMinistryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    ministryId?: StringFieldUpdateOperationsInput | string
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryCreateManyInput = {
    id?: string
    memberId: string
    ministryId: string
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberMinistryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    ministryId?: StringFieldUpdateOperationsInput | string
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MemberMinistryListRelationFilter = {
    every?: MemberMinistryWhereInput
    some?: MemberMinistryWhereInput
    none?: MemberMinistryWhereInput
  }

  export type MembersListRelationFilter = {
    every?: MembersWhereInput
    some?: MembersWhereInput
    none?: MembersWhereInput
  }

  export type MinistriesListRelationFilter = {
    every?: MinistriesWhereInput
    some?: MinistriesWhereInput
    none?: MinistriesWhereInput
  }

  export type MemberMinistryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MembersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MinistriesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChurchesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChurchesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChurchesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumMemberRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberRole | EnumMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMemberRoleFilter<$PrismaModel> | $Enums.MemberRole
  }

  export type EnumGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderFilter<$PrismaModel> | $Enums.Gender
  }

  export type ChurchesScalarRelationFilter = {
    is?: ChurchesWhereInput
    isNot?: ChurchesWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MembersCountOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    age?: SortOrder
    street?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip?: SortOrder
    country?: SortOrder
    birthDate?: SortOrder
    baptismDate?: SortOrder
    role?: SortOrder
    gender?: SortOrder
    pictureUrl?: SortOrder
    notes?: SortOrder
    passwordHash?: SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MembersAvgOrderByAggregateInput = {
    age?: SortOrder
  }

  export type MembersMaxOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    age?: SortOrder
    street?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip?: SortOrder
    country?: SortOrder
    birthDate?: SortOrder
    baptismDate?: SortOrder
    role?: SortOrder
    gender?: SortOrder
    pictureUrl?: SortOrder
    notes?: SortOrder
    passwordHash?: SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MembersMinOrderByAggregateInput = {
    id?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    age?: SortOrder
    street?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip?: SortOrder
    country?: SortOrder
    birthDate?: SortOrder
    baptismDate?: SortOrder
    role?: SortOrder
    gender?: SortOrder
    pictureUrl?: SortOrder
    notes?: SortOrder
    passwordHash?: SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MembersSumOrderByAggregateInput = {
    age?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumMemberRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberRole | EnumMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMemberRoleWithAggregatesFilter<$PrismaModel> | $Enums.MemberRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMemberRoleFilter<$PrismaModel>
    _max?: NestedEnumMemberRoleFilter<$PrismaModel>
  }

  export type EnumGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderWithAggregatesFilter<$PrismaModel> | $Enums.Gender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenderFilter<$PrismaModel>
    _max?: NestedEnumGenderFilter<$PrismaModel>
  }

  export type MembersNullableScalarRelationFilter = {
    is?: MembersWhereInput | null
    isNot?: MembersWhereInput | null
  }

  export type MinistriesNameChurch_idCompoundUniqueInput = {
    name: string
    church_id: string
  }

  export type MinistriesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    church_id?: SortOrder
    leader_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MinistriesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    church_id?: SortOrder
    leader_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MinistriesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    church_id?: SortOrder
    leader_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MembersScalarRelationFilter = {
    is?: MembersWhereInput
    isNot?: MembersWhereInput
  }

  export type MinistriesScalarRelationFilter = {
    is?: MinistriesWhereInput
    isNot?: MinistriesWhereInput
  }

  export type MemberMinistryMemberIdMinistryIdCompoundUniqueInput = {
    memberId: string
    ministryId: string
  }

  export type MemberMinistryCountOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    ministryId?: SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MemberMinistryMaxOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    ministryId?: SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MemberMinistryMinOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    ministryId?: SortOrder
    church_id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MemberMinistryCreateNestedManyWithoutChurchInput = {
    create?: XOR<MemberMinistryCreateWithoutChurchInput, MemberMinistryUncheckedCreateWithoutChurchInput> | MemberMinistryCreateWithoutChurchInput[] | MemberMinistryUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutChurchInput | MemberMinistryCreateOrConnectWithoutChurchInput[]
    createMany?: MemberMinistryCreateManyChurchInputEnvelope
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
  }

  export type MembersCreateNestedManyWithoutChurchInput = {
    create?: XOR<MembersCreateWithoutChurchInput, MembersUncheckedCreateWithoutChurchInput> | MembersCreateWithoutChurchInput[] | MembersUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MembersCreateOrConnectWithoutChurchInput | MembersCreateOrConnectWithoutChurchInput[]
    createMany?: MembersCreateManyChurchInputEnvelope
    connect?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
  }

  export type MinistriesCreateNestedManyWithoutChurchInput = {
    create?: XOR<MinistriesCreateWithoutChurchInput, MinistriesUncheckedCreateWithoutChurchInput> | MinistriesCreateWithoutChurchInput[] | MinistriesUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MinistriesCreateOrConnectWithoutChurchInput | MinistriesCreateOrConnectWithoutChurchInput[]
    createMany?: MinistriesCreateManyChurchInputEnvelope
    connect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
  }

  export type MemberMinistryUncheckedCreateNestedManyWithoutChurchInput = {
    create?: XOR<MemberMinistryCreateWithoutChurchInput, MemberMinistryUncheckedCreateWithoutChurchInput> | MemberMinistryCreateWithoutChurchInput[] | MemberMinistryUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutChurchInput | MemberMinistryCreateOrConnectWithoutChurchInput[]
    createMany?: MemberMinistryCreateManyChurchInputEnvelope
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
  }

  export type MembersUncheckedCreateNestedManyWithoutChurchInput = {
    create?: XOR<MembersCreateWithoutChurchInput, MembersUncheckedCreateWithoutChurchInput> | MembersCreateWithoutChurchInput[] | MembersUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MembersCreateOrConnectWithoutChurchInput | MembersCreateOrConnectWithoutChurchInput[]
    createMany?: MembersCreateManyChurchInputEnvelope
    connect?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
  }

  export type MinistriesUncheckedCreateNestedManyWithoutChurchInput = {
    create?: XOR<MinistriesCreateWithoutChurchInput, MinistriesUncheckedCreateWithoutChurchInput> | MinistriesCreateWithoutChurchInput[] | MinistriesUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MinistriesCreateOrConnectWithoutChurchInput | MinistriesCreateOrConnectWithoutChurchInput[]
    createMany?: MinistriesCreateManyChurchInputEnvelope
    connect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MemberMinistryUpdateManyWithoutChurchNestedInput = {
    create?: XOR<MemberMinistryCreateWithoutChurchInput, MemberMinistryUncheckedCreateWithoutChurchInput> | MemberMinistryCreateWithoutChurchInput[] | MemberMinistryUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutChurchInput | MemberMinistryCreateOrConnectWithoutChurchInput[]
    upsert?: MemberMinistryUpsertWithWhereUniqueWithoutChurchInput | MemberMinistryUpsertWithWhereUniqueWithoutChurchInput[]
    createMany?: MemberMinistryCreateManyChurchInputEnvelope
    set?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    disconnect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    delete?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    update?: MemberMinistryUpdateWithWhereUniqueWithoutChurchInput | MemberMinistryUpdateWithWhereUniqueWithoutChurchInput[]
    updateMany?: MemberMinistryUpdateManyWithWhereWithoutChurchInput | MemberMinistryUpdateManyWithWhereWithoutChurchInput[]
    deleteMany?: MemberMinistryScalarWhereInput | MemberMinistryScalarWhereInput[]
  }

  export type MembersUpdateManyWithoutChurchNestedInput = {
    create?: XOR<MembersCreateWithoutChurchInput, MembersUncheckedCreateWithoutChurchInput> | MembersCreateWithoutChurchInput[] | MembersUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MembersCreateOrConnectWithoutChurchInput | MembersCreateOrConnectWithoutChurchInput[]
    upsert?: MembersUpsertWithWhereUniqueWithoutChurchInput | MembersUpsertWithWhereUniqueWithoutChurchInput[]
    createMany?: MembersCreateManyChurchInputEnvelope
    set?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
    disconnect?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
    delete?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
    connect?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
    update?: MembersUpdateWithWhereUniqueWithoutChurchInput | MembersUpdateWithWhereUniqueWithoutChurchInput[]
    updateMany?: MembersUpdateManyWithWhereWithoutChurchInput | MembersUpdateManyWithWhereWithoutChurchInput[]
    deleteMany?: MembersScalarWhereInput | MembersScalarWhereInput[]
  }

  export type MinistriesUpdateManyWithoutChurchNestedInput = {
    create?: XOR<MinistriesCreateWithoutChurchInput, MinistriesUncheckedCreateWithoutChurchInput> | MinistriesCreateWithoutChurchInput[] | MinistriesUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MinistriesCreateOrConnectWithoutChurchInput | MinistriesCreateOrConnectWithoutChurchInput[]
    upsert?: MinistriesUpsertWithWhereUniqueWithoutChurchInput | MinistriesUpsertWithWhereUniqueWithoutChurchInput[]
    createMany?: MinistriesCreateManyChurchInputEnvelope
    set?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    disconnect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    delete?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    connect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    update?: MinistriesUpdateWithWhereUniqueWithoutChurchInput | MinistriesUpdateWithWhereUniqueWithoutChurchInput[]
    updateMany?: MinistriesUpdateManyWithWhereWithoutChurchInput | MinistriesUpdateManyWithWhereWithoutChurchInput[]
    deleteMany?: MinistriesScalarWhereInput | MinistriesScalarWhereInput[]
  }

  export type MemberMinistryUncheckedUpdateManyWithoutChurchNestedInput = {
    create?: XOR<MemberMinistryCreateWithoutChurchInput, MemberMinistryUncheckedCreateWithoutChurchInput> | MemberMinistryCreateWithoutChurchInput[] | MemberMinistryUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutChurchInput | MemberMinistryCreateOrConnectWithoutChurchInput[]
    upsert?: MemberMinistryUpsertWithWhereUniqueWithoutChurchInput | MemberMinistryUpsertWithWhereUniqueWithoutChurchInput[]
    createMany?: MemberMinistryCreateManyChurchInputEnvelope
    set?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    disconnect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    delete?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    update?: MemberMinistryUpdateWithWhereUniqueWithoutChurchInput | MemberMinistryUpdateWithWhereUniqueWithoutChurchInput[]
    updateMany?: MemberMinistryUpdateManyWithWhereWithoutChurchInput | MemberMinistryUpdateManyWithWhereWithoutChurchInput[]
    deleteMany?: MemberMinistryScalarWhereInput | MemberMinistryScalarWhereInput[]
  }

  export type MembersUncheckedUpdateManyWithoutChurchNestedInput = {
    create?: XOR<MembersCreateWithoutChurchInput, MembersUncheckedCreateWithoutChurchInput> | MembersCreateWithoutChurchInput[] | MembersUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MembersCreateOrConnectWithoutChurchInput | MembersCreateOrConnectWithoutChurchInput[]
    upsert?: MembersUpsertWithWhereUniqueWithoutChurchInput | MembersUpsertWithWhereUniqueWithoutChurchInput[]
    createMany?: MembersCreateManyChurchInputEnvelope
    set?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
    disconnect?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
    delete?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
    connect?: MembersWhereUniqueInput | MembersWhereUniqueInput[]
    update?: MembersUpdateWithWhereUniqueWithoutChurchInput | MembersUpdateWithWhereUniqueWithoutChurchInput[]
    updateMany?: MembersUpdateManyWithWhereWithoutChurchInput | MembersUpdateManyWithWhereWithoutChurchInput[]
    deleteMany?: MembersScalarWhereInput | MembersScalarWhereInput[]
  }

  export type MinistriesUncheckedUpdateManyWithoutChurchNestedInput = {
    create?: XOR<MinistriesCreateWithoutChurchInput, MinistriesUncheckedCreateWithoutChurchInput> | MinistriesCreateWithoutChurchInput[] | MinistriesUncheckedCreateWithoutChurchInput[]
    connectOrCreate?: MinistriesCreateOrConnectWithoutChurchInput | MinistriesCreateOrConnectWithoutChurchInput[]
    upsert?: MinistriesUpsertWithWhereUniqueWithoutChurchInput | MinistriesUpsertWithWhereUniqueWithoutChurchInput[]
    createMany?: MinistriesCreateManyChurchInputEnvelope
    set?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    disconnect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    delete?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    connect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    update?: MinistriesUpdateWithWhereUniqueWithoutChurchInput | MinistriesUpdateWithWhereUniqueWithoutChurchInput[]
    updateMany?: MinistriesUpdateManyWithWhereWithoutChurchInput | MinistriesUpdateManyWithWhereWithoutChurchInput[]
    deleteMany?: MinistriesScalarWhereInput | MinistriesScalarWhereInput[]
  }

  export type MemberMinistryCreateNestedManyWithoutMemberInput = {
    create?: XOR<MemberMinistryCreateWithoutMemberInput, MemberMinistryUncheckedCreateWithoutMemberInput> | MemberMinistryCreateWithoutMemberInput[] | MemberMinistryUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutMemberInput | MemberMinistryCreateOrConnectWithoutMemberInput[]
    createMany?: MemberMinistryCreateManyMemberInputEnvelope
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
  }

  export type ChurchesCreateNestedOneWithoutMembersInput = {
    create?: XOR<ChurchesCreateWithoutMembersInput, ChurchesUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ChurchesCreateOrConnectWithoutMembersInput
    connect?: ChurchesWhereUniqueInput
  }

  export type MinistriesCreateNestedManyWithoutLeaderInput = {
    create?: XOR<MinistriesCreateWithoutLeaderInput, MinistriesUncheckedCreateWithoutLeaderInput> | MinistriesCreateWithoutLeaderInput[] | MinistriesUncheckedCreateWithoutLeaderInput[]
    connectOrCreate?: MinistriesCreateOrConnectWithoutLeaderInput | MinistriesCreateOrConnectWithoutLeaderInput[]
    createMany?: MinistriesCreateManyLeaderInputEnvelope
    connect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
  }

  export type MemberMinistryUncheckedCreateNestedManyWithoutMemberInput = {
    create?: XOR<MemberMinistryCreateWithoutMemberInput, MemberMinistryUncheckedCreateWithoutMemberInput> | MemberMinistryCreateWithoutMemberInput[] | MemberMinistryUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutMemberInput | MemberMinistryCreateOrConnectWithoutMemberInput[]
    createMany?: MemberMinistryCreateManyMemberInputEnvelope
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
  }

  export type MinistriesUncheckedCreateNestedManyWithoutLeaderInput = {
    create?: XOR<MinistriesCreateWithoutLeaderInput, MinistriesUncheckedCreateWithoutLeaderInput> | MinistriesCreateWithoutLeaderInput[] | MinistriesUncheckedCreateWithoutLeaderInput[]
    connectOrCreate?: MinistriesCreateOrConnectWithoutLeaderInput | MinistriesCreateOrConnectWithoutLeaderInput[]
    createMany?: MinistriesCreateManyLeaderInputEnvelope
    connect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumMemberRoleFieldUpdateOperationsInput = {
    set?: $Enums.MemberRole
  }

  export type EnumGenderFieldUpdateOperationsInput = {
    set?: $Enums.Gender
  }

  export type MemberMinistryUpdateManyWithoutMemberNestedInput = {
    create?: XOR<MemberMinistryCreateWithoutMemberInput, MemberMinistryUncheckedCreateWithoutMemberInput> | MemberMinistryCreateWithoutMemberInput[] | MemberMinistryUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutMemberInput | MemberMinistryCreateOrConnectWithoutMemberInput[]
    upsert?: MemberMinistryUpsertWithWhereUniqueWithoutMemberInput | MemberMinistryUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: MemberMinistryCreateManyMemberInputEnvelope
    set?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    disconnect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    delete?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    update?: MemberMinistryUpdateWithWhereUniqueWithoutMemberInput | MemberMinistryUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: MemberMinistryUpdateManyWithWhereWithoutMemberInput | MemberMinistryUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: MemberMinistryScalarWhereInput | MemberMinistryScalarWhereInput[]
  }

  export type ChurchesUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<ChurchesCreateWithoutMembersInput, ChurchesUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ChurchesCreateOrConnectWithoutMembersInput
    upsert?: ChurchesUpsertWithoutMembersInput
    connect?: ChurchesWhereUniqueInput
    update?: XOR<XOR<ChurchesUpdateToOneWithWhereWithoutMembersInput, ChurchesUpdateWithoutMembersInput>, ChurchesUncheckedUpdateWithoutMembersInput>
  }

  export type MinistriesUpdateManyWithoutLeaderNestedInput = {
    create?: XOR<MinistriesCreateWithoutLeaderInput, MinistriesUncheckedCreateWithoutLeaderInput> | MinistriesCreateWithoutLeaderInput[] | MinistriesUncheckedCreateWithoutLeaderInput[]
    connectOrCreate?: MinistriesCreateOrConnectWithoutLeaderInput | MinistriesCreateOrConnectWithoutLeaderInput[]
    upsert?: MinistriesUpsertWithWhereUniqueWithoutLeaderInput | MinistriesUpsertWithWhereUniqueWithoutLeaderInput[]
    createMany?: MinistriesCreateManyLeaderInputEnvelope
    set?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    disconnect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    delete?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    connect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    update?: MinistriesUpdateWithWhereUniqueWithoutLeaderInput | MinistriesUpdateWithWhereUniqueWithoutLeaderInput[]
    updateMany?: MinistriesUpdateManyWithWhereWithoutLeaderInput | MinistriesUpdateManyWithWhereWithoutLeaderInput[]
    deleteMany?: MinistriesScalarWhereInput | MinistriesScalarWhereInput[]
  }

  export type MemberMinistryUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: XOR<MemberMinistryCreateWithoutMemberInput, MemberMinistryUncheckedCreateWithoutMemberInput> | MemberMinistryCreateWithoutMemberInput[] | MemberMinistryUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutMemberInput | MemberMinistryCreateOrConnectWithoutMemberInput[]
    upsert?: MemberMinistryUpsertWithWhereUniqueWithoutMemberInput | MemberMinistryUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: MemberMinistryCreateManyMemberInputEnvelope
    set?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    disconnect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    delete?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    update?: MemberMinistryUpdateWithWhereUniqueWithoutMemberInput | MemberMinistryUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: MemberMinistryUpdateManyWithWhereWithoutMemberInput | MemberMinistryUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: MemberMinistryScalarWhereInput | MemberMinistryScalarWhereInput[]
  }

  export type MinistriesUncheckedUpdateManyWithoutLeaderNestedInput = {
    create?: XOR<MinistriesCreateWithoutLeaderInput, MinistriesUncheckedCreateWithoutLeaderInput> | MinistriesCreateWithoutLeaderInput[] | MinistriesUncheckedCreateWithoutLeaderInput[]
    connectOrCreate?: MinistriesCreateOrConnectWithoutLeaderInput | MinistriesCreateOrConnectWithoutLeaderInput[]
    upsert?: MinistriesUpsertWithWhereUniqueWithoutLeaderInput | MinistriesUpsertWithWhereUniqueWithoutLeaderInput[]
    createMany?: MinistriesCreateManyLeaderInputEnvelope
    set?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    disconnect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    delete?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    connect?: MinistriesWhereUniqueInput | MinistriesWhereUniqueInput[]
    update?: MinistriesUpdateWithWhereUniqueWithoutLeaderInput | MinistriesUpdateWithWhereUniqueWithoutLeaderInput[]
    updateMany?: MinistriesUpdateManyWithWhereWithoutLeaderInput | MinistriesUpdateManyWithWhereWithoutLeaderInput[]
    deleteMany?: MinistriesScalarWhereInput | MinistriesScalarWhereInput[]
  }

  export type MemberMinistryCreateNestedManyWithoutMinistryInput = {
    create?: XOR<MemberMinistryCreateWithoutMinistryInput, MemberMinistryUncheckedCreateWithoutMinistryInput> | MemberMinistryCreateWithoutMinistryInput[] | MemberMinistryUncheckedCreateWithoutMinistryInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutMinistryInput | MemberMinistryCreateOrConnectWithoutMinistryInput[]
    createMany?: MemberMinistryCreateManyMinistryInputEnvelope
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
  }

  export type ChurchesCreateNestedOneWithoutMinistriesInput = {
    create?: XOR<ChurchesCreateWithoutMinistriesInput, ChurchesUncheckedCreateWithoutMinistriesInput>
    connectOrCreate?: ChurchesCreateOrConnectWithoutMinistriesInput
    connect?: ChurchesWhereUniqueInput
  }

  export type MembersCreateNestedOneWithoutLedMinistriesInput = {
    create?: XOR<MembersCreateWithoutLedMinistriesInput, MembersUncheckedCreateWithoutLedMinistriesInput>
    connectOrCreate?: MembersCreateOrConnectWithoutLedMinistriesInput
    connect?: MembersWhereUniqueInput
  }

  export type MemberMinistryUncheckedCreateNestedManyWithoutMinistryInput = {
    create?: XOR<MemberMinistryCreateWithoutMinistryInput, MemberMinistryUncheckedCreateWithoutMinistryInput> | MemberMinistryCreateWithoutMinistryInput[] | MemberMinistryUncheckedCreateWithoutMinistryInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutMinistryInput | MemberMinistryCreateOrConnectWithoutMinistryInput[]
    createMany?: MemberMinistryCreateManyMinistryInputEnvelope
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
  }

  export type MemberMinistryUpdateManyWithoutMinistryNestedInput = {
    create?: XOR<MemberMinistryCreateWithoutMinistryInput, MemberMinistryUncheckedCreateWithoutMinistryInput> | MemberMinistryCreateWithoutMinistryInput[] | MemberMinistryUncheckedCreateWithoutMinistryInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutMinistryInput | MemberMinistryCreateOrConnectWithoutMinistryInput[]
    upsert?: MemberMinistryUpsertWithWhereUniqueWithoutMinistryInput | MemberMinistryUpsertWithWhereUniqueWithoutMinistryInput[]
    createMany?: MemberMinistryCreateManyMinistryInputEnvelope
    set?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    disconnect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    delete?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    update?: MemberMinistryUpdateWithWhereUniqueWithoutMinistryInput | MemberMinistryUpdateWithWhereUniqueWithoutMinistryInput[]
    updateMany?: MemberMinistryUpdateManyWithWhereWithoutMinistryInput | MemberMinistryUpdateManyWithWhereWithoutMinistryInput[]
    deleteMany?: MemberMinistryScalarWhereInput | MemberMinistryScalarWhereInput[]
  }

  export type ChurchesUpdateOneRequiredWithoutMinistriesNestedInput = {
    create?: XOR<ChurchesCreateWithoutMinistriesInput, ChurchesUncheckedCreateWithoutMinistriesInput>
    connectOrCreate?: ChurchesCreateOrConnectWithoutMinistriesInput
    upsert?: ChurchesUpsertWithoutMinistriesInput
    connect?: ChurchesWhereUniqueInput
    update?: XOR<XOR<ChurchesUpdateToOneWithWhereWithoutMinistriesInput, ChurchesUpdateWithoutMinistriesInput>, ChurchesUncheckedUpdateWithoutMinistriesInput>
  }

  export type MembersUpdateOneWithoutLedMinistriesNestedInput = {
    create?: XOR<MembersCreateWithoutLedMinistriesInput, MembersUncheckedCreateWithoutLedMinistriesInput>
    connectOrCreate?: MembersCreateOrConnectWithoutLedMinistriesInput
    upsert?: MembersUpsertWithoutLedMinistriesInput
    disconnect?: MembersWhereInput | boolean
    delete?: MembersWhereInput | boolean
    connect?: MembersWhereUniqueInput
    update?: XOR<XOR<MembersUpdateToOneWithWhereWithoutLedMinistriesInput, MembersUpdateWithoutLedMinistriesInput>, MembersUncheckedUpdateWithoutLedMinistriesInput>
  }

  export type MemberMinistryUncheckedUpdateManyWithoutMinistryNestedInput = {
    create?: XOR<MemberMinistryCreateWithoutMinistryInput, MemberMinistryUncheckedCreateWithoutMinistryInput> | MemberMinistryCreateWithoutMinistryInput[] | MemberMinistryUncheckedCreateWithoutMinistryInput[]
    connectOrCreate?: MemberMinistryCreateOrConnectWithoutMinistryInput | MemberMinistryCreateOrConnectWithoutMinistryInput[]
    upsert?: MemberMinistryUpsertWithWhereUniqueWithoutMinistryInput | MemberMinistryUpsertWithWhereUniqueWithoutMinistryInput[]
    createMany?: MemberMinistryCreateManyMinistryInputEnvelope
    set?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    disconnect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    delete?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    connect?: MemberMinistryWhereUniqueInput | MemberMinistryWhereUniqueInput[]
    update?: MemberMinistryUpdateWithWhereUniqueWithoutMinistryInput | MemberMinistryUpdateWithWhereUniqueWithoutMinistryInput[]
    updateMany?: MemberMinistryUpdateManyWithWhereWithoutMinistryInput | MemberMinistryUpdateManyWithWhereWithoutMinistryInput[]
    deleteMany?: MemberMinistryScalarWhereInput | MemberMinistryScalarWhereInput[]
  }

  export type ChurchesCreateNestedOneWithoutMemberMinistriesInput = {
    create?: XOR<ChurchesCreateWithoutMemberMinistriesInput, ChurchesUncheckedCreateWithoutMemberMinistriesInput>
    connectOrCreate?: ChurchesCreateOrConnectWithoutMemberMinistriesInput
    connect?: ChurchesWhereUniqueInput
  }

  export type MembersCreateNestedOneWithoutMinistriesInput = {
    create?: XOR<MembersCreateWithoutMinistriesInput, MembersUncheckedCreateWithoutMinistriesInput>
    connectOrCreate?: MembersCreateOrConnectWithoutMinistriesInput
    connect?: MembersWhereUniqueInput
  }

  export type MinistriesCreateNestedOneWithoutMembersInput = {
    create?: XOR<MinistriesCreateWithoutMembersInput, MinistriesUncheckedCreateWithoutMembersInput>
    connectOrCreate?: MinistriesCreateOrConnectWithoutMembersInput
    connect?: MinistriesWhereUniqueInput
  }

  export type ChurchesUpdateOneRequiredWithoutMemberMinistriesNestedInput = {
    create?: XOR<ChurchesCreateWithoutMemberMinistriesInput, ChurchesUncheckedCreateWithoutMemberMinistriesInput>
    connectOrCreate?: ChurchesCreateOrConnectWithoutMemberMinistriesInput
    upsert?: ChurchesUpsertWithoutMemberMinistriesInput
    connect?: ChurchesWhereUniqueInput
    update?: XOR<XOR<ChurchesUpdateToOneWithWhereWithoutMemberMinistriesInput, ChurchesUpdateWithoutMemberMinistriesInput>, ChurchesUncheckedUpdateWithoutMemberMinistriesInput>
  }

  export type MembersUpdateOneRequiredWithoutMinistriesNestedInput = {
    create?: XOR<MembersCreateWithoutMinistriesInput, MembersUncheckedCreateWithoutMinistriesInput>
    connectOrCreate?: MembersCreateOrConnectWithoutMinistriesInput
    upsert?: MembersUpsertWithoutMinistriesInput
    connect?: MembersWhereUniqueInput
    update?: XOR<XOR<MembersUpdateToOneWithWhereWithoutMinistriesInput, MembersUpdateWithoutMinistriesInput>, MembersUncheckedUpdateWithoutMinistriesInput>
  }

  export type MinistriesUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<MinistriesCreateWithoutMembersInput, MinistriesUncheckedCreateWithoutMembersInput>
    connectOrCreate?: MinistriesCreateOrConnectWithoutMembersInput
    upsert?: MinistriesUpsertWithoutMembersInput
    connect?: MinistriesWhereUniqueInput
    update?: XOR<XOR<MinistriesUpdateToOneWithWhereWithoutMembersInput, MinistriesUpdateWithoutMembersInput>, MinistriesUncheckedUpdateWithoutMembersInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumMemberRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberRole | EnumMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMemberRoleFilter<$PrismaModel> | $Enums.MemberRole
  }

  export type NestedEnumGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderFilter<$PrismaModel> | $Enums.Gender
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumMemberRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberRole | EnumMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMemberRoleWithAggregatesFilter<$PrismaModel> | $Enums.MemberRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMemberRoleFilter<$PrismaModel>
    _max?: NestedEnumMemberRoleFilter<$PrismaModel>
  }

  export type NestedEnumGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumGenderWithAggregatesFilter<$PrismaModel> | $Enums.Gender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenderFilter<$PrismaModel>
    _max?: NestedEnumGenderFilter<$PrismaModel>
  }

  export type MemberMinistryCreateWithoutChurchInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    member: MembersCreateNestedOneWithoutMinistriesInput
    ministry: MinistriesCreateNestedOneWithoutMembersInput
  }

  export type MemberMinistryUncheckedCreateWithoutChurchInput = {
    id?: string
    memberId: string
    ministryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberMinistryCreateOrConnectWithoutChurchInput = {
    where: MemberMinistryWhereUniqueInput
    create: XOR<MemberMinistryCreateWithoutChurchInput, MemberMinistryUncheckedCreateWithoutChurchInput>
  }

  export type MemberMinistryCreateManyChurchInputEnvelope = {
    data: MemberMinistryCreateManyChurchInput | MemberMinistryCreateManyChurchInput[]
    skipDuplicates?: boolean
  }

  export type MembersCreateWithoutChurchInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ministries?: MemberMinistryCreateNestedManyWithoutMemberInput
    ledMinistries?: MinistriesCreateNestedManyWithoutLeaderInput
  }

  export type MembersUncheckedCreateWithoutChurchInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ministries?: MemberMinistryUncheckedCreateNestedManyWithoutMemberInput
    ledMinistries?: MinistriesUncheckedCreateNestedManyWithoutLeaderInput
  }

  export type MembersCreateOrConnectWithoutChurchInput = {
    where: MembersWhereUniqueInput
    create: XOR<MembersCreateWithoutChurchInput, MembersUncheckedCreateWithoutChurchInput>
  }

  export type MembersCreateManyChurchInputEnvelope = {
    data: MembersCreateManyChurchInput | MembersCreateManyChurchInput[]
    skipDuplicates?: boolean
  }

  export type MinistriesCreateWithoutChurchInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: MemberMinistryCreateNestedManyWithoutMinistryInput
    leader?: MembersCreateNestedOneWithoutLedMinistriesInput
  }

  export type MinistriesUncheckedCreateWithoutChurchInput = {
    id?: string
    name: string
    description?: string | null
    leader_id?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: MemberMinistryUncheckedCreateNestedManyWithoutMinistryInput
  }

  export type MinistriesCreateOrConnectWithoutChurchInput = {
    where: MinistriesWhereUniqueInput
    create: XOR<MinistriesCreateWithoutChurchInput, MinistriesUncheckedCreateWithoutChurchInput>
  }

  export type MinistriesCreateManyChurchInputEnvelope = {
    data: MinistriesCreateManyChurchInput | MinistriesCreateManyChurchInput[]
    skipDuplicates?: boolean
  }

  export type MemberMinistryUpsertWithWhereUniqueWithoutChurchInput = {
    where: MemberMinistryWhereUniqueInput
    update: XOR<MemberMinistryUpdateWithoutChurchInput, MemberMinistryUncheckedUpdateWithoutChurchInput>
    create: XOR<MemberMinistryCreateWithoutChurchInput, MemberMinistryUncheckedCreateWithoutChurchInput>
  }

  export type MemberMinistryUpdateWithWhereUniqueWithoutChurchInput = {
    where: MemberMinistryWhereUniqueInput
    data: XOR<MemberMinistryUpdateWithoutChurchInput, MemberMinistryUncheckedUpdateWithoutChurchInput>
  }

  export type MemberMinistryUpdateManyWithWhereWithoutChurchInput = {
    where: MemberMinistryScalarWhereInput
    data: XOR<MemberMinistryUpdateManyMutationInput, MemberMinistryUncheckedUpdateManyWithoutChurchInput>
  }

  export type MemberMinistryScalarWhereInput = {
    AND?: MemberMinistryScalarWhereInput | MemberMinistryScalarWhereInput[]
    OR?: MemberMinistryScalarWhereInput[]
    NOT?: MemberMinistryScalarWhereInput | MemberMinistryScalarWhereInput[]
    id?: StringFilter<"MemberMinistry"> | string
    memberId?: StringFilter<"MemberMinistry"> | string
    ministryId?: StringFilter<"MemberMinistry"> | string
    church_id?: StringFilter<"MemberMinistry"> | string
    createdAt?: DateTimeFilter<"MemberMinistry"> | Date | string
    updatedAt?: DateTimeFilter<"MemberMinistry"> | Date | string
  }

  export type MembersUpsertWithWhereUniqueWithoutChurchInput = {
    where: MembersWhereUniqueInput
    update: XOR<MembersUpdateWithoutChurchInput, MembersUncheckedUpdateWithoutChurchInput>
    create: XOR<MembersCreateWithoutChurchInput, MembersUncheckedCreateWithoutChurchInput>
  }

  export type MembersUpdateWithWhereUniqueWithoutChurchInput = {
    where: MembersWhereUniqueInput
    data: XOR<MembersUpdateWithoutChurchInput, MembersUncheckedUpdateWithoutChurchInput>
  }

  export type MembersUpdateManyWithWhereWithoutChurchInput = {
    where: MembersScalarWhereInput
    data: XOR<MembersUpdateManyMutationInput, MembersUncheckedUpdateManyWithoutChurchInput>
  }

  export type MembersScalarWhereInput = {
    AND?: MembersScalarWhereInput | MembersScalarWhereInput[]
    OR?: MembersScalarWhereInput[]
    NOT?: MembersScalarWhereInput | MembersScalarWhereInput[]
    id?: StringFilter<"Members"> | string
    firstName?: StringFilter<"Members"> | string
    lastName?: StringFilter<"Members"> | string
    email?: StringFilter<"Members"> | string
    phone?: StringNullableFilter<"Members"> | string | null
    age?: IntNullableFilter<"Members"> | number | null
    street?: StringNullableFilter<"Members"> | string | null
    city?: StringNullableFilter<"Members"> | string | null
    state?: StringNullableFilter<"Members"> | string | null
    zip?: StringNullableFilter<"Members"> | string | null
    country?: StringNullableFilter<"Members"> | string | null
    birthDate?: DateTimeNullableFilter<"Members"> | Date | string | null
    baptismDate?: DateTimeNullableFilter<"Members"> | Date | string | null
    role?: EnumMemberRoleFilter<"Members"> | $Enums.MemberRole
    gender?: EnumGenderFilter<"Members"> | $Enums.Gender
    pictureUrl?: StringNullableFilter<"Members"> | string | null
    notes?: StringNullableFilter<"Members"> | string | null
    passwordHash?: StringNullableFilter<"Members"> | string | null
    church_id?: StringFilter<"Members"> | string
    createdAt?: DateTimeFilter<"Members"> | Date | string
    updatedAt?: DateTimeFilter<"Members"> | Date | string
  }

  export type MinistriesUpsertWithWhereUniqueWithoutChurchInput = {
    where: MinistriesWhereUniqueInput
    update: XOR<MinistriesUpdateWithoutChurchInput, MinistriesUncheckedUpdateWithoutChurchInput>
    create: XOR<MinistriesCreateWithoutChurchInput, MinistriesUncheckedCreateWithoutChurchInput>
  }

  export type MinistriesUpdateWithWhereUniqueWithoutChurchInput = {
    where: MinistriesWhereUniqueInput
    data: XOR<MinistriesUpdateWithoutChurchInput, MinistriesUncheckedUpdateWithoutChurchInput>
  }

  export type MinistriesUpdateManyWithWhereWithoutChurchInput = {
    where: MinistriesScalarWhereInput
    data: XOR<MinistriesUpdateManyMutationInput, MinistriesUncheckedUpdateManyWithoutChurchInput>
  }

  export type MinistriesScalarWhereInput = {
    AND?: MinistriesScalarWhereInput | MinistriesScalarWhereInput[]
    OR?: MinistriesScalarWhereInput[]
    NOT?: MinistriesScalarWhereInput | MinistriesScalarWhereInput[]
    id?: StringFilter<"Ministries"> | string
    name?: StringFilter<"Ministries"> | string
    description?: StringNullableFilter<"Ministries"> | string | null
    church_id?: StringFilter<"Ministries"> | string
    leader_id?: StringNullableFilter<"Ministries"> | string | null
    createdAt?: DateTimeFilter<"Ministries"> | Date | string
    updatedAt?: DateTimeFilter<"Ministries"> | Date | string
  }

  export type MemberMinistryCreateWithoutMemberInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    church: ChurchesCreateNestedOneWithoutMemberMinistriesInput
    ministry: MinistriesCreateNestedOneWithoutMembersInput
  }

  export type MemberMinistryUncheckedCreateWithoutMemberInput = {
    id?: string
    ministryId: string
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberMinistryCreateOrConnectWithoutMemberInput = {
    where: MemberMinistryWhereUniqueInput
    create: XOR<MemberMinistryCreateWithoutMemberInput, MemberMinistryUncheckedCreateWithoutMemberInput>
  }

  export type MemberMinistryCreateManyMemberInputEnvelope = {
    data: MemberMinistryCreateManyMemberInput | MemberMinistryCreateManyMemberInput[]
    skipDuplicates?: boolean
  }

  export type ChurchesCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberMinistries?: MemberMinistryCreateNestedManyWithoutChurchInput
    ministries?: MinistriesCreateNestedManyWithoutChurchInput
  }

  export type ChurchesUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberMinistries?: MemberMinistryUncheckedCreateNestedManyWithoutChurchInput
    ministries?: MinistriesUncheckedCreateNestedManyWithoutChurchInput
  }

  export type ChurchesCreateOrConnectWithoutMembersInput = {
    where: ChurchesWhereUniqueInput
    create: XOR<ChurchesCreateWithoutMembersInput, ChurchesUncheckedCreateWithoutMembersInput>
  }

  export type MinistriesCreateWithoutLeaderInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: MemberMinistryCreateNestedManyWithoutMinistryInput
    church: ChurchesCreateNestedOneWithoutMinistriesInput
  }

  export type MinistriesUncheckedCreateWithoutLeaderInput = {
    id?: string
    name: string
    description?: string | null
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: MemberMinistryUncheckedCreateNestedManyWithoutMinistryInput
  }

  export type MinistriesCreateOrConnectWithoutLeaderInput = {
    where: MinistriesWhereUniqueInput
    create: XOR<MinistriesCreateWithoutLeaderInput, MinistriesUncheckedCreateWithoutLeaderInput>
  }

  export type MinistriesCreateManyLeaderInputEnvelope = {
    data: MinistriesCreateManyLeaderInput | MinistriesCreateManyLeaderInput[]
    skipDuplicates?: boolean
  }

  export type MemberMinistryUpsertWithWhereUniqueWithoutMemberInput = {
    where: MemberMinistryWhereUniqueInput
    update: XOR<MemberMinistryUpdateWithoutMemberInput, MemberMinistryUncheckedUpdateWithoutMemberInput>
    create: XOR<MemberMinistryCreateWithoutMemberInput, MemberMinistryUncheckedCreateWithoutMemberInput>
  }

  export type MemberMinistryUpdateWithWhereUniqueWithoutMemberInput = {
    where: MemberMinistryWhereUniqueInput
    data: XOR<MemberMinistryUpdateWithoutMemberInput, MemberMinistryUncheckedUpdateWithoutMemberInput>
  }

  export type MemberMinistryUpdateManyWithWhereWithoutMemberInput = {
    where: MemberMinistryScalarWhereInput
    data: XOR<MemberMinistryUpdateManyMutationInput, MemberMinistryUncheckedUpdateManyWithoutMemberInput>
  }

  export type ChurchesUpsertWithoutMembersInput = {
    update: XOR<ChurchesUpdateWithoutMembersInput, ChurchesUncheckedUpdateWithoutMembersInput>
    create: XOR<ChurchesCreateWithoutMembersInput, ChurchesUncheckedCreateWithoutMembersInput>
    where?: ChurchesWhereInput
  }

  export type ChurchesUpdateToOneWithWhereWithoutMembersInput = {
    where?: ChurchesWhereInput
    data: XOR<ChurchesUpdateWithoutMembersInput, ChurchesUncheckedUpdateWithoutMembersInput>
  }

  export type ChurchesUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberMinistries?: MemberMinistryUpdateManyWithoutChurchNestedInput
    ministries?: MinistriesUpdateManyWithoutChurchNestedInput
  }

  export type ChurchesUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberMinistries?: MemberMinistryUncheckedUpdateManyWithoutChurchNestedInput
    ministries?: MinistriesUncheckedUpdateManyWithoutChurchNestedInput
  }

  export type MinistriesUpsertWithWhereUniqueWithoutLeaderInput = {
    where: MinistriesWhereUniqueInput
    update: XOR<MinistriesUpdateWithoutLeaderInput, MinistriesUncheckedUpdateWithoutLeaderInput>
    create: XOR<MinistriesCreateWithoutLeaderInput, MinistriesUncheckedCreateWithoutLeaderInput>
  }

  export type MinistriesUpdateWithWhereUniqueWithoutLeaderInput = {
    where: MinistriesWhereUniqueInput
    data: XOR<MinistriesUpdateWithoutLeaderInput, MinistriesUncheckedUpdateWithoutLeaderInput>
  }

  export type MinistriesUpdateManyWithWhereWithoutLeaderInput = {
    where: MinistriesScalarWhereInput
    data: XOR<MinistriesUpdateManyMutationInput, MinistriesUncheckedUpdateManyWithoutLeaderInput>
  }

  export type MemberMinistryCreateWithoutMinistryInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    church: ChurchesCreateNestedOneWithoutMemberMinistriesInput
    member: MembersCreateNestedOneWithoutMinistriesInput
  }

  export type MemberMinistryUncheckedCreateWithoutMinistryInput = {
    id?: string
    memberId: string
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberMinistryCreateOrConnectWithoutMinistryInput = {
    where: MemberMinistryWhereUniqueInput
    create: XOR<MemberMinistryCreateWithoutMinistryInput, MemberMinistryUncheckedCreateWithoutMinistryInput>
  }

  export type MemberMinistryCreateManyMinistryInputEnvelope = {
    data: MemberMinistryCreateManyMinistryInput | MemberMinistryCreateManyMinistryInput[]
    skipDuplicates?: boolean
  }

  export type ChurchesCreateWithoutMinistriesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberMinistries?: MemberMinistryCreateNestedManyWithoutChurchInput
    members?: MembersCreateNestedManyWithoutChurchInput
  }

  export type ChurchesUncheckedCreateWithoutMinistriesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    memberMinistries?: MemberMinistryUncheckedCreateNestedManyWithoutChurchInput
    members?: MembersUncheckedCreateNestedManyWithoutChurchInput
  }

  export type ChurchesCreateOrConnectWithoutMinistriesInput = {
    where: ChurchesWhereUniqueInput
    create: XOR<ChurchesCreateWithoutMinistriesInput, ChurchesUncheckedCreateWithoutMinistriesInput>
  }

  export type MembersCreateWithoutLedMinistriesInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ministries?: MemberMinistryCreateNestedManyWithoutMemberInput
    church: ChurchesCreateNestedOneWithoutMembersInput
  }

  export type MembersUncheckedCreateWithoutLedMinistriesInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ministries?: MemberMinistryUncheckedCreateNestedManyWithoutMemberInput
  }

  export type MembersCreateOrConnectWithoutLedMinistriesInput = {
    where: MembersWhereUniqueInput
    create: XOR<MembersCreateWithoutLedMinistriesInput, MembersUncheckedCreateWithoutLedMinistriesInput>
  }

  export type MemberMinistryUpsertWithWhereUniqueWithoutMinistryInput = {
    where: MemberMinistryWhereUniqueInput
    update: XOR<MemberMinistryUpdateWithoutMinistryInput, MemberMinistryUncheckedUpdateWithoutMinistryInput>
    create: XOR<MemberMinistryCreateWithoutMinistryInput, MemberMinistryUncheckedCreateWithoutMinistryInput>
  }

  export type MemberMinistryUpdateWithWhereUniqueWithoutMinistryInput = {
    where: MemberMinistryWhereUniqueInput
    data: XOR<MemberMinistryUpdateWithoutMinistryInput, MemberMinistryUncheckedUpdateWithoutMinistryInput>
  }

  export type MemberMinistryUpdateManyWithWhereWithoutMinistryInput = {
    where: MemberMinistryScalarWhereInput
    data: XOR<MemberMinistryUpdateManyMutationInput, MemberMinistryUncheckedUpdateManyWithoutMinistryInput>
  }

  export type ChurchesUpsertWithoutMinistriesInput = {
    update: XOR<ChurchesUpdateWithoutMinistriesInput, ChurchesUncheckedUpdateWithoutMinistriesInput>
    create: XOR<ChurchesCreateWithoutMinistriesInput, ChurchesUncheckedCreateWithoutMinistriesInput>
    where?: ChurchesWhereInput
  }

  export type ChurchesUpdateToOneWithWhereWithoutMinistriesInput = {
    where?: ChurchesWhereInput
    data: XOR<ChurchesUpdateWithoutMinistriesInput, ChurchesUncheckedUpdateWithoutMinistriesInput>
  }

  export type ChurchesUpdateWithoutMinistriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberMinistries?: MemberMinistryUpdateManyWithoutChurchNestedInput
    members?: MembersUpdateManyWithoutChurchNestedInput
  }

  export type ChurchesUncheckedUpdateWithoutMinistriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberMinistries?: MemberMinistryUncheckedUpdateManyWithoutChurchNestedInput
    members?: MembersUncheckedUpdateManyWithoutChurchNestedInput
  }

  export type MembersUpsertWithoutLedMinistriesInput = {
    update: XOR<MembersUpdateWithoutLedMinistriesInput, MembersUncheckedUpdateWithoutLedMinistriesInput>
    create: XOR<MembersCreateWithoutLedMinistriesInput, MembersUncheckedCreateWithoutLedMinistriesInput>
    where?: MembersWhereInput
  }

  export type MembersUpdateToOneWithWhereWithoutLedMinistriesInput = {
    where?: MembersWhereInput
    data: XOR<MembersUpdateWithoutLedMinistriesInput, MembersUncheckedUpdateWithoutLedMinistriesInput>
  }

  export type MembersUpdateWithoutLedMinistriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ministries?: MemberMinistryUpdateManyWithoutMemberNestedInput
    church?: ChurchesUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MembersUncheckedUpdateWithoutLedMinistriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ministries?: MemberMinistryUncheckedUpdateManyWithoutMemberNestedInput
  }

  export type ChurchesCreateWithoutMemberMinistriesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: MembersCreateNestedManyWithoutChurchInput
    ministries?: MinistriesCreateNestedManyWithoutChurchInput
  }

  export type ChurchesUncheckedCreateWithoutMemberMinistriesInput = {
    id?: string
    name: string
    slug: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: MembersUncheckedCreateNestedManyWithoutChurchInput
    ministries?: MinistriesUncheckedCreateNestedManyWithoutChurchInput
  }

  export type ChurchesCreateOrConnectWithoutMemberMinistriesInput = {
    where: ChurchesWhereUniqueInput
    create: XOR<ChurchesCreateWithoutMemberMinistriesInput, ChurchesUncheckedCreateWithoutMemberMinistriesInput>
  }

  export type MembersCreateWithoutMinistriesInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    church: ChurchesCreateNestedOneWithoutMembersInput
    ledMinistries?: MinistriesCreateNestedManyWithoutLeaderInput
  }

  export type MembersUncheckedCreateWithoutMinistriesInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ledMinistries?: MinistriesUncheckedCreateNestedManyWithoutLeaderInput
  }

  export type MembersCreateOrConnectWithoutMinistriesInput = {
    where: MembersWhereUniqueInput
    create: XOR<MembersCreateWithoutMinistriesInput, MembersUncheckedCreateWithoutMinistriesInput>
  }

  export type MinistriesCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    church: ChurchesCreateNestedOneWithoutMinistriesInput
    leader?: MembersCreateNestedOneWithoutLedMinistriesInput
  }

  export type MinistriesUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    church_id: string
    leader_id?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MinistriesCreateOrConnectWithoutMembersInput = {
    where: MinistriesWhereUniqueInput
    create: XOR<MinistriesCreateWithoutMembersInput, MinistriesUncheckedCreateWithoutMembersInput>
  }

  export type ChurchesUpsertWithoutMemberMinistriesInput = {
    update: XOR<ChurchesUpdateWithoutMemberMinistriesInput, ChurchesUncheckedUpdateWithoutMemberMinistriesInput>
    create: XOR<ChurchesCreateWithoutMemberMinistriesInput, ChurchesUncheckedCreateWithoutMemberMinistriesInput>
    where?: ChurchesWhereInput
  }

  export type ChurchesUpdateToOneWithWhereWithoutMemberMinistriesInput = {
    where?: ChurchesWhereInput
    data: XOR<ChurchesUpdateWithoutMemberMinistriesInput, ChurchesUncheckedUpdateWithoutMemberMinistriesInput>
  }

  export type ChurchesUpdateWithoutMemberMinistriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: MembersUpdateManyWithoutChurchNestedInput
    ministries?: MinistriesUpdateManyWithoutChurchNestedInput
  }

  export type ChurchesUncheckedUpdateWithoutMemberMinistriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: MembersUncheckedUpdateManyWithoutChurchNestedInput
    ministries?: MinistriesUncheckedUpdateManyWithoutChurchNestedInput
  }

  export type MembersUpsertWithoutMinistriesInput = {
    update: XOR<MembersUpdateWithoutMinistriesInput, MembersUncheckedUpdateWithoutMinistriesInput>
    create: XOR<MembersCreateWithoutMinistriesInput, MembersUncheckedCreateWithoutMinistriesInput>
    where?: MembersWhereInput
  }

  export type MembersUpdateToOneWithWhereWithoutMinistriesInput = {
    where?: MembersWhereInput
    data: XOR<MembersUpdateWithoutMinistriesInput, MembersUncheckedUpdateWithoutMinistriesInput>
  }

  export type MembersUpdateWithoutMinistriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    church?: ChurchesUpdateOneRequiredWithoutMembersNestedInput
    ledMinistries?: MinistriesUpdateManyWithoutLeaderNestedInput
  }

  export type MembersUncheckedUpdateWithoutMinistriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ledMinistries?: MinistriesUncheckedUpdateManyWithoutLeaderNestedInput
  }

  export type MinistriesUpsertWithoutMembersInput = {
    update: XOR<MinistriesUpdateWithoutMembersInput, MinistriesUncheckedUpdateWithoutMembersInput>
    create: XOR<MinistriesCreateWithoutMembersInput, MinistriesUncheckedCreateWithoutMembersInput>
    where?: MinistriesWhereInput
  }

  export type MinistriesUpdateToOneWithWhereWithoutMembersInput = {
    where?: MinistriesWhereInput
    data: XOR<MinistriesUpdateWithoutMembersInput, MinistriesUncheckedUpdateWithoutMembersInput>
  }

  export type MinistriesUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    church?: ChurchesUpdateOneRequiredWithoutMinistriesNestedInput
    leader?: MembersUpdateOneWithoutLedMinistriesNestedInput
  }

  export type MinistriesUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    leader_id?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryCreateManyChurchInput = {
    id?: string
    memberId: string
    ministryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MembersCreateManyChurchInput = {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    age?: number | null
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
    birthDate?: Date | string | null
    baptismDate?: Date | string | null
    role?: $Enums.MemberRole
    gender?: $Enums.Gender
    pictureUrl?: string | null
    notes?: string | null
    passwordHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MinistriesCreateManyChurchInput = {
    id?: string
    name: string
    description?: string | null
    leader_id?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberMinistryUpdateWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    member?: MembersUpdateOneRequiredWithoutMinistriesNestedInput
    ministry?: MinistriesUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberMinistryUncheckedUpdateWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    ministryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryUncheckedUpdateManyWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    ministryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MembersUpdateWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ministries?: MemberMinistryUpdateManyWithoutMemberNestedInput
    ledMinistries?: MinistriesUpdateManyWithoutLeaderNestedInput
  }

  export type MembersUncheckedUpdateWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ministries?: MemberMinistryUncheckedUpdateManyWithoutMemberNestedInput
    ledMinistries?: MinistriesUncheckedUpdateManyWithoutLeaderNestedInput
  }

  export type MembersUncheckedUpdateManyWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    street?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    baptismDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender
    pictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MinistriesUpdateWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: MemberMinistryUpdateManyWithoutMinistryNestedInput
    leader?: MembersUpdateOneWithoutLedMinistriesNestedInput
  }

  export type MinistriesUncheckedUpdateWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    leader_id?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: MemberMinistryUncheckedUpdateManyWithoutMinistryNestedInput
  }

  export type MinistriesUncheckedUpdateManyWithoutChurchInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    leader_id?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryCreateManyMemberInput = {
    id?: string
    ministryId: string
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MinistriesCreateManyLeaderInput = {
    id?: string
    name: string
    description?: string | null
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberMinistryUpdateWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    church?: ChurchesUpdateOneRequiredWithoutMemberMinistriesNestedInput
    ministry?: MinistriesUpdateOneRequiredWithoutMembersNestedInput
  }

  export type MemberMinistryUncheckedUpdateWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    ministryId?: StringFieldUpdateOperationsInput | string
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryUncheckedUpdateManyWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    ministryId?: StringFieldUpdateOperationsInput | string
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MinistriesUpdateWithoutLeaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: MemberMinistryUpdateManyWithoutMinistryNestedInput
    church?: ChurchesUpdateOneRequiredWithoutMinistriesNestedInput
  }

  export type MinistriesUncheckedUpdateWithoutLeaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: MemberMinistryUncheckedUpdateManyWithoutMinistryNestedInput
  }

  export type MinistriesUncheckedUpdateManyWithoutLeaderInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryCreateManyMinistryInput = {
    id?: string
    memberId: string
    church_id: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberMinistryUpdateWithoutMinistryInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    church?: ChurchesUpdateOneRequiredWithoutMemberMinistriesNestedInput
    member?: MembersUpdateOneRequiredWithoutMinistriesNestedInput
  }

  export type MemberMinistryUncheckedUpdateWithoutMinistryInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberMinistryUncheckedUpdateManyWithoutMinistryInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    church_id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}