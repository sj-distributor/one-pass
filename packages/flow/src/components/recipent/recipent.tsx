import React from "react";

import { CardType } from "../../types/card-types";
import { Card } from "../card/card";

export const Recipient = (props: CardType) => (
  <Card
    {...props}
    className={props.className ?? "one-pass-card-cc-recipient"}
    allowDelete={props.allowDelete ?? true}
  />
);
