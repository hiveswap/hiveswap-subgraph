/* eslint-disable prefer-const */
import { FACTORY_ADDRESS, ZERO_BI, ONE_BI, ZERO_BD, ADDRESS_ZERO } from "./../utils/constants";
import { Factory } from "../generated/schema";
import { PoolCreated } from "../generated/Factory/Factory";
import { Pool, Token, Bundle } from "../generated/schema";
import { Pool as PoolTemplate } from "../generated/templates";
import { fetchTokenSymbol, fetchTokenName, fetchTokenTotalSupply, fetchTokenDecimals } from "../utils/token";
import { log, BigInt } from "@graphprotocol/graph-ts";
import { createEmptyFactory } from "../utils/new";

export function handlePoolCreated(event: PoolCreated): void {
  // load factory
  let factory = Factory.load(FACTORY_ADDRESS);
  if (!factory) {
    factory = createEmptyFactory();

    // create new bundle for tracking eth price
    let bundle = new Bundle("1");
    bundle.ethPriceUSD = ZERO_BD;
    bundle.save();
  }

  factory.poolCount = factory.poolCount.plus(ONE_BI);

  let pool = new Pool(event.params.pool.toHexString()) as Pool;
  let token0 = Token.load(event.params.token0.toHexString());
  let token1 = Token.load(event.params.token1.toHexString());

  // fetch info if null
  if (!token0) {
    token0 = new Token(event.params.token0.toHexString());
    token0.symbol = fetchTokenSymbol(event.params.token0);
    token0.name = fetchTokenName(event.params.token0);
    token0.totalSupply = fetchTokenTotalSupply(event.params.token0);
    let decimals = fetchTokenDecimals(event.params.token0);

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      log.debug("mybug the decimal on token 0 was null", []);
      return;
    }

    token0.decimals = decimals;
    token0.derivedETH = ZERO_BD;
    token0.derivedUSD = ZERO_BD;
    token0.volume = ZERO_BD;
    token0.volumeUSD = ZERO_BD;
    token0.feesUSD = ZERO_BD;
    token0.protocolFeesUSD = ZERO_BD;
    token0.untrackedVolumeUSD = ZERO_BD;
    token0.totalValueLocked = ZERO_BD;
    token0.totalValueLockedUSD = ZERO_BD;
    token0.totalValueLockedUSDUntracked = ZERO_BD;
    token0.txCount = ZERO_BI;
    token0.poolCount = ZERO_BI;
    token0.whitelistPools = [];
  }

  if (!token1) {
    token1 = new Token(event.params.token1.toHexString());
    token1.symbol = fetchTokenSymbol(event.params.token1);
    token1.name = fetchTokenName(event.params.token1);
    token1.totalSupply = fetchTokenTotalSupply(event.params.token1);
    let decimals = fetchTokenDecimals(event.params.token1);
    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      log.debug("mybug the decimal on token 0 was null", []);
      return;
    }
    token1.decimals = decimals;
    token1.derivedETH = ZERO_BD;
    token1.derivedUSD = ZERO_BD;
    token1.volume = ZERO_BD;
    token1.volumeUSD = ZERO_BD;
    token1.untrackedVolumeUSD = ZERO_BD;
    token1.feesUSD = ZERO_BD;
    token1.protocolFeesUSD = ZERO_BD;
    token1.totalValueLocked = ZERO_BD;
    token1.totalValueLockedUSD = ZERO_BD;
    token1.totalValueLockedUSDUntracked = ZERO_BD;
    token1.txCount = ZERO_BI;
    token1.poolCount = ZERO_BI;
    token1.whitelistPools = [];
  }

  let feeTier = BigInt.fromI32(event.params.fee);

  pool.token0 = token0.id;
  pool.token1 = token1.id;
  pool.feeTier = feeTier;
  pool.createdAtTimestamp = event.block.timestamp;
  pool.createdAtBlockNumber = event.block.number;
  pool.liquidityProviderCount = ZERO_BI;
  pool.txCount = ZERO_BI;
  pool.liquidity = ZERO_BI;
  pool.sqrtPrice = ZERO_BI;
  pool.feeGrowthGlobal0X128 = ZERO_BI;
  pool.feeGrowthGlobal1X128 = ZERO_BI;
  pool.feeProtocol = feeTierToProtoclFeeDefault(feeTier);
  pool.token0Price = ZERO_BD;
  pool.token1Price = ZERO_BD;
  pool.observationIndex = ZERO_BI;
  pool.totalValueLockedToken0 = ZERO_BD;
  pool.totalValueLockedToken1 = ZERO_BD;
  pool.totalValueLockedUSD = ZERO_BD;
  pool.totalValueLockedETH = ZERO_BD;
  pool.totalValueLockedUSDUntracked = ZERO_BD;
  pool.totalValueLockedETHUntracked = ZERO_BD;
  pool.volumeToken0 = ZERO_BD;
  pool.volumeToken1 = ZERO_BD;
  pool.volumeUSD = ZERO_BD;
  pool.feesUSD = ZERO_BD;
  pool.protocolFeesUSD = ZERO_BD;
  pool.untrackedVolumeUSD = ZERO_BD;

  pool.collectedFeesToken0 = ZERO_BD;
  pool.collectedFeesToken1 = ZERO_BD;
  pool.collectedFeesUSD = ZERO_BD;

  pool.save();
  // create the tracked contract based on the template
  PoolTemplate.create(event.params.pool);
  token0.save();
  token1.save();
  factory.save();
}

function feeTierToProtoclFeeDefault(feeTier: BigInt): BigInt {
  if (feeTier.equals(BigInt.fromI32(10000))) {
    return BigInt.fromI32(209718400);
  }
  if (feeTier.equals(BigInt.fromI32(2500))) {
    return BigInt.fromI32(209718400);
  }
  if (feeTier.equals(BigInt.fromI32(500))) {
    return BigInt.fromI32(222825800);
  }
  if (feeTier.equals(BigInt.fromI32(100))) {
    return BigInt.fromI32(216272100);
  }

  return BigInt.fromI32(209718400);
}
