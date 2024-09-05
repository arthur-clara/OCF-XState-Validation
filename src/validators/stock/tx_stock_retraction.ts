import {OcfMachineContext} from '../../ocfMachine';

/*
CURRENT CHECKS:
A stock issuance with a corresponding security ID must exist for the security_id variable
The date of the stock issuance referred to in the security_id must have a date equal to or earlier than the date of the stock retraction
The given stock issuance must not have a stock acceptance transaction associated with it

MISSING CHECKS:
None
*/

const valid_tx_stock_retraction = (context: OcfMachineContext, event: any) => {
  let valid = false;
  // TBC: validation of tx_stock_retraction
  const {transactions} = context.ocfPackageContent;
  // Check that stock issuance in incoming security_id referenced by transaction exists in current state.
  let incoming_stockIssuance_validity = false;
  context.stockIssuances.forEach((ele: any) => {
    if (
      ele.security_id === event.data.security_id &&
      ele.object_type === 'TX_STOCK_ISSUANCE'
    ) {
      incoming_stockIssuance_validity = true;
      console.log(
        `\x1b[92m\u2714 The incoming security (${event.data.security_id}) for this retraction exists.\x1b[0m`
      );
    }
  });
  if (!incoming_stockIssuance_validity) {
    console.log(
      `\x1b[91m\u2718 The incoming security (${event.data.security_id}) for this retraction does not exist in the current cap table.\x1b[0m`
    );
  }

  // Check to ensure that the date of transaction is the same day or after the date of the incoming stock issuance.
  let incoming_date_validity = false;
  transactions.forEach((ele: any) => {
    if (
      ele.security_id === event.data.security_id &&
      ele.object_type === 'TX_STOCK_ISSUANCE'
    ) {
      if (ele.date <= event.data.date) {
        incoming_date_validity = true;
        console.log(
          `\x1b[92m\u2714 The date of this retraction is on or after the date of the incoming security (${event.data.security_id}).\x1b[0m`
        );
      }
    }
  });
  if (!incoming_date_validity) {
    console.log(
      `\x1b[91m\u2718 The date of this retraction is not on or after the date of the incoming security (${event.data.security_id}).\x1b[0m`
    );
  }

  // Check that stock issuance in incoming security_id does not have a stock acceptance transaction associated with it.
  let no_stock_acceptance_validity = false;
  let stock_acceptance_exists = false;
  transactions.forEach((ele: any) => {
    if (
      ele.security_id === event.data.security_id &&
      ele.object_type === 'TX_STOCK_ACCEPTANCE'
    ) {
      stock_acceptance_exists = true;
    }
  });

  if (!stock_acceptance_exists) {
    no_stock_acceptance_validity = true;
    console.log(
      `\x1b[92m\u2714 The incoming security (${event.data.security_id}) for this retraction does not have an acceptance linked to it.\x1b[0m`
    );
  }
  if (!no_stock_acceptance_validity) {
    console.log(
      `\x1b[91m\u2718 The incoming security (${event.data.security_id}) for this retraction has an acceptance linked to it.\x1b[0m`
    );
  }

  if (
    incoming_stockIssuance_validity &&
    incoming_date_validity &&
    no_stock_acceptance_validity
  ) {
    valid = true;
  }

  if (valid) {
    return true;
  } else {
    return false;
  }
};

export default valid_tx_stock_retraction;
