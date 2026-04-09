import { formatCurrency, useThemeColors } from '@shared/lib';
import { Text, View } from 'react-native';
import { Circle, Svg, Text as SvgText } from 'react-native-svg';

type Segment = {
	name: string;
	amount: number;
	percentage: number;
	color: string;
};

type Props = {
	segments: Segment[];
	unallocated: { amount: number; percentage: number };
	totalIncome: number;
	currency: string;
};

const SIZE = 130;
const STROKE_WIDTH = 18;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const DonutChart = ({
	segments,
	unallocated,
	totalIncome,
	currency,
}: Props) => {
	const colors = useThemeColors();
	const segmentArcs = segments.reduce<{ dashLength: number; offset: number }[]>(
		(acc, segment) => {
			const dashLength = (segment.percentage / 100) * CIRCUMFERENCE;
			const prevOffset =
				acc.length > 0
					? acc[acc.length - 1].offset + acc[acc.length - 1].dashLength
					: 0;
			acc.push({ dashLength, offset: prevOffset });
			return acc;
		},
		[],
	);

	return (
		<View className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm">
			<Text className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
				Budget Breakdown
			</Text>

			<View className="flex-row items-center gap-5">
				<Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
					{/* Gray background ring (unallocated) */}
					<Circle
						cx={SIZE / 2}
						cy={SIZE / 2}
						r={RADIUS}
						fill="none"
						stroke={colors.surface}
						strokeWidth={STROKE_WIDTH}
					/>

					{/* Category segments */}
					{segments.map((segment, index) => {
						const arc = segmentArcs[index];
						return (
							<Circle
								key={segment.name}
								cx={SIZE / 2}
								cy={SIZE / 2}
								r={RADIUS}
								fill="none"
								stroke={segment.color}
								strokeWidth={STROKE_WIDTH}
								strokeDasharray={`${arc.dashLength} ${CIRCUMFERENCE - arc.dashLength}`}
								strokeDashoffset={CIRCUMFERENCE - arc.offset}
								rotation={-90}
								origin={`${SIZE / 2}, ${SIZE / 2}`}
							/>
						);
					})}

					{/* Center text */}
					<SvgText
						x={SIZE / 2}
						y={SIZE / 2 - 8}
						textAnchor="middle"
						fontSize={10}
						fill={colors.textSecondary}
					>
						Income
					</SvgText>
					<SvgText
						x={SIZE / 2}
						y={SIZE / 2 + 10}
						textAnchor="middle"
						fontSize={14}
						fontWeight="700"
						fill={colors.text}
					>
						{formatCurrency(totalIncome, currency)}
					</SvgText>
				</Svg>

				{/* Legend */}
				<View className="flex-1 gap-1.5">
					{segments.map((segment) => (
						<View key={segment.name} className="flex-row items-center gap-1.5">
							<View
								className="w-2 h-2 rounded-full shrink-0"
								style={{ backgroundColor: segment.color }}
							/>
							<Text
								className="text-xs text-slate-500 dark:text-slate-400 shrink"
								numberOfLines={1}
							>
								{segment.name}
							</Text>
							<Text className="text-xs text-slate-500 dark:text-slate-400 ml-auto shrink-0">
								{formatCurrency(segment.amount, currency)}{' '}
								<Text className="opacity-70">
									({Math.round(segment.percentage)}%)
								</Text>
							</Text>
						</View>
					))}

					{/* Unallocated row */}
					{unallocated.amount > 0 && (
						<View className="border-t border-slate-200 dark:border-zinc-800 mt-1 pt-1.5">
							<View className="flex-row items-center gap-1.5">
								<View className="w-2 h-2 rounded-full shrink-0 bg-slate-100 dark:bg-black" />
								<Text className="text-xs text-slate-400 dark:text-slate-500">
									Unallocated
								</Text>
								<Text className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
									{formatCurrency(unallocated.amount, currency)}{' '}
									<Text className="opacity-70">
										({Math.round(unallocated.percentage)}%)
									</Text>
								</Text>
							</View>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};
