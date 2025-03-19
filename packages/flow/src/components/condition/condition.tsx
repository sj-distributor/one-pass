import React from "react";

import { CardType } from "../../types/card-types";
import { Card } from "../card/card";

export const Condition = (props: CardType) => (
  <Card
    {...props}
    className={props.className ?? "one-pass-card-condition"}
    allowDelete={props.allowDelete ?? true}
    allowCopy={props.allowCopy ?? true}
  />
);
