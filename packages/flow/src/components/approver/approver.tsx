import React from "react";

import { CardType } from "../../types/card-types";
import { Card } from "../card/card";

export const Approver = (props: CardType) => (
  <Card
    {...props}
    className="one-pass-card-approver"
    allowDelete={props.allowDelete ?? true}
  />
);
