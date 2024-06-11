import { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";

export const useCountdown = (date = [2022, 3, 15, 20]) => {
  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");

  let interval = useRef();

  const startTimer = () => {
    //const target = DateTime.utc(date[0],date[1],date[3],date[4]);
    const target = DateTime.utc(date[0], date[1], date[2], date[3]);
    setInterval(() => {
      const distance = target.diffNow() > 0 ? target.diffNow() : 0;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimerDays(days.toString().padStart(2, "0"));
      setTimerHours(hours.toString().padStart(2, "0"));
      setTimerMinutes(minutes.toString().padStart(2, "0"));
      setTimerSeconds(seconds.toString().padStart(2, "0"));

      if (distance < 0) {
        clearInterval(interval.current);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return {
    timerDays,
    timerHours,
    timerMinutes,
    timerSeconds,
  };
};

export const useCountdownV2 = () => {
  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [timerSeconds, setTimerSeconds] = useState('00');
  const [date, setdate] = useState(0);
  const [isNotActive, setisNotActive] = useState(true)

  const [timeShow, settimeShow] = useState('00:00:00:00');

  const setDate = (date) => {
    // if(date != 0) return
    // console.log(date, 'useCountdownV2');
    setdate(date);
  };

  const startTimer = () => {
    if (date == null) return;
    //const target = DateTime.utc(date[0],date[1],date[3],date[4]);
    const target = DateTime.fromSeconds(date);
    // console.log(target.toString(), 'target');
    const time = setInterval(() => {
      const distance = target.diffNow() > 0 ? target.diffNow() : 0;

      // console.log(distance,"distance");
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);      
      days = days.toString().length>1?days:`0${days}`
      hours = hours.toString().length>1?hours:`0${hours}`
      minutes = minutes.toString().length>1?minutes:`0${minutes}`
      seconds = seconds.toString().length>1?seconds:`0${seconds}`

      // console.log(`days: ${days} hours: ${hours} minutes: ${minutes} seconds: ${seconds}`);

      if (distance < 0) {
        setisNotActive(false)
        clearInterval(time);
      } else {
        settimeShow(`${days}:${hours}:${minutes}:${seconds}`);
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
    return time;
  };

  useEffect(() => {
    const time = startTimer();
    return () => {
      clearInterval(time);
    };
  }, [date]);

  return {
    timerDays,
    timerHours,
    timerMinutes,
    timerSeconds,
    setDate,
    timeShow,
    isNotActive,
  };
};