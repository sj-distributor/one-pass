import React from "react";

import { CardType } from "../../types/card-types";
import { Card } from "../card/card";

type InitiatorType = Omit<CardType, "targetPosition">;

const InitiatorInner = (props: InitiatorType) => (
  <Card
    {...props}
    targetPosition={undefined}
    className={props.className ?? "one-pass-card-initiator"}
  />
);

export const Initiator = React.memo(
  InitiatorInner,
) as unknown as typeof InitiatorInner;
