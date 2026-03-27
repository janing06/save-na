import { Ionicons } from '@expo/vector-icons';
import type {
	IncomeSource,
	NotificationSettings,
	PaySchedule,
} from '@shared/lib';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimePickerModal } from './time-picker-modal';

const scheduleOptions: { value: PaySchedule; label: string }[] = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'bi-monthly', label: 'Twice a month' },
	{ value: 'bi-weekly', label: 'Every 2 weeks' },
	{ value: 'weekly', label: 'Every week' },
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

const dayOfWeekOptions = [
	{ value: 0, label: 'Sun' },
	{ value: 1, label: 'Mon' },
	{ value: 2, label: 'Tue' },
	{ value: 3, label: 'Wed' },
	{ value: 4, label: 'Thu' },
	{ value: 5, label: 'Fri' },
	{ value: 6, label: 'Sat' },
];

type Props = {
	editingSource: IncomeSource | null;
	initialNotifications: NotificationSettings;
	onSubmit: (input: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
		payAmounts?: number[];
		notifications: NotificationSettings;
	}) => void;
	onDelete?: () => void;
	onClose: () => void;
	isPending: boolean;
};

export const IncomeSourceFormPage = ({
	editingSource,
	initialNotifications,
	onSubmit,
	onDelete,
	onClose,
	isPending,
}: Props) => {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [paySchedule, setPaySchedule] = useState<PaySchedule>('bi-monthly');
	const [firstPayDay, setFirstPayDay] = useState('15');
	const [secondPayDay, setSecondPayDay] = useState('30');
	const [firstPayAmount, setFirstPayAmount] = useState('');
	const [secondPayAmount, setSecondPayAmount] = useState('');
	const [dayOfWeek, setDayOfWeek] = useState(5);
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [paydayEnabled, setPaydayEnabled] = useState(true);
	const [paydayTime, setPaydayTime] = useState('10:00');
	const [budgetReminderEnabled, setBudgetReminderEnabled] = useState(true);
	const [budgetReminderTime, setBudgetReminderTime] = useState('10:00');
	const [timePickerTarget, setTimePickerTarget] = useState<
		'payday' | 'budget_reminder' | null
	>(null);

	useEffect(() => {
		setPaydayEnabled(initialNotifications.paydayEnabled);
		setPaydayTime(initialNotifications.paydayTime);
		setBudgetReminderEnabled(initialNotifications.budgetReminderEnabled);
		setBudgetReminderTime(initialNotifications.budgetReminderTime);

		if (editingSource) {
			setName(editingSource.name);
			setPaySchedule(editingSource.pay_schedule);
			let dates: number[] = [];
			try {
				dates = JSON.parse(editingSource.pay_dates);
			} catch {
				dates = [];
			}
			if (editingSource.pay_schedule === 'bi-monthly') {
				setFirstPayDay(String(dates[0] ?? 15));
				setSecondPayDay(String(dates[1] ?? 30));
				if (editingSource.pay_amounts) {
					try {
						const amounts: number[] = JSON.parse(editingSource.pay_amounts);
						setFirstPayAmount(String(amounts[0] ?? ''));
						setSecondPayAmount(String(amounts[1] ?? ''));
						setAmount('');
					} catch {
						setFirstPayAmount('');
						setSecondPayAmount('');
						setAmount(String(editingSource.amount));
					}
				} else {
					setFirstPayAmount('');
					setSecondPayAmount('');
					setAmount(String(editingSource.amount));
				}
			} else if (editingSource.pay_schedule === 'monthly') {
				setFirstPayDay(String(dates[0] ?? 1));
				setAmount(String(editingSource.amount));
			} else {
				setDayOfWeek(dates[0] ?? 5);
				setAmount(String(editingSource.amount));
			}
		} else {
			setName('');
			setAmount('');
			setPaySchedule('bi-monthly');
			setFirstPayDay('15');
			setSecondPayDay('30');
			setFirstPayAmount('');
			setSecondPayAmount('');
			setDayOfWeek(5);
		}
	}, [editingSource, initialNotifications]);

	const formatTime = (time: string): string => {
		const [hourStr] = time.split(':');
		const hour = Number(hourStr);
		const period = hour < 12 ? 'AM' : 'PM';
		const display = hour === 12 ? 12 : hour % 12;
		return `${display}:00 ${period}`;
	};

	const isBiMonthly = paySchedule === 'bi-monthly';
	const firstAmt = Number(firstPayAmount);
	const secondAmt = Number(secondPayAmount);
	const biMonthlyTotal = firstAmt + secondAmt;

	const isValid = isBiMonthly
		? name.trim() !== '' && firstAmt > 0 && secondAmt > 0
		: name.trim() !== '' && Number(amount) > 0;

	const canSubmit = isValid && !isPending;
	const submitLabel = isPending
		? 'Saving...'
		: editingSource
			? 'Save Changes'
			: 'Add Income';

	const handleSubmit = () => {
		if (!isValid) return;
		const notifications: NotificationSettings = {
			paydayEnabled,
			paydayTime,
			budgetReminderEnabled,
			budgetReminderTime,
		};
		if (isBiMonthly) {
			onSubmit({
				name: name.trim(),
				amount: biMonthlyTotal,
				paySchedule,
				payDates: [Number(firstPayDay), Number(secondPayDay)],
				payAmounts: [firstAmt, secondAmt],
				notifications,
			});
		} else {
			onSubmit({
				name: name.trim(),
				amount: Number(amount),
				paySchedule,
				payDates:
					paySchedule === 'monthly' ? [Number(firstPayDay)] : [dayOfWeek],
				notifications,
			});
		}
	};

	return (
		<SafeAreaView edges={['top']} className="flex-1 bg-white">
			<ScrollView className="flex-1 px-6 pt-6">
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

				{!isBiMonthly && (
					<>
						<Text className="text-sm font-medium text-slate-700 mb-1">
							Net Salary
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
						<Text className="text-sm font-medium text-slate-700 mb-2">
							Pay days &amp; amounts
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

				{/* Notifications section */}
				<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mt-6 mb-1.5">
					Notifications
				</Text>
				<View className="bg-slate-50 rounded-2xl overflow-hidden mb-4">
					{/* Payday row */}
					<View className="flex-row items-center px-4 py-3 border-b border-slate-100">
						<View className="flex-1">
							<Text className="text-sm font-medium text-slate-900">
								Payday alert
							</Text>
							<Text className="text-xs text-slate-400 mt-0.5">
								Remind me on payday
							</Text>
						</View>
						<Pressable
							onPress={() => {
								if (paydayEnabled) setTimePickerTarget('payday');
							}}
							className="mr-3"
						>
							<Text
								className={`text-sm ${paydayEnabled ? 'text-teal-600' : 'text-slate-300'}`}
							>
								{formatTime(paydayTime)}
							</Text>
						</Pressable>
						<Pressable
							onPress={() => setPaydayEnabled((v) => !v)}
							className={`w-10 h-6 rounded-full justify-center ${paydayEnabled ? 'bg-teal-600' : 'bg-slate-200'}`}
						>
							<View
								className={`w-5 h-5 rounded-full bg-white mx-0.5 ${paydayEnabled ? 'self-end' : 'self-start'}`}
							/>
						</Pressable>
					</View>
					{/* Budget reminder row */}
					<View className="flex-row items-center px-4 py-3">
						<View className="flex-1">
							<Text className="text-sm font-medium text-slate-900">
								Budget reminder
							</Text>
							<Text className="text-xs text-slate-400 mt-0.5">
								2 days after payday
							</Text>
						</View>
						<Pressable
							onPress={() => {
								if (budgetReminderEnabled)
									setTimePickerTarget('budget_reminder');
							}}
							className="mr-3"
						>
							<Text
								className={`text-sm ${budgetReminderEnabled ? 'text-teal-600' : 'text-slate-300'}`}
							>
								{formatTime(budgetReminderTime)}
							</Text>
						</Pressable>
						<Pressable
							onPress={() => setBudgetReminderEnabled((v) => !v)}
							className={`w-10 h-6 rounded-full justify-center ${budgetReminderEnabled ? 'bg-teal-600' : 'bg-slate-200'}`}
						>
							<View
								className={`w-5 h-5 rounded-full bg-white mx-0.5 ${budgetReminderEnabled ? 'self-end' : 'self-start'}`}
							/>
						</Pressable>
					</View>
				</View>

				{/* Time picker modal */}
				<TimePickerModal
					visible={timePickerTarget !== null}
					selectedTime={
						timePickerTarget === 'payday' ? paydayTime : budgetReminderTime
					}
					onSelect={(time) => {
						if (timePickerTarget === 'payday') setPaydayTime(time);
						else setBudgetReminderTime(time);
					}}
					onClose={() => setTimePickerTarget(null)}
				/>

				<Pressable
					className={`rounded-xl px-8 py-4 items-center mb-3 ${
						canSubmit ? 'bg-teal-600' : 'bg-slate-200'
					}`}
					onPress={handleSubmit}
					disabled={!canSubmit}
				>
					<Text
						className={`text-base font-bold ${canSubmit ? 'text-white' : 'text-slate-400'}`}
					>
						{submitLabel}
					</Text>
				</Pressable>

				{editingSource && onDelete && (
					<Pressable className="items-center py-3 mb-12" onPress={onDelete}>
						<Text className="text-red-500 text-sm font-semibold">
							Delete Income Source
						</Text>
					</Pressable>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};
