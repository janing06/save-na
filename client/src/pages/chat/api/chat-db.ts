import { getDatabase } from '@shared/db';
import type { ChatMessage } from '@shared/lib';

export async function listChatMessages(limit = 50): Promise<ChatMessage[]> {
	const db = await getDatabase();
	return db.getAllAsync<ChatMessage>(
		'SELECT * FROM chat_message ORDER BY created_at DESC LIMIT ?',
		[limit],
	);
}

export async function saveChatMessage(
	role: 'user' | 'assistant',
	content: string,
): Promise<void> {
	const db = await getDatabase();
	await db.runAsync('INSERT INTO chat_message (role, content) VALUES (?, ?)', [
		role,
		content,
	]);
}

export async function clearChatMessages(): Promise<void> {
	const db = await getDatabase();
	await db.runAsync('DELETE FROM chat_message');
}

export async function getApiKey(): Promise<string | null> {
	const db = await getDatabase();
	const row = await db.getFirstAsync<{ openrouter_api_key: string | null }>(
		'SELECT openrouter_api_key FROM user_preferences WHERE id = 1',
	);
	return row?.openrouter_api_key ?? null;
}

export async function saveApiKey(key: string): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		`INSERT INTO user_preferences (id, openrouter_api_key) VALUES (1, ?)
		 ON CONFLICT(id) DO UPDATE SET openrouter_api_key = excluded.openrouter_api_key, updated_at = datetime('now')`,
		[key],
	);
}
