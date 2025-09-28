import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  getBiometricData(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  getIdentitySalt(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  getUserAge(context: __compactRuntime.WitnessContext<Ledger, T>): [T, bigint];
}

export type ImpureCircuits<T> = {
  complete_user_verification(context: __compactRuntime.CircuitContext<T>,
                             user_id_0: bigint): __compactRuntime.CircuitResults<T, []>;
  check_user_compatibility(context: __compactRuntime.CircuitContext<T>,
                           user1_id_0: bigint,
                           user2_id_0: bigint): __compactRuntime.CircuitResults<T, []>;
  test_dating_platform(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  complete_user_verification(context: __compactRuntime.CircuitContext<T>,
                             user_id_0: bigint): __compactRuntime.CircuitResults<T, []>;
  check_user_compatibility(context: __compactRuntime.CircuitContext<T>,
                           user1_id_0: bigint,
                           user2_id_0: bigint): __compactRuntime.CircuitResults<T, []>;
  test_dating_platform(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
}

export type Ledger = {
  verified_identities: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): boolean;
    [Symbol.iterator](): Iterator<[bigint, boolean]>
  };
  identity_hashes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Uint8Array;
    [Symbol.iterator](): Iterator<[bigint, Uint8Array]>
  };
  age_verifications: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  location_verifications: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): boolean;
    [Symbol.iterator](): Iterator<[bigint, boolean]>
  };
  compatibility_scores: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
