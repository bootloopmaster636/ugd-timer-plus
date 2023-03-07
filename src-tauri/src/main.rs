// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use core::time;

use chrono::prelude::*;

//struct defs
#[derive(serde::Serialize, serde::Deserialize)]
struct Clock {
    hour: u32,
    minute: u32,
    second: u32,
}

//functions
fn convert_clock_to_sec(time: &Clock) -> u32 {
    (time.hour * 3600) + (time.minute * 60) + (time.second)
}

fn convert_sec_to_clock(secs: &u32) -> Clock {
    let mut total_sec = *secs;

    let hours = total_sec / 3600;
    total_sec %= 3600;

    let minutes = total_sec / 60;
    total_sec %= 60;

    let seconds = total_sec;

    Clock {
        hour: hours,
        minute: minutes,
        second: seconds,
    }
}

#[tauri::command]
fn get_current_time() -> Clock {
    //this function is returning current local time with a struct
    let time: DateTime<Local> = Local::now();

    Clock {
        hour: time.hour(),
        minute: time.minute(),
        second: time.second(),
    }
}

#[tauri::command]
fn get_time_remaining(time_end_hr: u32, time_end_mnt: u32, time_end_sec: u32) -> u32 {
    //this function is returning the time remaining in minutes
    let now: Clock = get_current_time();
    let time_end: Clock = Clock {
        hour: time_end_hr,
        minute: time_end_mnt,
        second: time_end_sec,
    };

    //covert all to seconds so its easier
    let now: u32 = convert_clock_to_sec(&now);
    let end: u32 = convert_clock_to_sec(&time_end);

    //count the difference
    let diff = end - now;

    (diff / 61) + 1
}

#[tauri::command]
fn get_duration(
    time_start_hr: u32,
    time_start_mnt: u32,
    time_start_sec: u32,
    time_end_hr: u32,
    time_end_mnt: u32,
    time_end_sec: u32,
) -> u32 {
    let time_start: Clock = Clock {
        hour: time_start_hr,
        minute: time_start_mnt,
        second: time_start_sec,
    };
    let time_end: Clock = Clock {
        hour: time_end_hr,
        minute: time_end_mnt,
        second: time_end_sec,
    };

    //covert all to seconds so its easier
    let start: u32 = convert_clock_to_sec(&time_start);
    let end: u32 = convert_clock_to_sec(&time_end);

    //count the difference
    let diff = end - start;

    (diff / 61) + 1
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_current_time,
            get_time_remaining,
            get_duration
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // let time_end = Clock {
    //     hour: 21,
    //     minute: 0,
    //     second: 0,
    // };

    // let time_remaining = get_time_remaining(time_end);
    // println!("time remaining: {}", time_remaining);
}
