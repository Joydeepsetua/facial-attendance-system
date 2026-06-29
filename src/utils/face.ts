import { getAllUsers, User } from '../sqlite/service/user';

export const DUPLICATE_FACE_THRESHOLD = 0.75;

export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
};

export interface FaceMatch {
  uuid: string;
  name: string;
  employeeId?: string | null;
  similarity: number;
}

export const findBestMatch = (
  embedding: number[],
  users: User[],
  threshold: number = DUPLICATE_FACE_THRESHOLD,
  excludeUuid?: string,
): FaceMatch | null => {
  let best: FaceMatch | null = null;

  for (const user of users) {
    if (excludeUuid && user.uuid === excludeUuid) continue;
    try {
      const userEmbedding = JSON.parse(user.embedding) as number[];
      const sim = cosineSimilarity(embedding, userEmbedding);
      if (sim >= threshold && (!best || sim > best.similarity)) {
        best = { uuid: user.uuid, name: user.name, employeeId: user.employee_id ?? null, similarity: sim };
      }
    } catch (error) {
      console.error('Error parsing user embedding:', error);
    }
  }

  return best;
};

export const findMatchingUsers = (
  embedding: number[],
  users: User[],
  threshold: number = DUPLICATE_FACE_THRESHOLD,
  excludeUuid?: string,
): FaceMatch[] => {
  const matches: FaceMatch[] = [];

  for (const user of users) {
    if (excludeUuid && user.uuid === excludeUuid) continue;
    try {
      const userEmbedding = JSON.parse(user.embedding) as number[];
      const sim = cosineSimilarity(embedding, userEmbedding);
      if (sim >= threshold) {
        matches.push({ uuid: user.uuid, name: user.name, employeeId: user.employee_id ?? null, similarity: sim });
      }
    } catch (error) {
      console.error('Error parsing user embedding:', error);
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity);
};

export const findDuplicateUsers = async (
  embedding: number[],
  excludeUuid?: string,
): Promise<FaceMatch[]> => {
  const users = await getAllUsers();
  return findMatchingUsers(embedding, users, DUPLICATE_FACE_THRESHOLD, excludeUuid);
};

export const findDuplicateUser = async (
  embedding: number[],
  excludeUuid?: string,
): Promise<FaceMatch | null> => {
  const users = await getAllUsers();
  return findBestMatch(embedding, users, DUPLICATE_FACE_THRESHOLD, excludeUuid);
};
