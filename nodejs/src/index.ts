import { serialize, deserialize } from "node:v8";

import * as ffi from "../p2panda_ffi/index.js";

function toNumber(value: bigint | number): number {
  if (value > BigInt(Number.MAX_VALUE)) {
    throw new Error("can't convert bigint to number as MAX_VALUE reached");
  }

  return Number(value);
}

export class VerifyingKey {
  /** @internal */
  __inner: ffi.VerifyingKey;

  public constructor(hexStr: string) {
    this.__inner = ffi.VerifyingKey.from_hex(hexStr);
  }

  public toString(): string {
    return this.__inner.to_hex();
  }
}

export class SigningKey {
  /** @internal */
  __inner: ffi.SigningKey;

  public constructor(hexStr: undefined | string) {
    if (hexStr) {
      this.__inner = ffi.SigningKey.from_hex(hexStr);
    } else {
      this.__inner = ffi.SigningKey.generate();
    }
  }

  public verifyingKey(): string {
    return this.__inner.verifying_key().to_hex();
  }

  public toString(): string {
    return this.__inner.to_hex();
  }
}

export class Cursor {
  /** @internal */
  __inner: ffi.Cursor;

  /** @internal */
  constructor(inner: ffi.Cursor) {
    this.__inner = inner;
  }

  public name(): string {
    return this.__inner.name();
  }
}

export class NodeBuilder {
  /** @internal */
  __inner: ffi.NodeBuilder;

  constructor() {
    this.__inner = new ffi.NodeBuilder();
  }

  public databaseUrl(url: string) {
    this.__inner.database_url(url);
  }

  public signingKey(signingKey: string | SigningKey) {
    if (typeof signingKey === "string") {
      signingKey = new SigningKey(signingKey);
    }

    this.__inner.signing_key(signingKey.__inner);
  }

  public networkId(networkId: string) {
    const ffiNetworkId = ffi.NetworkId.from_hex(networkId);
    this.__inner.network_id(ffiNetworkId);
  }

  public ackPolicy(policy: "explicit" | "automatic") {
    let ffiAckPolicy;
    if (policy === "explicit") {
      ffiAckPolicy = ffi.AckPolicy.Explicit;
    } else if (policy === "automatic") {
      ffiAckPolicy = ffi.AckPolicy.Automatic;
    } else {
      throw new Error("invalid ack policy argument");
    }

    this.__inner.ack_policy(ffiAckPolicy);
  }

  public relayUrl(relayUrl: string) {
    const ffiRelayUrl = ffi.RelayUrl.from_str(relayUrl);
    this.__inner.relay_url(ffiRelayUrl);
  }

  public bootstrap(nodeId: string | VerifyingKey, relayUrl: string) {
    const ffiRelayUrl = ffi.RelayUrl.from_str(relayUrl);

    if (typeof nodeId === "string") {
      nodeId = new VerifyingKey(nodeId);
    }

    this.__inner.bootstrap(nodeId.__inner, ffiRelayUrl);
  }

  public mdnsMode(mode: boolean | "disabled" | "active" | "passive") {
    let ffiMode;
    if (typeof mode === "boolean" && mode) {
      ffiMode = ffi.MdnsDiscoveryMode.Active;
    } else if (typeof mode === "boolean" && !mode) {
      ffiMode = ffi.MdnsDiscoveryMode.Disabled;
    } else if (mode === "active") {
      ffiMode = ffi.MdnsDiscoveryMode.Active;
    } else if (mode === "passive") {
      ffiMode = ffi.MdnsDiscoveryMode.Passive;
    } else if (mode === "disabled") {
      ffiMode = ffi.MdnsDiscoveryMode.Disabled;
    } else {
      throw new Error("invalid mdns mode argument");
    }

    this.__inner.mdns_mode(ffiMode);
  }

  public bindPortV4(port: number) {
    this.__inner.bind_port_v4(port);
  }

  public bindIpV4(address: string) {
    this.__inner.bind_ip_v4(address);
  }

  public bindPortV6(port: number) {
    this.__inner.bind_port_v6(port);
  }

  public bindIpV6(address: string) {
    this.__inner.bind_ip_v6(address);
  }

  public async spawn(): Promise<Node> {
    const ffiNode = await this.__inner.spawn();
    return new Node(ffiNode);
  }
}

export class Topic {
  /** @internal */
  __inner: ffi.Topic;

  public constructor(hexStr: undefined | string) {
    if (hexStr) {
      this.__inner = ffi.Topic.from_hex(hexStr);
    } else {
      this.__inner = ffi.Topic.random();
    }
  }

  public toString(): string {
    return this.__inner.to_hex();
  }
}

export type Header = {
  verifyingKey: string;
  logId: string;
  seqNum: number;
  backlink: undefined | string;
  payloadSize: number;
  payloadHash: string;
};

export type Operation<T> = {
  id: string;
  topic: string;
  author: string;
  timestamp: number;
  header: Header;
  message: T;
};

export interface TopicStreamCallback<T> {
  onEvent?: (streamEvent: ffi.StreamEvent) => void;
  onError?: (error: string) => void;
  onOperation: (operation: Operation<T>) => void;
}

export type EphemeralMessage<T> = {
  topic: string;
  author: string;
  timestamp: number;
  message: T;
};

export interface EphemeralStreamCallback<T> {
  onError?: (error: string) => void;
  onMessage: (message: EphemeralMessage<T>) => void;
}

export class Node {
  /** @internal */
  __inner: ffi.Node;

  /** @internal */
  constructor(inner: ffi.Node) {
    this.__inner = inner;
  }

  public id(): string {
    return this.__inner.id().to_hex();
  }

  public networkId(): string {
    return this.__inner.network_id().to_hex();
  }

  public async insertBootstrap(
    nodeId: string | VerifyingKey,
    relayUrl: string
  ): Promise<void> {
    const ffiRelayUrl = ffi.RelayUrl.from_str(relayUrl);

    if (typeof nodeId === "string") {
      nodeId = new VerifyingKey(nodeId);
    }

    this.__inner.insert_bootstrap(nodeId.__inner, ffiRelayUrl);
  }

  public async stream<T>(
    topic: string | Topic,
    callback: TopicStreamCallback<T>
  ): Promise<TopicStream<T>> {
    return await this.streamFrom(topic, "frontier", callback);
  }

  public async streamFrom<T>(
    topic: string | Topic,
    from: "start" | "frontier" | Cursor,
    callback: TopicStreamCallback<T>
  ): Promise<TopicStream<T>> {
    if (typeof topic === "string") {
      topic = new Topic(topic);
    }

    let ffiFrom;
    if (from === "start") {
      ffiFrom = ffi.StreamFrom.Start();
    } else if (from === "frontier") {
      ffiFrom = ffi.StreamFrom.Frontier();
    } else if (from instanceof Cursor) {
      ffiFrom = ffi.StreamFrom.Cursor(from.__inner);
    } else {
      throw new Error("invalid from argument");
    }

    const ffiHandler = await this.__inner.stream_from(topic.__inner, ffiFrom, {
      on_event: (streamEvent) => {
        if (callback.onEvent) {
          callback.onEvent(streamEvent);
        }
      },
      on_error: (error) => {
        if (callback.onError) {
          callback.onError(error.toString());
        }
      },
      on_operation: (operation, _source) => {
        let message;
        try {
          message = deserialize(operation.message());
        } catch (_error) {
          if (callback.onError) {
            callback.onError("failed deserializing message");
          }

          return;
        }

        const id = operation.id().to_hex();
        const topic = operation.topic().to_hex();
        const author = operation.author().to_hex();
        const timestamp = toNumber((operation.timestamp() as bigint) / 1000000n);

        const ffiHeader = operation.processed().header();
        const ffiBacklink = ffiHeader.backlink();
        let backlink;
        if (ffiBacklink) {
          backlink = ffiBacklink.to_hex();
        }
        const header = {
          verifyingKey: ffiHeader.verifying_key().to_hex(),
          seqNum: toNumber(ffiHeader.seq_num()),
          logId: ffiHeader.log_id().to_hex(),
          backlink,
          payloadSize: toNumber(ffiHeader.payload_size()),
          payloadHash: ffiHeader.payload_hash().to_hex(),
        };

        callback.onOperation({
          id,
          topic,
          author,
          timestamp,
          header,
          message,
        });
      },
    });

    return new TopicStream<T>(ffiHandler);
  }

  public async ephemeralStream<T>(
    topic: string | Topic,
    callback: EphemeralStreamCallback<T>
  ): Promise<EphemeralStream<T>> {
    if (typeof topic === "string") {
      topic = new Topic(topic);
    }

    const ffiHandler = await this.__inner.ephemeral_stream(topic.__inner, {
      on_message: (ffiMessage: ffi.EphemeralMessage) => {
        let message;
        try {
          message = deserialize(ffiMessage.body());
        } catch (_error) {
          if (callback.onError) {
            callback.onError("failed deserializing");
          }

          return;
        }

        const topic = ffiMessage.topic().to_hex();
        const author = ffiMessage.author().to_hex();

        const timestamp = parseInt(
          ((ffiMessage.timestamp() as bigint) / 1000n).toString()
        );

        callback.onMessage({
          topic,
          author,
          timestamp,
          message,
        });
      },
    });

    return new EphemeralStream<T>(ffiHandler);
  }
}

export class TopicStream<T> {
  /** @internal */
  __inner: ffi.TopicStream;

  /** @internal */
  constructor(inner: ffi.TopicStream) {
    this.__inner = inner;
  }

  public topic(): string {
    return this.__inner.topic().to_hex();
  }

  public async publish(value: T): Promise<string> {
    const bytes = serialize(value);
    const hash = await this.__inner.publish(bytes);
    return hash.to_hex();
  }

  public async prune(value: undefined | T): Promise<string> {
    const bytes = value ? serialize(value) : undefined;
    const hash = await this.__inner.prune(bytes);
    return hash.to_hex();
  }

  public async ack(messageId: string): Promise<void> {
    const ffiHash = ffi.Hash.from_hex(messageId);
    await this.__inner.ack(ffiHash);
  }
}

export class EphemeralStream<T> {
  /** @internal */
  __inner: ffi.EphemeralStream;

  /** @internal */
  constructor(inner: ffi.EphemeralStream) {
    this.__inner = inner;
  }

  public topic(): string {
    return this.__inner.topic().to_hex();
  }

  public async publish(value: T): Promise<void> {
    const bytes = serialize(value);
    await this.__inner.publish(bytes);
  }
}
