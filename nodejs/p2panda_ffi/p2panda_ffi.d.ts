import { UniffiObjectBase } from "./runtime/objects.js";



export interface ComponentMetadata {
  namespace: string;
  packageName: string;
  cdylibName: string;
  nodeEngine: string;
  bundledPrebuilds: boolean;
  manualLoad: boolean;
}

export declare const componentMetadata: Readonly<ComponentMetadata>;

export { ffiMetadata } from "./p2panda_ffi-ffi.js";


export declare const AckPolicy: Readonly<{
  "Explicit": "Explicit";
  "Automatic": "Automatic";
}>;
export type AckPolicy = (typeof AckPolicy)[keyof typeof AckPolicy];

export declare const MdnsDiscoveryMode: Readonly<{
  "Disabled": "Disabled";
  "Passive": "Passive";
  "Active": "Active";
}>;
export type MdnsDiscoveryMode = (typeof MdnsDiscoveryMode)[keyof typeof MdnsDiscoveryMode];

export declare const SessionPhase: Readonly<{
  "Sync": "Sync";
  "Live": "Live";
}>;
export type SessionPhase = (typeof SessionPhase)[keyof typeof SessionPhase];

export interface StreamFromStart {
  tag: "Start";
}

export interface StreamFromFrontier {
  tag: "Frontier";
}

export interface StreamFromCursor {
  tag: "Cursor";
  "": Cursor;
}

export type StreamFrom = StreamFromStart | StreamFromFrontier | StreamFromCursor;
export declare const StreamFrom: Readonly<{
  Start(): StreamFromStart;
  Frontier(): StreamFromFrontier;
  Cursor(_: Cursor): StreamFromCursor;
}>;

export interface SourceSyncSession {
  tag: "SyncSession";
  /**
   * Id of the remote sending node.
   */
  "remote_node_id": VerifyingKey;
  /**
   * Id of the sync session.
   */
  "session_id": bigint | number;
  /**
   * Operation sent during this session.
   */
  "sent_operations": bigint | number;
  /**
   * Operations received during this session.
   */
  "received_operations": bigint | number;
  /**
   * Bytes sent during this session.
   */
  "sent_bytes": bigint | number;
  /**
   * Bytes received during this session.
   */
  "received_bytes": bigint | number;
  /**
   * Total bytes sent for this topic across all sessions.
   */
  "sent_bytes_topic_total": bigint | number;
  /**
   * Total bytes received for this topic across all sessions.
   */
  "received_bytes_topic_total": bigint | number;
  /**
   * The session phase during which an operation arrived.
   */
  "phase": SessionPhase;
}

export interface SourceLocalStore {
  tag: "LocalStore";
}

export interface SourceExternalStream {
  tag: "ExternalStream";
  "session_id": bigint | number;
}

export type Source = SourceSyncSession | SourceLocalStore | SourceExternalStream;
export declare const Source: Readonly<{
  SyncSession(remote_node_id: VerifyingKey, session_id: bigint | number, sent_operations: bigint | number, received_operations: bigint | number, sent_bytes: bigint | number, received_bytes: bigint | number, sent_bytes_topic_total: bigint | number, received_bytes_topic_total: bigint | number, phase: SessionPhase): SourceSyncSession;
  LocalStore(): SourceLocalStore;
  ExternalStream(session_id: bigint | number): SourceExternalStream;
}>;

export interface StreamEventSyncStarted {
  tag: "SyncStarted";
  /**
   * Id of the remote sending node.
   */
  "remote_node_id": VerifyingKey;
  /**
   * Id of the sync session.
   */
  "session_id": bigint | number;
  /**
   * Total operations which will be received during this session.
   */
  "incoming_operations": bigint | number;
  /**
   * Total operations which will be sent during this session.
   */
  "outgoing_operations": bigint | number;
  /**
   * Total bytes which will be received during this session.
   */
  "incoming_bytes": bigint | number;
  /**
   * Total bytes which will be sent during this session.
   */
  "outgoing_bytes": bigint | number;
  /**
   * Total sessions currently running over the same topic.
   */
  "topic_sessions": bigint | number;
}

export interface StreamEventSyncEnded {
  tag: "SyncEnded";
  /**
   * Id of the remote sending node.
   */
  "remote_node_id": VerifyingKey;
  /**
   * Id of the sync session.
   */
  "session_id": bigint | number;
  /**
   * Operation sent during this session.
   */
  "sent_operations": bigint | number;
  /**
   * Operations received during this session.
   */
  "received_operations": bigint | number;
  /**
   * Bytes sent during this session.
   */
  "sent_bytes": bigint | number;
  /**
   * Bytes received during this session.
   */
  "received_bytes": bigint | number;
  /**
   * Total bytes sent for this topic across all sessions.
   */
  "sent_bytes_topic_total": bigint | number;
  /**
   * Total bytes received for this topic across all sessions.
   */
  "received_bytes_topic_total": bigint | number;
  /**
   * If the sync session ended with an error the reason is included here.
   */
  "error": SyncError | undefined;
}

export interface StreamEventImportStarted {
  tag: "ImportStarted";
  "session_id": bigint | number;
}

export interface StreamEventImportEnded {
  tag: "ImportEnded";
  "session_id": bigint | number;
}

export type StreamEvent = StreamEventSyncStarted | StreamEventSyncEnded | StreamEventImportStarted | StreamEventImportEnded;
export declare const StreamEvent: Readonly<{
  SyncStarted(remote_node_id: VerifyingKey, session_id: bigint | number, incoming_operations: bigint | number, outgoing_operations: bigint | number, incoming_bytes: bigint | number, outgoing_bytes: bigint | number, topic_sessions: bigint | number): StreamEventSyncStarted;
  SyncEnded(remote_node_id: VerifyingKey, session_id: bigint | number, sent_operations: bigint | number, received_operations: bigint | number, sent_bytes: bigint | number, received_bytes: bigint | number, sent_bytes_topic_total: bigint | number, received_bytes_topic_total: bigint | number, error: SyncError | undefined): StreamEventSyncEnded;
  ImportStarted(session_id: bigint | number): StreamEventImportStarted;
  ImportEnded(session_id: bigint | number): StreamEventImportEnded;
}>;

export declare class IpAddrError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class IpAddrErrorParseInvalidAddr extends IpAddrError {
  readonly tag: "ParseInvalidAddr";
  constructor(message?: string);
}

export declare class NodeBuilderError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class NodeBuilderErrorAlreadyConsumed extends NodeBuilderError {
  readonly tag: "AlreadyConsumed";
  constructor(message?: string);
}

export declare class NodeBuilderErrorMutexPoisoned extends NodeBuilderError {
  readonly tag: "MutexPoisoned";
  constructor(message?: string);
}

export declare class NodeBuilderErrorIpAddr extends NodeBuilderError {
  readonly tag: "IpAddr";
  constructor(message?: string);
}

export declare class ConversionError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

/**
 * Invalid number of bytes.
 */
export declare class ConversionErrorInvalidLength extends ConversionError {
  readonly tag: "InvalidLength";
  constructor(message?: string);
}

/**
 * String contains invalid hexadecimal characters.
 */
export declare class ConversionErrorInvalidHexEncoding extends ConversionError {
  readonly tag: "InvalidHexEncoding";
  constructor(message?: string);
}

export declare class RelayUrlParseError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class RelayUrlParseErrorInvalid extends RelayUrlParseError {
  readonly tag: "Invalid";
  constructor(message?: string);
}

export declare class EphemeralPublishError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class EphemeralPublishErrorEphemeralPublish extends EphemeralPublishError {
  readonly tag: "EphemeralPublish";
  constructor(message?: string);
}

export declare class CreateStreamError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class CreateStreamErrorCreateStream extends CreateStreamError {
  readonly tag: "CreateStream";
  constructor(message?: string);
}

export declare class NetworkError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class NetworkErrorNetwork extends NetworkError {
  readonly tag: "Network";
  constructor(message?: string);
}

export declare class SpawnError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class SpawnErrorSpawn extends SpawnError {
  readonly tag: "Spawn";
  constructor(message?: string);
}

export declare class SpawnErrorNodeBuilder extends SpawnError {
  readonly tag: "NodeBuilder";
  constructor(message?: string);
}

export declare class SpawnErrorRpc extends SpawnError {
  readonly tag: "Rpc";
  constructor(message?: string);
}

export declare class AckedError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class AckedErrorAckedError extends AckedError {
  readonly tag: "AckedError";
  constructor(message?: string);
}

export declare class PublishError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class PublishErrorPublishError extends PublishError {
  readonly tag: "PublishError";
  constructor(message?: string);
}

export declare class StreamError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class StreamErrorProcessingFailed extends StreamError {
  readonly tag: "ProcessingFailed";
  constructor(message?: string);
}

export declare class StreamErrorDecodeFailed extends StreamError {
  readonly tag: "DecodeFailed";
  constructor(message?: string);
}

export declare class StreamErrorReplayFailed extends StreamError {
  readonly tag: "ReplayFailed";
  constructor(message?: string);
}

export declare class StreamErrorAckFailed extends StreamError {
  readonly tag: "AckFailed";
  constructor(message?: string);
}

export declare class SyncError extends globalThis.Error {
  readonly tag: string;
  protected constructor(tag: string, message?: string);
}

export declare class SyncErrorSyncError extends SyncError {
  readonly tag: "SyncError";
  constructor(message?: string);
}

export interface EphemeralStreamCallback {
  on_message(message: EphemeralMessage): void;
}

export interface TopicStreamCallback {
  on_event(event: StreamEvent): void;
  on_error(error: StreamError): void;
  on_operation(processed: ProcessedOperation, source: Source): void;
}

export declare class NodeBuilder extends UniffiObjectBase {
  constructor();
  ack_policy(ack_policy: AckPolicy): void;
  bind_ip_v4(ip_address: string): void;
  bind_ip_v6(ip_address: string): void;
  bind_port_v4(port: number): void;
  bind_port_v6(port: number): void;
  bootstrap(node_id: VerifyingKey, relay_url: RelayUrl): void;
  database_url(url: string): void;
  mdns_mode(mode: MdnsDiscoveryMode): void;
  network_id(network_id: NetworkId): void;
  relay_url(url: RelayUrl): void;
  signing_key(signing_key: SigningKey): void;
  spawn(): Promise<Node>;
}

export declare class Cursor extends UniffiObjectBase {
  protected constructor();
  name(): string;
}

export declare class Hash extends UniffiObjectBase {
  protected constructor();
  static digest(value: Uint8Array): Hash;
  static from_bytes(value: Uint8Array): Hash;
  static from_hex(value: string): Hash;
  to_bytes(): Uint8Array;
  to_hex(): string;
}

export declare class Header extends UniffiObjectBase {
  protected constructor();
  backlink(): Hash | undefined;
  hash(): Hash;
  log_id(): Hash;
  payload_hash(): Hash;
  payload_size(): bigint | number;
  prune_flag(): boolean;
  seq_num(): bigint | number;
  signature(): Signature;
  timestamp(): bigint | number;
  verifying_key(): VerifyingKey;
  version(): bigint | number;
}

export declare class NetworkId extends UniffiObjectBase {
  protected constructor();
  static from_bytes(value: Uint8Array): NetworkId;
  static from_hash(hash: Hash): NetworkId;
  static from_hex(value: string): NetworkId;
  static random(): NetworkId;
  to_bytes(): Uint8Array;
  to_hex(): string;
}

export declare class RelayUrl extends UniffiObjectBase {
  protected constructor();
  static from_str(value: string): RelayUrl;
  to_str(): string;
}

export declare class Signature extends UniffiObjectBase {
  protected constructor();
  static from_bytes(value: Uint8Array): Signature;
  static from_hex(value: string): Signature;
  to_bytes(): Uint8Array;
  to_hex(): string;
}

export declare class SigningKey extends UniffiObjectBase {
  protected constructor();
  static from_bytes(value: Uint8Array): SigningKey;
  static from_hex(value: string): SigningKey;
  static generate(): SigningKey;
  sign(bytes: Uint8Array): Signature;
  to_bytes(): Uint8Array;
  to_hex(): string;
  verifying_key(): VerifyingKey;
}

export declare class Topic extends UniffiObjectBase {
  protected constructor();
  static from_bytes(value: Uint8Array): Topic;
  static from_hash(hash: Hash): Topic;
  static from_hex(value: string): Topic;
  static random(): Topic;
  to_bytes(): Uint8Array;
  to_hex(): string;
}

export declare class VerifyingKey extends UniffiObjectBase {
  protected constructor();
  static from_bytes(value: Uint8Array): VerifyingKey;
  static from_hex(value: string): VerifyingKey;
  to_bytes(): Uint8Array;
  to_hex(): string;
  verify(bytes: Uint8Array, signature: Signature): boolean;
}

export declare class EphemeralMessage extends UniffiObjectBase {
  protected constructor();
  author(): VerifyingKey;
  body(): Uint8Array;
  timestamp(): bigint | number;
  topic(): Topic;
}

export declare class EphemeralStream extends UniffiObjectBase {
  protected constructor();
  publish(message: Uint8Array): Promise<void>;
  topic(): Topic;
}

export declare class Node extends UniffiObjectBase {
  protected constructor();
  static spawn(): Promise<Node>;
  ephemeral_stream(topic: Topic, on_message: EphemeralStreamCallback): Promise<EphemeralStream>;
  id(): VerifyingKey;
  insert_bootstrap(node_id: VerifyingKey, relay_url: RelayUrl): Promise<void>;
  network_id(): NetworkId;
  stream(topic: Topic, callback: TopicStreamCallback): Promise<TopicStream>;
  stream_from(topic: Topic, from: StreamFrom, callback: TopicStreamCallback): Promise<TopicStream>;
}

export declare class Event extends UniffiObjectBase {
  protected constructor();
  body(): Uint8Array | undefined;
  header(): Header;
  is_completed(): boolean;
  is_failed(): boolean;
}

export declare class ProcessedOperation extends UniffiObjectBase {
  protected constructor();
  ack(): Promise<void>;
  author(): VerifyingKey;
  id(): Hash;
  message(): Uint8Array;
  processed(): Event;
  timestamp(): bigint | number;
  topic(): Topic;
}

export declare class TopicStream extends UniffiObjectBase {
  protected constructor();
  ack(message_id: Hash): Promise<void>;
  prune(message: Uint8Array | undefined): Promise<Hash>;
  publish(message: Uint8Array): Promise<Hash>;
  topic(): Topic;
}