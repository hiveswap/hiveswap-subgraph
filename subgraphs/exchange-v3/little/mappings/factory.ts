/* eslint-disable prefer-const */
import { ADDRESS_ZERO, FACTORY_ADDRESS, ONE_BI, ZERO_BD, ZERO_BI } from "./../utils/constants";
import { Bundle, Factory } from "../generated/schema";
import { PoolCreated } from "../generated/Factory/Factory";

export function handlePoolCreated(event: PoolCreated): void {
  // load factory
  let factory = Factory.load(FACTORY_ADDRESS);
  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS);
    factory.poolCount = ZERO_BI;
    factory.totalVolumeETH = ZERO_BD;
    factory.totalVolumeUSD = ZERO_BD;
    factory.untrackedVolumeUSD = ZERO_BD;
    factory.totalFeesUSD = ZERO_BD;
    factory.totalFeesETH = ZERO_BD;
    factory.totalProtocolFeesUSD = ZERO_BD;
    factory.totalProtocolFeesETH = ZERO_BD;
    factory.totalValueLockedETH = ZERO_BD;
    factory.totalValueLockedUSD = ZERO_BD;
    factory.totalValueLockedUSDUntracked = ZERO_BD;
    factory.totalValueLockedETHUntracked = ZERO_BD;
    factory.txCount = ZERO_BI;
    factory.owner = ADDRESS_ZERO;

    // create new bundle for tracking eth price
    let bundle = new Bundle("1");
    bundle.ethPriceUSD = ZERO_BD;
    bundle.save();
  }

  factory.poolCount = factory.poolCount.plus(ONE_BI);

  factory.save();
}

