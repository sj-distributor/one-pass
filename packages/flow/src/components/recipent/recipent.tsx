import React from "react";

import { CardType } from "../../types/card-types";
import { Card } from "../card/card";

const RecipientInner = (props: CardType) => (
  <Card
    {...props}
    className={props.className ?? "one-pass-card-cc-recipient"}
    allowDelete={props.allowDelete ?? true}
  />
);

export const Recipient = React.memo(
  RecipientInner,
) as unknown as typeof RecipientInner;
