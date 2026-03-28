import { Ionicons } from '@expo/vector-icons';
import type { Category } from '@shared/lib';
import { Pressable, Text, View } from 'react-native';

type CurrencyInfo = { symbol: string; code: string } | undefined;

type Props = {
	categories: Category[];
	currencyInfo: CurrencyInfo;
	onEdit: (category: Category) => void;
	onAdd: () => void;
	onCurrencyPress: () => void;
};

export const CategoryList = ({
	categories,
	currencyInfo,
	onEdit,
	onAdd,
	onCurrencyPress,
}: Props) => {
	return (
		<View>
			{/* Currency row */}
			<Pressable
				className="bg-white rounded-2xl shadow-sm mx-4 mb-4 px-4 py-3 flex-row justify-between items-center"
				onPress={onCurrencyPress}
			>
				<Text className="text-sm text-slate-900">Currency</Text>
				<View className="flex-row items-center gap-1">
					<Text className="text-sm font-semibold text-teal-600">
						{currencyInfo ? currencyInfo.code : '—'}
					</Text>
					<Ionicons name="chevron-forward" size={14} color="#94a3b8" />
				</View>
			</Pressable>

			{/* Categories section label */}
			<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-4 mb-1.5">
				Categories
			</Text>

			{/* Categories grouped card */}
			{categories.length > 0 && (
				<View className="bg-white rounded-2xl shadow-sm mx-4 mb-3 overflow-hidden">
					{categories.map((cat, index) => {
						const isDefault = cat.is_default === 1;
						return (
							<Pressable
								key={cat.id}
								className={`flex-row justify-between items-center px-4 py-3 ${
									index < categories.length - 1
										? 'border-b border-slate-100'
										: ''
								}`}
								onPress={isDefault ? undefined : () => onEdit(cat)}
								disabled={isDefault}
							>
								<Text
									className={`text-sm ${isDefault ? 'text-slate-400' : 'text-slate-900'}`}
								>
									{cat.name}
								</Text>
								{!isDefault && (
									<Ionicons name="chevron-forward" size={14} color="#94a3b8" />
								)}
							</Pressable>
						);
					})}
				</View>
			)}

			{/* Add Category card */}
			<Pressable
				className="bg-white rounded-2xl shadow-sm mx-4 mb-3 px-4 py-3 flex-row items-center gap-3"
				onPress={onAdd}
			>
				<View className="bg-teal-50 w-6 h-6 rounded-full items-center justify-center">
					<Ionicons name="add" size={16} color="#0d9488" />
				</View>
				<Text className="text-sm font-semibold text-teal-600">
					Add Category
				</Text>
			</Pressable>
		</View>
	);
};
