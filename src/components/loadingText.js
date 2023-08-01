import React, { useEffect, useState } from "react";
import { Text } from "react-native";


const LoadingText = () => {
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    let loadingInterval = setInterval(() => {
      setLoadingText((prevText) => {
        if (prevText === "Loading...") return "Loading";
        else return prevText + ".";
      });
    }, 500);

    return () => clearInterval(loadingInterval);
  }, []);

  return <Text style={{alignSelf: 'center', textAlignVertical: 'center', flex: 1}}>{loadingText}</Text>;
};

export default LoadingText;
