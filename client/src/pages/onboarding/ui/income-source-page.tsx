import type { PaySchedule } from '@shared/lib';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

type Props = {
	onFinish: (income: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
		payAmounts?: number[];
	}) => void;
	isPending: boolean;
};

const scheduleOptions: { value: PaySchedule; label: string }[] = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'bi-monthly', label: 'Twice a month' },
	{ value: 'bi-weekly', label: 'Every 2 weeks' },
	{ value: 'weekly', label: 'Every week' },
];

const dayOfWeekOptions = [
	{ value: 0, label: 'Sunday' },
	{ value: 1, label: 'Monday' },
	{ value: 2, label: 'Tuesday' },
	{ value: 3, label: 'Wednesday' },
	{ value: 4, label: 'Thursday' },
	{ value: 5, label: 'Friday' },
	{ value: 6, label: 'Saturday' },
];

const clampDay = (val: string, setter: (v: string) => void) => {
	if (val === '') {
		setter('');
		return;
	}
	const n = Number(val);
	if (!Number.isInteger(n) || Number.isNaN(n)) return;
	setter(String(Math.min(31, Math.max(1, n))));
};

export const IncomeSourcePage = ({ onFinish, isPending }: Props) => {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [paySchedule, setPaySchedule] = useState<PaySchedule>('bi-monthly');
	const [firstPayDay, setFirstPayDay] = useState('15');
	const [secondPayDay, setSecondPayDay] = useState('30');
	const [firstPayAmount, setFirstPayAmount] = useState('');
	const [secondPayAmount, setSecondPayAmount] = useState('');
	const [dayOfWeek, setDayOfWeek] = useState(5); // Friday
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const isBiMonthly = paySchedule === 'bi-monthly';
	const firstAmt = Number(firstPayAmount);
	const secondAmt = Number(secondPayAmount);
	const biMonthlyTotal = firstAmt + secondAmt;

	const isValid = isBiMonthly
		? name.trim() !== '' && firstAmt > 0 && secondAmt > 0
		: name.trim() !== '' && Number(amount) > 0;

	const canSubmit = isValid && !isPending;

	const handleFinish = () => {
		if (!isValid) return;
		if (isBiMonthly) {
			onFinish({
				name: name.trim(),
				amount: biMonthlyTotal,
				paySchedule,
				payDates: [Number(firstPayDay), Number(secondPayDay)],
				payAmounts: [firstAmt, secondAmt],
			});
		} else {
			onFinish({
				name: name.trim(),
				amount: Number(amount),
				paySchedule,
				payDates:
					paySchedule === 'monthly' ? [Number(firstPayDay)] : [dayOfWeek],
			});
		}
	};

	return (
		<ScrollView className="flex-1 bg-white pt-16 px-6">
			<Text className="text-2xl font-bold text-slate-900 mb-2">
				Add your income
			</Text>
			<Text className="text-slate-500 mb-6">
				Tell us about your primary income source.
			</Text>

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

			{!isBiMonthly && (
				<>
					<Text className="text-sm font-medium text-slate-700 mb-1">
						Net Salary
					</Text>
					<Text className="text-xs text-slate-400 mb-1">
						Enter your salary after tax deductions
					</Text>
					<TextInput
						className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'amount' ? 'border-teal-600' : 'border-slate-200'}`}
						placeholder="e.g., 15000"
						placeholderTextColor="#94a3b8"
						value={amount}
						onChangeText={setAmount}
						keyboardType="numeric"
						onFocus={() => setFocusedField('amount')}
						onBlur={() => setFocusedField(null)}
					/>
				</>
			)}

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

			{paySchedule === 'monthly' && (
				<View className="mb-4">
					<Text className="text-sm font-medium text-slate-700 mb-1">
						Pay day
					</Text>
					<TextInput
						className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 border ${focusedField === 'firstPayDay' ? 'border-teal-600' : 'border-slate-200'}`}
						placeholder="e.g., 15"
						placeholderTextColor="#94a3b8"
						value={firstPayDay}
						onChangeText={setFirstPayDay}
						keyboardType="numeric"
						onFocus={() => setFocusedField('firstPayDay')}
						onBlur={() => {
							clampDay(firstPayDay, setFirstPayDay);
							setFocusedField(null);
						}}
					/>
				</View>
			)}

			{isBiMonthly && (
				<View className="mb-4">
					<Text className="text-sm font-medium text-slate-700 mb-1">
						Pay days &amp; amounts
					</Text>
					<Text className="text-xs text-slate-400 mb-2">
						Enter your salary after tax deductions
					</Text>
					<View className="flex-row items-center gap-2 mb-2">
						<TextInput
							className={`w-16 bg-slate-50 rounded-xl px-3 py-3 text-base text-slate-900 border text-center ${focusedField === 'firstPayDay' ? 'border-teal-600' : 'border-slate-200'}`}
							placeholder="15"
							placeholderTextColor="#94a3b8"
							value={firstPayDay}
							onChangeText={setFirstPayDay}
							keyboardType="numeric"
							onFocus={() => setFocusedField('firstPayDay')}
							onBlur={() => {
								clampDay(firstPayDay, setFirstPayDay);
								setFocusedField(null);
							}}
						/>
						<Text className="text-slate-400 text-sm">day</Text>
						<TextInput
							className={`flex-1 bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 border ${focusedField === 'firstPayAmount' ? 'border-teal-600' : 'border-slate-200'}`}
							placeholder="e.g., 8000"
							placeholderTextColor="#94a3b8"
							value={firstPayAmount}
							onChangeText={setFirstPayAmount}
							keyboardType="numeric"
							onFocus={() => setFocusedField('firstPayAmount')}
							onBlur={() => setFocusedField(null)}
						/>
					</View>
					<View className="flex-row items-center gap-2 mb-2">
						<TextInput
							className={`w-16 bg-slate-50 rounded-xl px-3 py-3 text-base text-slate-900 border text-center ${focusedField === 'secondPayDay' ? 'border-teal-600' : 'border-slate-200'}`}
							placeholder="30"
							placeholderTextColor="#94a3b8"
							value={secondPayDay}
							onChangeText={setSecondPayDay}
							keyboardType="numeric"
							onFocus={() => setFocusedField('secondPayDay')}
							onBlur={() => {
								clampDay(secondPayDay, setSecondPayDay);
								setFocusedField(null);
							}}
						/>
						<Text className="text-slate-400 text-sm">day</Text>
						<TextInput
							className={`flex-1 bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 border ${focusedField === 'secondPayAmount' ? 'border-teal-600' : 'border-slate-200'}`}
							placeholder="e.g., 12000"
							placeholderTextColor="#94a3b8"
							value={secondPayAmount}
							onChangeText={setSecondPayAmount}
							keyboardType="numeric"
							onFocus={() => setFocusedField('secondPayAmount')}
							onBlur={() => setFocusedField(null)}
						/>
					</View>
					{biMonthlyTotal > 0 && (
						<Text className="text-xs text-teal-600 mt-1">
							Total: {biMonthlyTotal.toLocaleString()} / month
						</Text>
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
				className={`rounded-xl px-8 py-4 items-center mb-12 ${
					canSubmit ? 'bg-teal-600' : 'bg-slate-200'
				}`}
				onPress={handleFinish}
				disabled={!canSubmit}
			>
				<Text
					className={`text-base font-bold ${canSubmit ? 'text-white' : 'text-slate-400'}`}
				>
					{isPending ? 'Setting up...' : 'Start Budgeting'}
				</Text>
			</Pressable>
		</ScrollView>
	);
};
