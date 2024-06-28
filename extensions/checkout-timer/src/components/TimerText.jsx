import { Text, useSettings } from "@shopify/ui-extensions-react/checkout";
import React, { useEffect, useState } from "react";

const TimerText = ({ timeProps }) => {
  const [time, setTime] = useState(timeProps);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, []);
  const { time_up_message: TIME_UP_MESSAGE } = useSettings();
  const getTimeInFormate = () => {
    if (time === 0) {
      return TIME_UP_MESSAGE || "Time is up!";
    }
    const minutesLeft = Math.floor(time / 60);
    const secondLeft = time % 60;
    return `${minutesLeft.toString().padStart(2, "0")}:${secondLeft
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <Text emphasis="bold" appearance="critical">
      {getTimeInFormate()}
    </Text>
  );
};

export default TimerText;
