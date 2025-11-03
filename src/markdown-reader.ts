import { readdirSync } from "fs";
import { join } from "path";

export interface Topic {
  id: string;
  name: string;
  filename: string;
  path: string;
}

export interface TopicContent {
  topic: Topic;
  content: string;
}

/**
 * Get all available markdown topics from the markdown directory
 */
export async function getTopics(): Promise<Topic[]> {
  const markdownDir = join(process.cwd(), "markdown");
  const files = readdirSync(markdownDir);

  const topics: Topic[] = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const id = file.replace(".md", "");
      const name = id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        id,
        name,
        filename: file,
        path: join(markdownDir, file),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return topics;
}

/**
 * Read content from specific markdown files
 */
export async function readTopicContent(
  topicIds: string[]
): Promise<TopicContent[]> {
  const topics = await getTopics();
  const selectedTopics = topics.filter((t) => topicIds.includes(t.id));

  const contents = await Promise.all(
    selectedTopics.map(async (topic) => {
      const file = Bun.file(topic.path);
      const content = await file.text();

      return {
        topic,
        content,
      };
    })
  );

  return contents;
}

/**
 * Get a random sample of topics
 */
export async function getRandomTopics(count: number): Promise<string[]> {
  const topics = await getTopics();
  const shuffled = topics.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((t) => t.id);
}
