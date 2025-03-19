import React from "react";

import { CardType } from "../../types/card-types";
import { Card } from "../card/card";

type InitiatorType = Omit<CardType, "targetPosition">;

export const Initiator = (props: InitiatorType) => (
  <Card
    {...props}
    targetPosition={undefined}
    className={props.className ?? "one-pass-card-initiator"}
  />
);
