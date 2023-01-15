import React from "react";

export interface StyleSheet {
  [key: string | number | symbol]: React.CSSProperties;
}
