/* eslint-disable prefer-const */
import { Bundle, Factory } from "../generated/schema";
import { PoolCreated } from "../generated/Factory/Factory";
/* eslint-disable prefer-const */
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";


export function handlePoolCreated(event: PoolCreated): void {
  const ZERO_BD =  BigDecimal.fromString("0")
  const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  // load factory
  let factory = Factory.load("0xa67D9F9Ff6F75693A2Dc89727266D934Bef491f7");
  if (factory === null) {
    factory = new Factory("0xa67D9F9Ff6F75693A2Dc89727266D934Bef491f7");
    factory.poolCount = BigInt.fromI32(0);
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
    factory.txCount = BigInt.fromI32(0);
    factory.owner = ADDRESS_ZERO;

    // create new bundle for tracking eth price
    // let bundle = new Bundle("1");
    // bundle.ethPriceUSD = ZERO_BD;
    // bundle.save();
  }

  factory.poolCount = factory.poolCount.plus(BigInt.fromI32(1));

  factory.save();
}

