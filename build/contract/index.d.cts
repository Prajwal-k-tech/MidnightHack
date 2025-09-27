import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  getUserAge(context: __compactRuntime.WitnessContext<Ledger, T>,
             user_id_0: bigint): [T, bigint];
  getUserLocation(context: __compactRuntime.WitnessContext<Ledger, T>,
                  user_id_0: bigint): [T, [bigint, bigint]];
  getUserIncome(context: __compactRuntime.WitnessContext<Ledger, T>,
                user_id_0: bigint): [T, bigint];
}

export type ImpureCircuits<T> = {
  create_verified_profile(context: __compactRuntime.CircuitContext<T>,
                          user_id_0: bigint,
                          profile_commitment_0: Uint8Array): __compactRuntime.CircuitResults<T, boolean>;
  verify_and_disclose_age_range(context: __compactRuntime.CircuitContext<T>,
                                user_id_0: bigint,
                                min_age_0: bigint,
                                max_age_0: bigint): __compactRuntime.CircuitResults<T, []>;
  verify_and_disclose_location_proximity(context: __compactRuntime.CircuitContext<T>,
                                         user_id_0: bigint,
                                         target_lat_0: bigint,
                                         target_lng_0: bigint,
                                         max_distance_0: bigint): __compactRuntime.CircuitResults<T, []>;
  verify_and_disclose_income_bracket(context: __compactRuntime.CircuitContext<T>,
                                     user_id_0: bigint,
                                     min_income_0: bigint,
                                     max_income_0: bigint): __compactRuntime.CircuitResults<T, []>;
  create_verified_match(context: __compactRuntime.CircuitContext<T>,
                        user1_id_0: bigint,
                        user2_id_0: bigint): __compactRuntime.CircuitResults<T, boolean>;
  check_verified_match(context: __compactRuntime.CircuitContext<T>,
                       user1_id_0: bigint,
                       user2_id_0: bigint): __compactRuntime.CircuitResults<T, boolean>;
  get_verification_status(context: __compactRuntime.CircuitContext<T>,
                          user_id_0: bigint): __compactRuntime.CircuitResults<T, [boolean,
                                                                                  boolean,
                                                                                  boolean]>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  create_verified_profile(context: __compactRuntime.CircuitContext<T>,
                          user_id_0: bigint,
                          profile_commitment_0: Uint8Array): __compactRuntime.CircuitResults<T, boolean>;
  verify_and_disclose_age_range(context: __compactRuntime.CircuitContext<T>,
                                user_id_0: bigint,
                                min_age_0: bigint,
                                max_age_0: bigint): __compactRuntime.CircuitResults<T, []>;
  verify_and_disclose_location_proximity(context: __compactRuntime.CircuitContext<T>,
                                         user_id_0: bigint,
                                         target_lat_0: bigint,
                                         target_lng_0: bigint,
                                         max_distance_0: bigint): __compactRuntime.CircuitResults<T, []>;
  verify_and_disclose_income_bracket(context: __compactRuntime.CircuitContext<T>,
                                     user_id_0: bigint,
                                     min_income_0: bigint,
                                     max_income_0: bigint): __compactRuntime.CircuitResults<T, []>;
  create_verified_match(context: __compactRuntime.CircuitContext<T>,
                        user1_id_0: bigint,
                        user2_id_0: bigint): __compactRuntime.CircuitResults<T, boolean>;
  check_verified_match(context: __compactRuntime.CircuitContext<T>,
                       user1_id_0: bigint,
                       user2_id_0: bigint): __compactRuntime.CircuitResults<T, boolean>;
  get_verification_status(context: __compactRuntime.CircuitContext<T>,
                          user_id_0: bigint): __compactRuntime.CircuitResults<T, [boolean,
                                                                                  boolean,
                                                                                  boolean]>;
}

export type Ledger = {
  readonly total_users: bigint;
  readonly nonce: bigint;
  user_statuses: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): number;
    [Symbol.iterator](): Iterator<[bigint, number]>
  };
  age_verifications: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): number;
    [Symbol.iterator](): Iterator<[bigint, number]>
  };
  location_verifications: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): number;
    [Symbol.iterator](): Iterator<[bigint, number]>
  };
  income_verifications: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): number;
    [Symbol.iterator](): Iterator<[bigint, number]>
  };
  verified_matches: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: [bigint, bigint]): boolean;
    lookup(key_0: [bigint, bigint]): boolean;
    [Symbol.iterator](): Iterator<[[bigint, bigint], boolean]>
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
