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

export async function getSelectedModel(): Promise<string | null> {
	const db = await getDatabase();
	const row = await db.getFirstAsync<{ selected_model: string | null }>(
		'SELECT selected_model FROM user_preferences WHERE id = 1',
	);
	return row?.selected_model ?? null;
}

export async function saveSelectedModel(modelId: string): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		"UPDATE user_preferences SET selected_model = ?, updated_at = datetime('now') WHERE id = 1",
		[modelId],
	);
}
