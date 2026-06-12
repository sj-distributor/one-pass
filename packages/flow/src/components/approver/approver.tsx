import React from "react";

import { CardType } from "../../types/card-types";
import { Card } from "../card/card";

const ApproverInner = (props: CardType) => (
  <Card
    {...props}
    className="one-pass-card-approver"
    allowDelete={props.allowDelete ?? true}
  />
);

export const Approver = React.memo(
  ApproverInner,
) as unknown as typeof ApproverInner;
