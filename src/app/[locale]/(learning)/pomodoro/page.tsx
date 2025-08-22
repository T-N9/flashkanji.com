import Settings from '@/components/pomodoro/Setting';
import Timer from '@/components/pomodoro/Timer';

export default function Home() {

    return (
        <main className="min-h-screen flex flex-col items-center justify-center  p-4">
            <Timer />
            <Settings />
        </main>
    );
}