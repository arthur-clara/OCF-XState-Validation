"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const valid_tx_vesting_start = (context, event) => {
    let valid = false;
    valid = true;
    // TBC: validation of tx_vesting_start
    if (valid) {
        return true;
    }
    else {
        return false;
    }
};
exports.default = valid_tx_vesting_start;