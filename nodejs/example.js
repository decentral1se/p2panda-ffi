import { SigningKey, NodeBuilder, Topic } from "p2panda";

async function main() {
  const signingKey = new SigningKey();
  console.log(signingKey.verifyingKey());

  const builder = new NodeBuilder();
  builder.signingKey(signingKey);

  const node = await builder.spawn();
  console.log("my node id", node.id());

  const topic = new Topic();
  console.log("topic", topic.toString());

  const handler = await node.stream(topic, {
    onEvent: (streamEvent) => {
      console.log(streamEvent);
    },
    onError: (error) => {
      console.error(error);
    },
    onOperation: (operation) => {
      console.log(operation);
    },
  });

  await handler.publish({
    chatMessage: "hello!",
    showProfile: true,
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));
}

main();
