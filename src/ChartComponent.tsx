import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';

export default function ChartComponent({ selectedDate, tasks }) {
    const [moodData, setMoodData] = useState<number[]>([]);
    const [stressData, setStressData] = useState<number[]>([]);
    const [reliefData, setReliefData] = useState<number[]>([]);

    useEffect(() => {
        // load tasks for the new selectedDate
        const datesAndTasks = localStorage.getItem('datesAndTasks') ? JSON.parse(localStorage.getItem('datesAndTasks')!) : [];
        const existingEntry = datesAndTasks.find((obj: any) => obj.date === selectedDate.format('YYYY-MM-DD'));
        const tasks = (existingEntry ? existingEntry.tasks : []);

        // Update state with new data
        setMoodData(tasks.map((task) => task.mood));
        setStressData(tasks.map((task) => task.stress));
        setReliefData(tasks.map((task) => task.relief));
    }, [selectedDate, tasks]);

    return (
        <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
            <LineChart
                height={300}
                grid={{ horizontal: true }}
                yAxis={[{ min: 0, max: 10 }]}
                series={[
                    {
                        data: moodData,
                        curve: "linear",
                        label: 'Mood',
                        color: 'green',
                    },
                    {
                        data: stressData,
                        curve: "linear",
                        label: 'Stress',
                        color: 'red',
                    },
                    {
                        data: reliefData,
                        curve: "linear",
                        label: 'Relief',
                        color: 'orange',
                    }
                ]}
            />
        </Stack>
    );
}
