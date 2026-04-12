/**
 * Algolia Search Integration
 * Full-text search for blog posts, projects, and services
 *
 * Install with: npm install algoliasearch
 */

interface AlgoliaConfig {
  appId: string;
  apiKey: string;
  searchKey: string;
}

interface SearchResult {
  id: string;
  type: "blog" | "project" | "service";
  title: string;
  description: string;
  url: string;
  image?: string;
  tags?: string[];
  score?: number;
}

interface SearchParams {
  query: string;
  type?: "blog" | "project" | "service" | "all";
  limit?: number;
  offset?: number;
}

/**
 * Get Algolia configuration from environment
 */
export function getAlgoliaConfig(): AlgoliaConfig {
  const appId = process.env.ALGOLIA_APP_ID || "";
  const apiKey = process.env.ALGOLIA_API_KEY || "";
  const searchKey = process.env.ALGOLIA_SEARCH_KEY || "";

  if (!appId || !apiKey || !searchKey) {
    throw new Error(
      "Algolia configuration missing. Set ALGOLIA_APP_ID, ALGOLIA_API_KEY, and ALGOLIA_SEARCH_KEY",
    );
  }

  return { appId, apiKey, searchKey };
}

/**
 * Initialize Algolia client (server-side)
 * Requires: npm install algoliasearch
 */
export function initializeAlgoliaClient() {
  try {
    const algoliasearch = require("algoliasearch");
    const config = getAlgoliaConfig();
    return algoliasearch.default(config.appId, config.apiKey);
  } catch (error) {
    console.warn(
      "Algolia client initialization failed. Install with: npm install algoliasearch",
    );
    console.warn(
      "Search functionality disabled until algoliasearch is installed.",
    );
    return null;
  }
}

/**
 * Index blog post in Algolia
 */
export async function indexBlogPost(blog: any): Promise<void> {
  try {
    const client = initializeAlgoliaClient();
    if (!client) {
      console.warn("Algolia client not initialized. Skipping blog indexing.");
      return;
    }

    const index = client.initIndex("blog");

    const record = {
      objectID: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      tags: blog.tags || [],
      authorId: blog.authorId,
      published: blog.published,
      createdAt: blog.createdAt.getTime(),
      updatedAt: blog.updatedAt.getTime(),
      type: "blog",
      url: `/blog/${blog.slug}`,
    };

    await index.saveObject(record);
    console.log("Blog post indexed:", blog.slug);
  } catch (error) {
    console.error("Failed to index blog post:", error);
  }
}

/**
 * Index project in Algolia
 */
export async function indexProject(project: any): Promise<void> {
  try {
    const client = initializeAlgoliaClient();
    if (!client) return;

    const index = client.initIndex("projects");

    const record = {
      objectID: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      techStack: project.techStack || [],
      price: project.price,
      published: project.published,
      createdAt: project.createdAt.getTime(),
      type: "project",
      url: `/projects/${project.id}`,
      images: project.images || [],
    };

    await index.saveObject(record);
    console.log("Project indexed:", project.title);
  } catch (error) {
    console.error("Failed to index project:", error);
  }
}

/**
 * Index service in Algolia
 */
export async function indexService(service: any): Promise<void> {
  try {
    const client = initializeAlgoliaClient();
    if (!client) return;

    const index = client.initIndex("services");

    const record = {
      objectID: service.id,
      title: service.title,
      description: service.description,
      slug: service.slug,
      features: service.features || [],
      price: service.price,
      published: service.published,
      type: "service",
      url: `/services/${service.slug}`,
    };

    await index.saveObject(record);
    console.log("Service indexed:", service.slug);
  } catch (error) {
    console.error("Failed to index service:", error);
  }
}

/**
 * Remove item from Algolia index
 */
export async function removeFromIndex(
  objectID: string,
  indexName: string,
): Promise<void> {
  try {
    const client = initializeAlgoliaClient();
    if (!client) return;

    const index = client.initIndex(indexName);
    await index.deleteObject(objectID);
    console.log("Object removed from index:", objectID);
  } catch (error) {
    console.error("Failed to remove object from index:", error);
  }
}

/**
 * Search across all indexes
 * Note: Client-side implementation provided separately
 */
export async function searchAll(
  query: string,
  limit: number = 10,
): Promise<SearchResult[]> {
  try {
    const client = initializeAlgoliaClient();
    if (!client) return [];

    // Search multiple indexes
    const results = await Promise.all([
      client.initIndex("blog").search(query, { hitsPerPage: limit }),
      client.initIndex("projects").search(query, { hitsPerPage: limit }),
      client.initIndex("services").search(query, { hitsPerPage: limit }),
    ]);

    // Combine and format results
    const allResults: SearchResult[] = [];

    results[0].hits?.forEach((hit: any) => {
      allResults.push({
        id: hit.objectID,
        type: "blog",
        title: hit.title,
        description: hit.excerpt || hit.content.substring(0, 150),
        url: `/blog/${hit.slug}`,
        tags: hit.tags,
      });
    });

    results[1].hits?.forEach((hit: any) => {
      allResults.push({
        id: hit.objectID,
        type: "project",
        title: hit.title,
        description: hit.description,
        url: `/projects/${hit.id}`,
        image: hit.images?.[0],
      });
    });

    results[2].hits?.forEach((hit: any) => {
      allResults.push({
        id: hit.objectID,
        type: "service",
        title: hit.title,
        description: hit.description,
        url: `/services/${hit.slug}`,
      });
    });

    return allResults.slice(0, limit);
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}

/**
 * Batch index all content
 * Run this after setup to index existing content
 */
export async function reindexAll(): Promise<void> {
  try {
    // This would use Prisma to fetch all blog posts, projects, and services
    // and index them in Algolia
    console.log("Reindexing all content in Algolia...");
    console.log("This requires integration with your database layer");
  } catch (error) {
    console.error("Reindexing failed:", error);
  }
}

/**
 * Clear all indexes
 * Use with caution!
 */
export async function clearAllIndexes(): Promise<void> {
  try {
    const client = initializeAlgoliaClient();
    if (!client) return;

    await Promise.all([
      client.initIndex("blog").clearObjects(),
      client.initIndex("projects").clearObjects(),
      client.initIndex("services").clearObjects(),
    ]);

    console.log("All indexes cleared");
  } catch (error) {
    console.error("Failed to clear indexes:", error);
  }
}
