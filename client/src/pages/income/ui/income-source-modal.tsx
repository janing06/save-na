import { useEffect, useState } from 'react';
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { IncomeSource, PaySchedule } from '@shared/lib';

type Props = {
	visible: boolean;
	editingSource: IncomeSource | null;
	onSubmit: (input: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
	}) => void;
	onDelete?: (id: number) => void;
	onClose: () => void;
	isPending: boolean;
};

const scheduleOptions: { value: PaySchedule; label: string }[] = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'bi-monthly', label: 'Twice a month' },
	{ value: 'bi-weekly', label: 'Every 2 weeks' },
	{ value: 'weekly', label: 'Every week' },
];

const dayOfWeekOptions = [
	{ value: 0, label: 'Sun' },
	{ value: 1, label: 'Mon' },
	{ value: 2, label: 'Tue' },
	{ value: 3, label: 'Wed' },
	{ value: 4, label: 'Thu' },
	{ value: 5, label: 'Fri' },
	{ value: 6, label: 'Sat' },
];

export function IncomeSourceModal({
	visible,
	editingSource,
	onSubmit,
	onDelete,
	onClose,
	isPending,
}: Props) {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [paySchedule, setPaySchedule] = useState<PaySchedule>('bi-monthly');
	const [firstPayDay, setFirstPayDay] = useState('15');
	const [secondPayDay, setSecondPayDay] = useState('30');
	const [dayOfWeek, setDayOfWeek] = useState(5);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: visible is a prop that triggers form reset when the modal opens
	useEffect(() => {
		if (editingSource) {
			setName(editingSource.name);
			setAmount(String(editingSource.amount));
			setPaySchedule(editingSource.pay_schedule);
			let dates: number[] = [];
			try {
				dates = JSON.parse(editingSource.pay_dates);
			} catch {
				dates = [];
			}
			if (editingSource.pay_schedule === 'monthly') {
				setFirstPayDay(String(dates[0]));
			} else if (editingSource.pay_schedule === 'bi-monthly') {
				setFirstPayDay(String(dates[0]));
				setSecondPayDay(String(dates[1] ?? 30));
			} else {
				setDayOfWeek(dates[0] ?? 5);
			}
		} else {
			setName('');
			setAmount('');
			setPaySchedule('bi-monthly');
			setFirstPayDay('15');
			setSecondPayDay('30');
			setDayOfWeek(5);
		}
	}, [editingSource, visible]);

	const getPayDates = (): number[] => {
		switch (paySchedule) {
			case 'monthly':
				return [Number(firstPayDay)];
			case 'bi-monthly':
				return [Number(firstPayDay), Number(secondPayDay)];
			case 'weekly':
			case 'bi-weekly':
				return [dayOfWeek];
		}
	};

	const isValid = name.trim() !== '' && Number(amount) > 0;

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<ScrollView className="flex-1 bg-white pt-6 px-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">
						{editingSource ? 'Edit Income' : 'Add Income'}
					</Text>
					<Pressable onPress={onClose}>
						<Ionicons name="close" size={22} color="#94a3b8" />
					</Pressable>
				</View>

				<Text className="text-sm font-medium text-slate-700 mb-1">Name</Text>
				<TextInput
					className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'name' ? 'border-teal-600' : 'border-slate-200'}`}
					placeholder="e.g., Main Job"
					placeholderTextColor="#94a3b8"
					value={name}
					onChangeText={setName}
					onFocus={() => setFocusedField('name')}
					onBlur={() => setFocusedField(null)}
				/>

				<Text className="text-sm font-medium text-slate-700 mb-1">
					Net Salary
				</Text>
				<TextInput
					className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'amount' ? 'border-teal-600' : 'border-slate-200'}`}
					placeholder="e.g., 53392"
					placeholderTextColor="#94a3b8"
					value={amount}
					onChangeText={setAmount}
					keyboardType="numeric"
					onFocus={() => setFocusedField('amount')}
					onBlur={() => setFocusedField(null)}
				/>

				<Text className="text-sm font-medium text-slate-700 mb-2">
					Pay Schedule
				</Text>
				<View className="flex-row flex-wrap gap-2 mb-4">
					{scheduleOptions.map((opt) => (
						<Pressable
							key={opt.value}
							className={`px-4 py-2 rounded-full ${
								paySchedule === opt.value ? 'bg-teal-600' : 'bg-slate-100'
							}`}
							onPress={() => setPaySchedule(opt.value)}
						>
							<Text
								className={`text-sm ${
									paySchedule === opt.value
										? 'text-white font-semibold'
										: 'text-slate-600'
								}`}
							>
								{opt.label}
							</Text>
						</Pressable>
					))}
				</View>

				{(paySchedule === 'monthly' || paySchedule === 'bi-monthly') && (
					<View className="mb-4">
						<Text className="text-sm font-medium text-slate-700 mb-1">
							{paySchedule === 'monthly' ? 'Pay day' : 'First pay day'}
						</Text>
						<TextInput
							className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-2 border ${focusedField === 'firstPayDay' ? 'border-teal-600' : 'border-slate-200'}`}
							placeholderTextColor="#94a3b8"
							value={firstPayDay}
							onChangeText={setFirstPayDay}
							keyboardType="numeric"
							onFocus={() => setFocusedField('firstPayDay')}
							onBlur={() => setFocusedField(null)}
						/>
						{paySchedule === 'bi-monthly' && (
							<>
								<Text className="text-sm font-medium text-slate-700 mb-1">
									Second pay day
								</Text>
								<TextInput
									className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 border ${focusedField === 'secondPayDay' ? 'border-teal-600' : 'border-slate-200'}`}
									placeholderTextColor="#94a3b8"
									value={secondPayDay}
									onChangeText={setSecondPayDay}
									keyboardType="numeric"
									onFocus={() => setFocusedField('secondPayDay')}
									onBlur={() => setFocusedField(null)}
								/>
							</>
						)}
					</View>
				)}

				{(paySchedule === 'weekly' || paySchedule === 'bi-weekly') && (
					<View className="mb-4">
						<Text className="text-sm font-medium text-slate-700 mb-2">
							Pay day
						</Text>
						<View className="flex-row flex-wrap gap-2">
							{dayOfWeekOptions.map((opt) => (
								<Pressable
									key={opt.value}
									className={`px-4 py-2 rounded-full ${
										dayOfWeek === opt.value ? 'bg-teal-600' : 'bg-slate-100'
									}`}
									onPress={() => setDayOfWeek(opt.value)}
								>
									<Text
										className={`text-sm ${
											dayOfWeek === opt.value
												? 'text-white font-semibold'
												: 'text-slate-600'
										}`}
									>
										{opt.label}
									</Text>
								</Pressable>
							))}
						</View>
					</View>
				)}

				<Pressable
					className={`rounded-xl px-8 py-4 items-center mb-3 ${
						isValid && !isPending ? 'bg-teal-600' : 'bg-slate-200'
					}`}
					onPress={() =>
						isValid &&
						onSubmit({
							name: name.trim(),
							amount: Number(amount),
							paySchedule,
							payDates: getPayDates(),
						})
					}
					disabled={!isValid || isPending}
				>
					<Text className={`text-base font-bold ${isValid && !isPending ? 'text-white' : 'text-slate-400'}`}>
						{isPending
							? 'Saving...'
							: editingSource
								? 'Save Changes'
								: 'Add Income'}
					</Text>
				</Pressable>
				{editingSource && onDelete && (
					<Pressable
						className="items-center py-3 mb-12"
						onPress={() => onDelete(editingSource.id)}
					>
						<Text className="text-red-500 text-sm font-semibold">
							Delete Income Source
						</Text>
					</Pressable>
				)}
			</ScrollView>
		</Modal>
	);
}
