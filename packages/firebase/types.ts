import type {
  DocumentReference,
  CollectionReference,
  Query,
  DocumentData,
} from 'firebase/firestore'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import type { UseQueryOptions, QueryKey, UseQueryResult } from '@tanstack/react-query'
import { User } from 'firebase/auth'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Unsubscribe = () => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFn = (...args: any[]) => any

export type Final<Fn extends AnyFn> = ReturnType<Fn> extends Promise<infer T>
  ? Awaited<T>
  : ReturnType<Fn>

export type QueryAdapter = <
  Return,
  Key extends QueryKey = QueryKey,
  Fn extends AnyFn = AnyFn,
  E = Error,
>({
  queryKey,
  queryFn,
  params,
}: {
  queryKey: Key
  queryFn: Fn
  params?: UseQueryOptions & Record<string, unknown>
}) => UseQueryResult<Return, E>

export type ObserverType = 'doc' | 'query' | 'auth'

export type Value<Fn> = Fn extends (...args: any[]) => infer R
  ? R extends DocumentReference<infer T>
    ? T
    : R extends FirebaseFirestoreTypes.DocumentReference<infer T>
    ? T
    : R extends CollectionReference<infer T>
    ? T
    : R extends FirebaseFirestoreTypes.CollectionReference<infer T>
    ? T
    : R extends Query<infer T>
    ? T
    : R extends FirebaseFirestoreTypes.Query<infer T>
    ? T
    : R
  : never

export type QueryVariation<T extends DocumentData> = CollectionReference<T> | Query<T>
export type NativeQueryVariation<T extends DocumentData> =
  | FirebaseFirestoreTypes.CollectionReference<T>
  | FirebaseFirestoreTypes.Query<T>

export type GetReturnVariation<T extends DocumentData = DocumentData> =
  | CollectionReference<T>
  | Query<T>
  | DocumentReference<T>
  | FirebaseFirestoreTypes.DocumentReference<T>
  | FirebaseFirestoreTypes.Query<T>
  | FirebaseFirestoreTypes.CollectionReference<T>
  | FirebaseFirestoreTypes.DocumentReference<T>
export type GetVariation<T extends DocumentData = DocumentData> = (
  ...args: any[]
) => GetReturnVariation<T>

export type Res<Fn extends GetVariation> = Value<Fn> & { id: string }
export type Return<Fn extends GetVariation, O extends ObserverType> = O extends 'doc'
  ? Res<Fn>
  : O extends 'query'
  ? Res<Fn>[]
  : O extends 'auth'
  ? User | null
  : never
