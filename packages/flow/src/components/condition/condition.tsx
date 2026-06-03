import React from "react";

import { CardType } from "../../types/card-types";
import { Card } from "../card/card";

const ConditionInner = (props: CardType) => (
  <Card
    {...props}
    className={props.className ?? "one-pass-card-condition"}
    allowDelete={props.allowDelete ?? true}
    allowCopy={props.allowCopy ?? true}
  />
);

export const Condition = React.memo(
  ConditionInner,
) as unknown as typeof ConditionInner;
