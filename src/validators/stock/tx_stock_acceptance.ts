import {OcfMachineContext} from '../../ocfMachine';

/*
CURRENT CHECKS:
A stock issuance with a corresponding security ID must exist for the security_id variable
The date of the stock issuance referred to in the security_id must have a date equal to or earlier than the date of the stock acceptance
The given stock issuance must not have a stock retraction transaction associated with it

MISSING CHECKS:
None
*/

const valid_tx_stock_acceptance = (context: OcfMachineContext, event: any) => {
  const {transactions} = context.ocfPackageContent;

  let valid = false;
  // TBC: validation of tx_stock_acceptance

  // Check that stock issuance in incoming security_id referenced by transaction exists in current state.
  let incoming_stockIssuance_validity = false;
  context.stockIssuances.forEach((ele: any) => {
    if (
      ele.security_id === event.data.security_id &&
      ele.object_type === 'TX_STOCK_ISSUANCE'
    ) {
      incoming_stockIssuance_validity = true;
      console.log(
        `\x1b[92m\u2714 The incoming security (${event.data.security_id}) for this acceptance exists.\x1b[0m`
      );
    }
  });
  if (!incoming_stockIssuance_validity) {
    console.log(
      `\x1b[91m\u2718 The incoming security (${event.data.security_id}) for this acceptance does not exist in the current cap table.\x1b[0m`
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
          `\x1b[92m\u2714 The date of this acceptance is on or after the date of the incoming security (${event.data.security_id}).\x1b[0m`
        );
      }
    }
  });
  if (!incoming_date_validity) {
    console.log(
      `\x1b[91m\u2718 The date of this acceptance is not on or after the date of the incoming security (${event.data.security_id}).\x1b[0m`
    );
  }

  // Check that stock issuance in incoming security_id does not have a stock retraction transaction associated with it.
  let no_stock_retraction_validity = false;
  let stock_retraction_exists = false;
  transactions.forEach((ele: any) => {
    if (
      ele.security_id === event.data.security_id &&
      ele.object_type === 'TX_STOCK_RETRACTION'
    ) {
      stock_retraction_exists = true;
    }
  });

  if (!stock_retraction_exists) {
    no_stock_retraction_validity = true;
    console.log(
      `\x1b[92m\u2714 The incoming security (${event.data.security_id}) for this acceptance does not have an retraction linked to it.\x1b[0m`
    );
  }
  if (!no_stock_retraction_validity) {
    console.log(
      `\x1b[91m\u2718 The incoming security (${event.data.security_id}) for this acceptance has an retraction linked to it.\x1b[0m`
    );
  }

  if (
    incoming_stockIssuance_validity &&
    incoming_date_validity &&
    no_stock_retraction_validity
  ) {
    valid = true;
  }

  if (valid) {
    return true;
  } else {
    return false;
  }
};

export default valid_tx_stock_acceptance;
