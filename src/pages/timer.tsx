import { useEffect, useState } from "react";
import icon_clock from "../assets/clock.svg";
import icon_people from "../assets/people.svg";
import { invoke } from "@tauri-apps/api/tauri";

function Timer() {
    const [currentTime, setCurrentTime] = useState({ hour: 0, minute: 0, second: 0 });
    const [startTime, setStartTime] = useState({ hour: 0, minute: 0, second: 0 });
    const [timeLeft, setTimeLeft] = useState(0);
    const [duration, setDuration] = useState(0);

    //configurables
    const [timeEnd, setTimeEnd] = useState({ hour: 20, minute: 58, second: 0 });
    const [askAssistant, setAskAssistant] = useState(45)

    interface Time {
        hour: number;
        minute: number;
        second: number;
    }

    async function set_start_time() {
        setStartTime(await invoke("get_current_time"));
    }

    async function get_current_time() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setCurrentTime(await invoke("get_current_time"));
    }

    async function get_time_remaining(timeEnd: Time) {
        setTimeLeft(await invoke("get_time_remaining", {
            timeEndHr: timeEnd.hour,
            timeEndMnt: timeEnd.minute,
            timeEndSec: timeEnd.second
        }));
    }

    useEffect(() => {
        set_start_time();
        const interval = setInterval(() => {
            get_current_time();
            get_time_remaining(timeEnd);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-br from-[#1A2E36] to-[#1D1131] min-h-screen font-['Rubik']">
            <div className="flex flex-col gap-8 h-[75vh] mx-6 items-center justify-center text-center overflow-clip">
                <div className="text-7xl font-medium text-[#C8EFFF] opacity-90 text-ellipsis md:text-9xl">
                    {String(currentTime.hour).padStart(2, '0')} :  {String(currentTime.minute).padStart(2, '0')} :  {String(currentTime.second).padStart(2, '0')}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-xl text-white opacity-80 md:text-3xl">
                        Pengumpulan dalam {timeLeft} menit!
                    </div>
                    <div className="text-lg text-white opacity-80 md:text-2xl">
                        Dikumpulkan tepat pada pukul {String(timeEnd.hour).padStart(2, '0')} :  {String(timeEnd.minute).padStart(2, '0')}
                        {/* {startTime.hour} : {startTime.minute} : {startTime.second} */}
                    </div>
                </div>
            </div>
            <div className="bg-black h-[25vh] w-[100vw] bg-opacity-50 flex flex-row items-center justify-center divide-x-2 divide-[#ffffff80] gap-x-8 overflow-clip">
                <div className="flex flex-row">
                    <img src={icon_people} alt="tanya asisten" className="scale-[60%]" />
                    <div className="flex flex-col text-white justify-center">
                        <div>
                            Boleh bertanya asisten?
                        </div>
                        <div className="font-bold text-lg">
                            XX menit lagi
                        </div>
                    </div>
                </div>
                <div className="flex flex-row pl-2">
                    <img src={icon_clock} alt="tanya asisten" className="scale-[60%]" />
                    <div className="flex flex-col text-white justify-center">
                        <div>
                            Durasi Praktikum
                        </div>
                        <div className="font-bold text-lg">
                            {duration} menit
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Timer;
